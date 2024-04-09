export interface Utterance {
  role: "agent" | "user" | "system";
  content: string;
}

export interface CustomLlmRequest {
  interaction_type:
    | "update_only"
    | "response_required"
    | "reminder_required"
    | "pingpong"
    | "call_details";
  response_id?: number;
  transcript?: Utterance[];
  content?: any;
}

export interface CustomLlmResponse {
  response_type: "response" | "config" | "pingpong";
  response_id: number;
  content?: any;
  content_complete?: boolean;
  end_call?: boolean;
}

export interface FunctionCall {
  id: string;
  funcName: string;
  arguments: Record<string, any>;
  result?: string;
}
