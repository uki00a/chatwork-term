import assert from 'assert';
import { useState, useCallback } from 'rax';
import { createContainer } from '../hooks/container';

function useMessagePreviewer() {
  const [message, setMessage] = useState(null);
  const unpreviewMessage = useCallback(() => setMessage(null), []);
  const previewMessage = useCallback(message => {
    assert(message);
    setMessage(message);
  }, []);
  return {
    message,
    previewMessage,
    unpreviewMessage
  };
}

export const MessagePreviewerContainer = createContainer(useMessagePreviewer);