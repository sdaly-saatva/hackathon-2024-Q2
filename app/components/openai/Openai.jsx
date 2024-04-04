'use client'
import { useState, useRef, useEffect } from 'react';
import { OpenAI } from 'openai';
import styles from '../../page.module.css'

import { newChat } from './openaiUtils'

export default function Chat({className}) {
    const responseRef = useRef(null)
    const [inputText, setInputText] = useState('');
    const [responses, setResponses] = useState([{ text: 'Hello! How can I assist you today?', isUser: false }]);
    const [isLoading, setLoading] = useState(false)

    useEffect(() => {
        responseRef.current.scrollTop = responseRef.current.scrollHeight;
    }, [responses])

    const openai = new OpenAI({
        apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
        // dangerouslyAllowBrowser: true, // uncomment to work client side
    });

    const handleSendMessage = async () => {
        if (!inputText) return

        const newResponses = [...responses, { text: inputText, isUser: true }];
        setResponses(newResponses);
        const question = inputText
        setInputText('...one sec');

        try {
            setLoading(true)
            const response = await newChat(inputText, openai)
            
            setResponses([...newResponses, { text: response, isUser: false }]);
            setInputText('');
            setLoading(false)
        } catch (error) {
            console.error('Failed to generate response:', error);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
          e.preventDefault(); // Prevent default behavior (e.g., form submission)
            handleSendMessage();
        }
    };

    const chatClasses = `${className} ${styles.chat}`

    return (
        <div className={chatClasses}>
            <div className={styles.response} ref={responseRef}>
            {responses.map((response, index) => (
            <div
                key={index}
                className={`${response.isUser ? styles.messageUser : styles.messageBot}`}
            >
                {response.text}
            </div>
            ))}
            </div>
            <div className={styles.text}>
                <input
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className={styles.text_box}
                    disabled={isLoading}
                />
                <button className={styles.button} onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
}