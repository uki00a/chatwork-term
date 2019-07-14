import { useState, useCallback } from 'rax';
import { createContainer } from '../hooks/container';

function useShortcuts() {
  const [shortcuts, activateShortcuts] = useState([]);
  const keypressHandler = useCallback((ch, key) => {
    const shortcut = shortcuts.find(x => x.key === key.full);
    if (shortcut) {
      return shortcut.handler();
    }
  }, [shortcuts]);
  return { shortcuts, activateShortcuts, keypressHandler };
}

export const ShortcutsContainer = createContainer(useShortcuts);