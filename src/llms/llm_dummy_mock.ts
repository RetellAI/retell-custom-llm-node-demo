import { WebSocket } from "ws";
import { CustomLlmRequest, CustomLlmResponse } from "../types";

export class LLMDummyMock {
  constructor() {}

  // First sentence requested
  BeginMessage(ws: WebSocket) {
    const res: CustomLlmResponse = {
      response_id: 0,
      content: "How may I help you?",
      content_complete: true,
      end_call: false,
    };
    ws.send(JSON.stringify(res));
  }

  async DraftResponse(request: CustomLlmRequest, ws: WebSocket) {
    try {
      const res: CustomLlmResponse = {
        response_id: request.response_id,
        content: "I am sorry, can you say that again?",
        content_complete: true,
        end_call: false,
      };
      ws.send(JSON.stringify(res));
    } catch (err) {
      console.error("Error in gpt stream: ", err);
    }
  }
}
