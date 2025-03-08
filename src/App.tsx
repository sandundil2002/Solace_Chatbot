import React, { useState, useEffect, useRef } from 'react';
import axios, { AxiosResponse } from 'axios';
import {MoonIcon, SendIcon, SunIcon} from "./components/icons/IconComponents.tsx";

interface Message {
    text: string;
    isUser: boolean;
    timestamp: string;
}

const App: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    return (
        <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} transition-colors duration-200 flex items-center justify-center p-4`}>
            <div className={`w-full max-w-4xl ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-xl flex flex-col h-[90vh] transition-colors duration-200`}>
                <div className={`${darkMode ? 'bg-indigo-700' : 'bg-indigo-600'} text-white p-4 rounded-t-xl flex justify-between items-center transition-colors duration-200`}>
                    <div>
                        <h1 className="text-2xl font-bold">Solace Chatbot</h1>
                        <p className="text-sm opacity-90">Professional assistance whenever you need it</p>
                    </div>
                    <button
                        className={`p-2 rounded-full ${darkMode ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-indigo-500 hover:bg-indigo-400'} transition-colors`}
                        aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                    >
                        {darkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
                    </button>
                </div>


            </div>
        </div>
    );
};

export default App;