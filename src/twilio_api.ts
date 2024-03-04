import { Request, Response } from "express";
import VoiceResponse from "twilio/lib/twiml/VoiceResponse";
import expressWs from "express-ws";
import twilio, { Twilio } from "twilio";
import { RetellClient } from "retell-sdk";
import {
  AudioWebsocketProtocol,
  AudioEncoding,
} from "retell-sdk/models/components";

export class TwilioClient {
  private twilio: Twilio;
  private retellClient: RetellClient;

  constructor() {
    this.twilio = twilio(
      process.env.TWILIO_ACCOUNT_ID,
      process.env.TWILIO_AUTH_TOKEN,
    );
    this.retellClient = new RetellClient({
      apiKey: process.env.RETELL_API_KEY,
    });
  }

  // Create a new phone number and route it to use this server.
  CreatePhoneNumber = async (areaCode: number, agentId: string) => {
    try {
      const localNumber = await this.twilio
        .availablePhoneNumbers("US")
        .local.list({ areaCode: areaCode, limit: 1 });
      if (!localNumber || localNumber[0] == null)
        throw "No phone numbers of this area code.";

      const phoneNumberObject = await this.twilio.incomingPhoneNumbers.create({
        phoneNumber: localNumber[0].phoneNumber,
        voiceUrl: `${process.env.NGROK_IP_ADDRESS}/twilio-voice-webhook/${agentId}`,
      });
      console.log("Getting phone number:", phoneNumberObject);
      return phoneNumberObject;
    } catch (err) {
      console.error("Create phone number API: ", err);
    }
  };

  // Update this phone number to use provided agent id. Also updates voice URL address.
  RegisterPhoneAgent = async (number: string, agentId: string) => {
    try {
      const phoneNumberObjects = await this.twilio.incomingPhoneNumbers.list();
      let numberSid;
      for (const phoneNumberObject of phoneNumberObjects) {
        if (phoneNumberObject.phoneNumber === number) {
          numberSid = phoneNumberObject.sid;
        }
      }
      if (numberSid == null) {
        return console.error(
          "Unable to locate this number in your Twilio account, is the number you used in BCP 47 format?",
        );
      }

      await this.twilio.incomingPhoneNumbers(numberSid).update({
        voiceUrl: `${process.env.NGROK_IP_ADDRESS}/twilio-voice-webhook/${agentId}`,
      });
    } catch (error: any) {
      console.error("failer to retrieve caller information: ", error);
    }
  };

  // Release a phone number
  DeletePhoneNumber = async (phoneNumberKey: string) => {
    await this.twilio.incomingPhoneNumbers(phoneNumberKey).remove();
  };

  // Create an outbound call
  CreatePhoneCall = async (
    fromNumber: string,
    toNumber: string,
    agentId: string,
  ) => {
    try {
      await this.twilio.calls.create({
        machineDetection: "Enable", // detects if the other party is IVR
        machineDetectionTimeout: 8,
        asyncAmd: "true", // call webhook when determined whether it is machine
        asyncAmdStatusCallback: `${process.env.NGROK_IP_ADDRESS}/twilio-voice-webhook/${agentId}`, // Webhook url for machine detection
        url: `${process.env.NGROK_IP_ADDRESS}/twilio-voice-webhook/${agentId}`, // Webhook url for registering call
        to: toNumber,
        from: fromNumber,
      });
      console.log(`Call from: ${fromNumber} to: ${toNumber}`);
    } catch (error: any) {
      console.error("failer to retrieve caller information: ", error);
    }
  };

  // Use LLM function calling or some kind of parsing to determine when to let AI end the call
  EndCall = async (sid: string) => {
    try {
      const call = await this.twilio.calls(sid).update({
        twiml: "<Response><Hangup></Hangup></Response>",
      });
      console.log("End phone call: ", call);
    } catch (error) {
      console.error("Twilio end error: ", error);
    }
  };

  // Use LLM function calling or some kind of parsing to determine when to transfer away this call
  TransferCall = async (sid: string, transferTo: string) => {
    try {
      const call = await this.twilio.calls(sid).update({
        twiml: `<Response><Dial>${transferTo}</Dial></Response>`,
      });
      console.log("Transfer phone call: ", call);
    } catch (error) {
      console.error("Twilio transfer error: ", error);
    }
  };

  // Twilio voice webhook
  ListenTwilioVoiceWebhook = (app: expressWs.Application) => {
    app.post(
      "/twilio-voice-webhook/:agent_id",
      async (req: Request, res: Response) => {
        const agentId = req.params.agent_id;
        const answeredBy = req.body.AnsweredBy;
        try {
          // Respond with TwiML to hang up the call if its machine
          if (answeredBy && answeredBy === "machine_start") {
            this.EndCall(req.body.CallSid);
            return;
          } else if (answeredBy) {
            return;
          }

          const callResponse = await this.retellClient.registerCall({
            agentId: agentId,
            audioWebsocketProtocol: AudioWebsocketProtocol.Twilio,
            audioEncoding: AudioEncoding.Mulaw,
            sampleRate: 8000,
          });
          if (callResponse.callDetail) {
            // Start phone call websocket
            const response = new VoiceResponse();
            const start = response.connect();
            const stream = start.stream({
              url: `wss://api.retellai.com/audio-websocket/${callResponse.callDetail.callId}`,
            });
            res.set("Content-Type", "text/xml");
            res.send(response.toString());
          }
        } catch (err) {
          console.error("Error in twilio voice webhook:", err);
          res.status(500).send();
        }
      },
    );
  };
}
