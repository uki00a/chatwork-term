import { createElement, useRef, useEffect } from 'rax';
import parseMarkdown from '../../modules/markdown';

export default function MessagePreviewer({ message, open = false, ...restProps }) {
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