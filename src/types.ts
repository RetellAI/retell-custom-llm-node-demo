export interface Utterance {
  role: "agent" | "user" | "system";
  content: string;
}

// Retell -> Your Server Events
interface PingPongRequest {
  interaction_type: "ping_pong";
  timestamp: number;
}

interface CallDetailsRequest {
  interaction_type: "call_details";
  call: any;
}

interface UpdateOnlyRequest {
  interaction_type: "update_only";
  transcript: Utterance[];
  turntaking?: "agent_turn" | "user_turn";
}

export interface ResponseRequiredRequest {
  interaction_type: "response_required";
  transcript: Utterance[];
  response_id: number;
}

export interface ReminderRequiredRequest {
  interaction_type: "reminder_required";
  transcript: Utterance[];
  response_id: number;
}

export type CustomLlmRequest =
  | PingPongRequest
  | CallDetailsRequest
  | UpdateOnlyRequest
  | ResponseRequiredRequest
  | ReminderRequiredRequest;

// Your Server -> Retell Events

interface ConfigResponse {
  response_type: "config";
  config: {
    auto_reconnect: boolean;
    call_details: boolean;
  };
}

interface PingPongResponse {
  response_type: "ping_pong";
  timestamp: number;
}

interface ToolCallInvocationResponse {
  response_type: "tool_call_invocation";
  tool_call_id: string;
  name: string;
  arguments: string;
}

interface ToolCallResultResponse {
  response_type: "tool_call_result";
  tool_call_id: string;
  content: string;
}

interface ResponseResponse {
  response_type: "response";
  response_id: number;
  content: string;
  content_complete: boolean;
  no_interruption_allowed?: boolean;
  end_call?: boolean;
  transfer_number?: string;
}

interface AgentInterruptResponse {
  response_type: "agent_interrupt";
  interrupt_id: number;
  content: string;
  content_complete: boolean;
  no_interruption_allowed?: boolean;
  end_call?: boolean;
  transfer_number?: string;
}

export type CustomLlmResponse =
  | ConfigResponse
  | PingPongResponse
  | ToolCallInvocationResponse
  | ToolCallResultResponse
  | ResponseResponse
  | AgentInterruptResponse;

export interface FunctionCall {
  id: string;
  funcName: string;
  arguments: Record<string, any>;
  result?: string;
}
