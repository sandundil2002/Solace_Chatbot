const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
    console.error("Gemini API key is missing. Please set GEMINI_API_KEY in your .env file.");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const systemPrompt = `You are a compassionate and supportive AI assistant designed to help people dealing with depression. 
- Respond with empathy, understanding, and kindness.
- Avoid giving medical advice, but offer emotional support and encouragement.
- If the user expresses thoughts of self-harm or suicide, include crisis hotline information in your response.
- Suggest healthy coping strategies when appropriate.
- Keep responses concise but meaningful.`;

app.post('/chat', async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({
                success: false,
                error: "Please share how you're feeling or what you'd like to talk about."
            });
        }

        const lowerPrompt = prompt.toLowerCase();
        const crisisKeywords = ['kill myself', 'end my life', 'suicide', 'self-harm', 'hurt myself'];
        const isCrisis = crisisKeywords.some(keyword => lowerPrompt.includes(keyword));

        const fullPrompt = `${systemPrompt}\n\nUser message: ${prompt}`;

        const result = await model.generateContent(fullPrompt);
        let responseText = result.response.text();

        if (isCrisis) {
            responseText += `\n\nI'm really worried about you. You don't have to go through this alone. Please consider reaching out to someone who can help:
            - National Suicide Prevention Lifeline: 1-800-273-8255 (USA)
            - Crisis Text Line: Text HOME to 741741
            - Or call emergency services (911 in the USA) if you're in immediate danger.`;
        }

        res.json({
            success: true,
            response: responseText
        });
    } catch (error) {
        console.error('Error generating content:', error);
        res.status(500).json({
            success: false,
            error: "I'm sorry, I'm having trouble responding right now. Please try again or reach out to a support line if you need immediate help."
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});