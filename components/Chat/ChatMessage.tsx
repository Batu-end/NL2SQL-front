
import { Avatar, Group, Paper, Text } from '@mantine/core';
import { IconUser, IconRobot } from '@tabler/icons-react';
import classes from './ChatMessage.module.css';

export type Message = {
  sender: 'user' | 'bot';
  text: string;
};

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isBot = message.sender === 'bot';
  const avatar = isBot ? <IconRobot size={30} /> : <IconUser size={30} />;

  return (
    <div className={`${classes.messageRow} ${isBot ? classes.botRow : classes.userRow}`}>
      <Group gap="sm">
        {isBot && <Avatar size="lg">{avatar}</Avatar>}
        <Paper
          withBorder
          radius="lg"
          p="md"
          className={`${classes.messageBubble} ${
            isBot ? classes.botBubble : classes.userBubble
          }`}
        >
          <Text>{message.text}</Text>
        </Paper>
        {!isBot && <Avatar size="lg">{avatar}</Avatar>}
      </Group>
    </div>
  );
}
