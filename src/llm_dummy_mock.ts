import { WebSocket } from "ws";
import { RetellRequest, RetellResponse } from "./types";

export class LLMDummyMock {
  constructor() {}

  // First sentence requested
  BeginMessage(ws: WebSocket) {
    const res: RetellResponse = {
      response_id: 0,
      content: "How may I help you?",
      content_complete: true,
      end_call: false,
    };
    ws.send(JSON.stringify(res));
  }

  async DraftResponse(request: RetellRequest, ws: WebSocket) {
    console.clear();
    console.log("req", request);
    if (request.interaction_type === "update_only") {
      // process live transcript update if needed
      return;
    }

    try {
      const res: RetellResponse = {
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
