# retell-backend-node-demo

This backend repo demonstrates how to start a websocket server that Retell server will connect to. Retell will send
live transcripts and other updates to the server, and get responses from this server. see [API Docs](https://docs.re-tell.ai/guide/custom-llm-websocket) for walkthrough.

The protocol of messages we send and expect to receive are documented [here](https://docs.re-tell.ai/api-references/llm-websocket).

This repo also contains code to use Twilio to get number, make phone calls, see [API Docs](https://docs.re-tell.ai/guide/phone-setup) for walkthrough.

This repo contains azure OpenAI & OpenAI, modify the import inside `src/server.ts` to switch between two.

Check this [Youtube Toturial](https://youtu.be/Tz969io9cPc?feature=shared&t=344) containing a walkthrough using the [Frontend Demo](https://github.com/adam-team/retell-frontend-reactjs-demo/tree/client_sdk) and this repo.

## Steps to run locally to test

1. Add Retell and Azure OpenAI key to ".env.development". Optionally add your twilio credentials if you want to use phone call abilities here.

2. Install dependencies

```bash
npm install
```

3. Start the server

```bash
npm run dev
```

4. In another bash, use ngrok to expose this port to public network

```bash
ngrok http 8080
```

You should see a fowarding address like
`https://dc14-2601-645-c57f-8670-9986-5662-2c9a-adbd.ngrok-free.app`, and you
are going to take the IP address, prepend it with wss, postpend with
`llm-websocket` path and use that in the dashboard to create a new agent. Now
the agent you created should connect with your localhost.

The custom LLM URL would look like
`wss://dc14-2601-645-c57f-8670-9986-5662-2c9a-adbd.ngrok-free.app/llm-websocket`

### Optional: Phone Call Features via Twilio

The `src/twilio_api.ts` contains helper functions you could utilize to create phone numbers, tie agent to a number,
make a phone call with an agent, etc. Here we assume you already created agent from last step, and have agent id ready.

To ues these features, follow these steps:

1. Uncomment twilio client initialization and `ListenTwilioVoiceWebhook(this.app)` in `src/server.ts` file to set up Twilio voice webhook. What this does is that every time a number of yours in Twilio get called, it would call this webhook which internally calls the `register-call` API and sends the correct audio websocket address back to Twilio, so it can connects with Retell to start the call.

2. Put your ngrok ip address into `.env.development`, it would be something like `https://dc14-2601-645-c57f-8670-9986-5662-2c9a-adbd.ngrok-free.app`.

3. (optional) Call `CreatePhoneNumber` to get a new number and associate with an agent id. This phone number now can handle inbound calls as long as this server is running.

4. (optional) Call `RegisterPhoneAgent` to register your Twilio number and associate with an agent id. This phone number now can handle inbound calls as long as this server is running.

5. (optional) Call `DeletePhoneNumber` to release a number from your Twilio pool.

6. (optional) Call `TransferCall` to transfer this on-going call to a destination number.

7. (optional) Call `EndCall` to end this on-going call.

8. Call `CreatePhoneCall` to start a call with caller & callee number, and your agent Id. This call would use the agent id supplied, and ignore the agent id you set up in step 3 or 4. It automatically hang up if machine/voicemail/IVR is detected. To turn it off, remove "machineDetection, asyncAmd" params.

## Run in prod

To run in prod, you probably want to customize your LLM solution, host the code
in a cloud, and use that IP to create agent.
