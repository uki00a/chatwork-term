import { createElement, useRef, useEffect, useCallback } from 'rax';
import parseMarkdown from '../../modules/markdown';
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

function MessagePreviewer({ message, open = false, ...restProps }) {
  const messagePreviewer = useRef(null);

  useEffect(() => {
    if (messagePreviewer.current == null) {
      return;
    }

    if (open) {
      messagePreviewer.current.setIndex(1000);
      messagePreviewer.current.focus();
      messagePreviewer.current.setFront();
      messagePreviewer.current.setContent(parseMarkdown(message.body));

      messagePreviewer.current.setLabel(`{bold}{gray-fg}[${message.account.name}] ${message.sendTime}{/}`);
      messagePreviewer.current.setScrollPerc(0);
      messagePreviewer.current.show();
    } else {
      messagePreviewer.current.screen.rewindFocus();
      messagePreviewer.current.hide();
      messagePreviewer.current.setBack();
    }
  }, [messagePreviewer, message, open]);

  return (
    <box
      scrollable
      scrollbar
      alwaysScroll
      vi
      keys
      border='line'
      tags
      ref={messagePreviewer}
      { ...restProps }
    />
  );
}


