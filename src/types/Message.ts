export type MessageRole = "user" | "bot";

export interface Message {
    id: string;
    text: string;
    role: MessageRole;
    timestamp: Date;
}
