import React, { useState, useEffect, useRef } from 'react';
import axios, { AxiosResponse } from 'axios';
import {MoonIcon, SendIcon, SunIcon} from "./components/IconComponents.tsx";
import {ApiResponse, Message} from "./components/TypesComponent.tsx";

const App: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setDarkMode(true);
        }
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage: Message = {
            text: input,
            isUser: true,
            timestamp: new Date().toLocaleTimeString(),
        };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response: AxiosResponse<ApiResponse> = await axios.post(
                'http://localhost:5000/chat',
                { prompt: userMessage.text },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            const data = response.data;

            if (data.success && data.response) {
                const botMessage: Message = {
                    text: data.response,
                    isUser: false,
                    timestamp: new Date().toLocaleTimeString(),
                };
                setMessages(prev => [...prev, botMessage]);
            } else {
                throw new Error(data.error || 'Something went wrong');
            }
        } catch (error) {
            const errorMessage: Message = {
                text: 'Sorry, I could not process that. Please try again.',
                isUser: false,
                timestamp: new Date().toLocaleTimeString(),
            };
            setMessages(prev => [...prev, errorMessage]);
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleTheme = () => {
        setDarkMode(!darkMode);
    };

    return (
        <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} transition-colors duration-200 flex items-center justify-center p-4`}>
            <div className={`w-full max-w-4xl ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-xl flex flex-col h-[95vh] transition-colors duration-200`}>
                <div className={`${darkMode ? 'bg-indigo-700' : 'bg-indigo-600'} text-white p-4 rounded-t-xl flex justify-between items-center transition-colors duration-200`}>
                    <div>
                        <h1 className="text-2xl font-bold">Solace Chatbot</h1>
                        <p className="text-sm opacity-90">Professional assistance whenever you need it</p>
                    </div>
                    <button
                        onClick={toggleTheme}
                        className={`p-2 rounded-full ${darkMode ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-indigo-500 hover:bg-indigo-400'} transition-colors`}
                        aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                    >
                        {darkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
                    </button>
                </div>

                <div className={`flex-1 p-6 overflow-y-auto ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} transition-colors duration-200`}>
                    {messages.length === 0 ? (
                        <div className={`text-center my-20 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            <div className="text-4xl mb-3">👋</div>
                            <h3 className="text-xl font-medium mb-2">Welcome to Solace Support</h3>
                            <p>How can we assist you today?</p>
                        </div>
                    ) : (
                        messages.map((message, index) => (
                            <div
                                key={index}
                                className={`mb-6 flex capitalize ${
                                    message.isUser ? 'justify-end' : 'justify-start'
                                }`}
                            >
                                {!message.isUser && (
                                    <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold mr-2">
                                        S
                                    </div>
                                )}
                                <div
                                    className={`max-w-[75%] p-4 rounded-2xl ${
                                        message.isUser
                                            ? darkMode
                                                ? 'bg-indigo-600 text-white'
                                                : 'bg-indigo-500 text-white'
                                            : darkMode
                                                ? 'bg-gray-700 text-gray-100'
                                                : 'bg-white text-gray-800 shadow-sm'
                                    } transition-colors duration-200`}
                                >
                                    <p className="leading-relaxed">{message.text}</p>
                                    <span className="text-xs opacity-75 block mt-2">
                                        {message.timestamp}
                                    </span>
                                </div>
                                {message.isUser && (
                                    <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center text-white font-bold ml-2">
                                        U
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSendMessage} className={`p-4 border-t ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200'} transition-colors duration-200`}>
                    <div className="flex gap-2 items-center">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your message..."
                            className={`flex-1 p-4 rounded-full focus:outline-none focus:ring-2 capitalize ${
                                darkMode
                                    ? 'bg-gray-700 text-white border-gray-600 focus:ring-indigo-500'
                                    : 'bg-gray-100 text-gray-900 focus:ring-indigo-400'
                            } transition-colors duration-200`}
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`p-4 rounded-full ${
                                darkMode
                                    ? 'bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-600'
                                    : 'bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-300'
                            } text-white disabled:opacity-50 transition-colors`}
                            aria-label="Send message"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <SendIcon className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                </form>

                <footer className={`p-2 text-center text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} transition-colors duration-200`}>
                    <p>Solace Chatbot - Developed By Sandun Dilshan @2025</p>
                </footer>
            </div>
        </div>
    );
};

export default App;