'use client';

import { useState } from 'react';
import { IconArrowRight } from '@tabler/icons-react';
import { ActionIcon, Box, ScrollArea, TextInput } from '@mantine/core';
import { ChatMessage, Message } from './ChatMessage';
import classes from './ChatBox.module.css';

// Placeholder for the backend API call
async function getBotResponse(message: string): Promise<string> {
  console.log('Sending to backend:', message);
  // Simulate network delay
  const response = await fetch('http://localhost:8000/api/ask', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ question: message }),
  });

  const data = await response.json();
  console.log('Received from backend:', data.answer.content[0].text);
  return data.answer.content[0].text;
}

export function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'bot',
      text: 'Hello! I am a friendly bot. Ask me a question about your data.',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isSending) {
      return;
    }

    const userMessage: Message = { sender: 'user', text: inputValue };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsSending(true);

    try {
      const botResponseText = await getBotResponse(inputValue);
      const botMessage: Message = { sender: 'bot', text: botResponseText };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error fetching bot response:', error);
      const errorMessage: Message = {
        sender: 'bot',
        text: 'Sorry, something went wrong. Please try again.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Box className={classes.chatBox}>
      <ScrollArea className={classes.messageContainer}>
        {messages.map((msg, index) => (
          <ChatMessage key={index} message={msg} />
        ))}
      </ScrollArea>
      <div className={classes.inputArea}>
        <TextInput
          className={classes.textInput}
          placeholder="Type your message..."
          value={inputValue}
          onChange={(event) => setInputValue(event.currentTarget.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              handleSendMessage();
            }
          }}
          rightSection={
            <ActionIcon onClick={handleSendMessage} loading={isSending}>
              <IconArrowRight size={18} />
            </ActionIcon>
          }
        />
      </div>
    </Box>
  );
}
