import { useState, useCallback } from 'rax';
import { createContainer } from '../hooks/container';

function useStatus() {
  const [status, setStatus] = useState('');
  const clearStatus = useCallback(() => setStatus(''), [setStatus]);
  return { status, setStatus, clearStatus };
}

export const StatusContainer = createContainer(useStatus);