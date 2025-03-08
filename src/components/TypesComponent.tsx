export interface Message {
    text: string;
    isUser: boolean;
    timestamp: string;
}

export interface ApiResponse {
    success: boolean;
    response?: string;
    error?: string;
}