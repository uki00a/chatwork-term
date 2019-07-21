import { createElement, useCallback } from 'rax';
import MessagePreviewer from './message-previewer';
import { useContainer } from '../../hooks/container';
import { MessagePreviewerContainer } from '../../containers/message-previewer';
import { ShortcutsContainer } from '../../containers/shortcuts';

export default function(props) {
  const { message, unpreviewMessage } = useContainer(MessagePreviewerContainer);
  const { activateShortcuts, keypressHandler } = useContainer(ShortcutsContainer);
  const handleFocus = useCallback(() => {
    activateShortcuts([
      {
        key: 'escape',
        description: 'Close',
        handler: unpreviewMessage
      },
      {
        key: 'backspace',
        description: 'Close',
        handler: unpreviewMessage
      },
      {
        key: 'tab',
        description: 'Close',
        handler: unpreviewMessage
      }
    ]);
  }, [activateShortcuts, unpreviewMessage]);

  return (
    <MessagePreviewer
      message={message}
      open={message != null}
      onFocus={handleFocus}
      onKeypress={keypressHandler}
      {...props}
    />
  );
}

