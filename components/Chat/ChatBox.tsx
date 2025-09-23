'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { IconArrowRight } from '@tabler/icons-react';
import { ActionIcon, Box, ScrollArea, Textarea } from '@mantine/core';
import { ChatMessage, Message } from './ChatMessage';
import classes from './ChatBox.module.css';


// Placeholder for the backend API call
// async function getBotResponse(message: string): Promise<string> {
//   console.log('Sending to backend:', message);
//   // Simulate network delay
//   const response = await fetch('http://localhost:8000/api/ask', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({ question: message }),
//   });

//   const data = await response.json();
//   console.log('Received from backend:', data.answer.content[0].text);
//   return data.answer.content[0].text;
// }

// 1. Create a variable outside your function to store the session ID.
//    In a real app (React, Vue, etc.), this would be part of your component's state.
let currentSessionId: string | null = null;

async function getBotResponse(message: string): Promise<string> {
  console.log('Sending to backend:', message);
  
  // 2. Include the currentSessionId in the request body.
  //    On the very first request, this will be null, which is what the backend expects.
  const response = await fetch('http://localhost:8000/api/ask', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      question: message,
      session_id: currentSessionId 
    }),
  });

  if (!response.ok) {
    // Handle potential errors from the backend
    const errorData = await response.json();
    console.error("Error from backend:", errorData.detail);
    throw new Error(errorData.detail || "An unknown error occurred");
  }

  const data = await response.json();

  // 3. IMPORTANT: After getting a successful response, update the session ID
  //    with the one the server sent back.
  currentSessionId = data.session_id;

  console.log('Received from backend:', data.answer.content[0].text);
  console.log('Session ID is now:', currentSessionId); // For debugging

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
  const viewport = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (viewport.current) {
      viewport.current.scrollTo({ top: viewport.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isSending) {
      return;
    }

    const userMessage: Message = { sender: 'user', text: inputValue };
    const thinkingMessage: Message = { sender: 'bot', text: '...', isTyping: true };
    setMessages((prev) => [...prev, userMessage, thinkingMessage]);
    setInputValue('');
    setIsSending(true);

    try {
      const botResponseText = await getBotResponse(inputValue);
      const botMessage: Message = { sender: 'bot', text: botResponseText };
      setMessages((prev) => [...prev.slice(0, -1), botMessage]);
    } catch (error) {
      console.error('Error fetching bot response:', error);
      const errorMessage: Message = {
        sender: 'bot',
        text: 'Sorry, something went wrong. Please try again.',
      };
      setMessages((prev) => [...prev.slice(0, -1), errorMessage]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Box className={classes.chatBox}>
      <ScrollArea className={classes.messageContainer} viewportRef={viewport} type='hover'>
        {messages.map((msg, index) => (
          <ChatMessage key={index} message={msg} />
        ))}
      </ScrollArea>
      <div className={classes.inputArea}>
        <Textarea
          className={classes.textInput}
          placeholder="Type your message..."
          value={inputValue}
          onChange={(event) => setInputValue(event.currentTarget.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
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