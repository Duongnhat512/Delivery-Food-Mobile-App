import React, { useState, useCallback, useEffect } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import OpenAI from 'openai';

const ChatBot = () => {
    const [messages, setMessages] = useState([]);
    const apiKey = process.env.CHATGPT_APIKEY;

    useEffect(() => {
        setMessages([
            {
                _id: 1,
                text: 'Xin chào! Tôi có thể giúp gì cho bạn?',
                createdAt: new Date(),
                user: {
                    _id: 2,
                    name: 'ChatBot',
                },
            },
        ]);
    }, []);

    const onSend = useCallback((messages = []) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages));
        const message = messages[0].text;

        const sendMessageToOpenAI = async () => {
            try {
                const openai = new OpenAI({ apiKey });
                const completion = await openai.chat.completions.create({
                    model: 'gpt-3.5-turbo',
                    messages: [
                        { role: 'system', content: 'You are a helpful assistant.' },
                        { role: 'user', content: message }
                    ],
                });

                const botMessage = {
                    _id: Math.random().toString(36).substring(7),
                    text: completion.choices[0].message.content.trim(),
                    createdAt: new Date(),
                    user: {
                        _id: 2,
                        name: 'ChatBot',
                    },
                };
                setMessages(previousMessages => GiftedChat.append(previousMessages, botMessage));
            } catch (error) {
                if (error.response && error.response.status === 429) {
                    console.error('Rate limit exceeded. Retrying in 1 minute...');
                    setTimeout(sendMessageToOpenAI, 60000); // Retry after 1 minute
                } else if (error.response && error.response.status === 401) {
                    console.error('Unauthorized: Check your API key.');
                } else {
                    console.error(error);
                }
            }
        };

        sendMessageToOpenAI();
    }, []);

    return (
        <GiftedChat
            messages={messages}
            onSend={messages => onSend(messages)}
            user={{
                _id: 1,
            }}
        />
    );
};

export default ChatBot;