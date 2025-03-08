export interface UserMessage {
    id: string;
    content: string;
    timestamp: Date;
}

export interface BotResponse {
    id: string;
    content: string;
    timestamp: Date;
}

export interface Emotion {
    type: string;
    intensity: number;
}

export interface ChatState {
    messages: (UserMessage | BotResponse)[];
    currentEmotion: Emotion | null;
}

export interface SentimentAnalysisResult {
    sentiment: string;
    score: number;
}

export interface VoiceInputResult {
    transcript: string;
    confidence: number;
}