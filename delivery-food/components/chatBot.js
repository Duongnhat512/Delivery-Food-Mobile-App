import React, { useState, useCallback, useEffect } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import axios from 'axios';

const ChatBot = () => {
  const [messages, setMessages] = useState([]);

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

    // Gửi tin nhắn đến OpenAI API để xử lý
    axios.post('https://api.openai.com/v1/engines/davinci-codex/completions', {
      prompt: message,
      max_tokens: 150,
      n: 1,
      stop: null,
      temperature: 0.7,
    }, {
      headers: {
        'Authorization': `Bearer YOUR_OPENAI_API_KEY`,
        'Content-Type': 'application/json',
      }
    })
    .then(response => {
      const botMessage = {
        _id: Math.random().toString(36).substring(7),
        text: response.data.choices[0].text.trim(),
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'ChatBot',
        },
      };
      setMessages(previousMessages => GiftedChat.append(previousMessages, botMessage));
    })
    .catch(error => {
      console.error(error);
    });
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