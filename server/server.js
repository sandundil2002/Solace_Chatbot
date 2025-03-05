import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const HF_API_KEY = process.env.HF_API_KEY;
const HF_MODEL = "mistralai/Mixtral-8x7B-Instruct-v0.1";
const HF_API_URL = `https://api-inference.huggingface.co/models/${HF_MODEL}`;

if (!HF_API_KEY) {
    console.error("Hugging Face API key is missing. Please set HF_API_KEY in your .env file.");
    process.exit(1);
}

let chatHistory = "";

app.post('/chat', async (req, res) => {
    const { message } = req.body;
    if (!message) {
        return res.status(400).json({ error: "Message is required" });
    }

    try {
        chatHistory += `User: ${message}\nBot: `;

        const systemPrompt = "You are a supportive mental health assistant. Respond with empathy, validate feelings, and avoid medical advice. Encourage professional help and maintain a compassionate tone.";

        const prompt = `${systemPrompt}\n\n${chatHistory}`;
        const response = await fetch(HF_API_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${HF_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                inputs: prompt,
                parameters: {
                    max_new_tokens: 50,
                    temperature: 0.7,
                    top_p: 0.95,
                    return_full_text: false,
                },
            }),
        });

        if (!response.ok) {
            throw new Error(`Hugging Face API error: ${response.statusText}`);
        }

        const data = await response.json();
        const botResponse = data[0]?.generated_text?.trim() || "I'm here to listen. Could you share more?";

        chatHistory += `${botResponse}\n`;

        const historyLines = chatHistory.split('\n');
        if (historyLines.length > 16) { // 8 messages (user+bot pairs)
            chatHistory = historyLines.slice(-16).join('\n');
        }

        res.json({ response: botResponse });

    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({
            response: "I'm here for you. Could you tell me more about what you're feeling?",
            error: "Response generation failed"
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});