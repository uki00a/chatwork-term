import { useState, useCallback } from 'rax';
import { createContainer } from '../hooks/container';

function useMessages() {
  const [messages, setMessages] = useState([]);

  const appendMessage = useCallback(message => {
    setMessages(messages.concat(message));
  }, [messages]);

  const updateMessage = useCallback(({ id, body }) => {
    setMessages(messages.map(x => x.id === id ? { ...x, body } : x));
  }, [messages]);

  return {
    messages,
    setMessages,
    appendMessage,
    updateMessage
  };
}

export const MessagesContainer = createContainer(useMessages);