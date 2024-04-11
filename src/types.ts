export interface Utterance {
  role: "agent" | "user" | "system";
  content: string;
}

export interface CustomLlmRequest {
  interaction_type:
    | "update_only"
    | "response_required"
    | "reminder_required"
    | "ping_pong"
    | "call_details";
  response_id?: number; // Used by update_only and response_required
  transcript?: Utterance[]; // Used by update_only and response_required
  call?: any; // Used by call_details
  timestamp?: number; // Used by ping_pong
}

export interface CustomLlmResponse {
  response_type: "response" | "config" | "ping_pong";
  response_id?: number; // Used by response
  content?: any; // Used by response
  content_complete?: boolean; // Used by response
  end_call?: boolean; // Used by response
  config?: any; // Used by config
  timestamp?: number; // Used by ping_pong
}

export interface FunctionCall {
  id: string;
  funcName: string;
  arguments: Record<string, any>;
  result?: string;
}
