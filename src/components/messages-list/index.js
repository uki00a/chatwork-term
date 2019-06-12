import { createElement, forwardRef, useEffect } from 'rax';
import blessed from 'neo-blessed';
import assert from 'assert';
import { numberOfLines, butLast } from '../../modules/utils';
import { registerHandlers } from './handlers';
import parseMarkdown from '../../modules/markdown';

const MessagesList = forwardRef(({
  messages = [],
  style = {},
  ...restProps
}, ref) => {
  useEffect(() => {
    return registerHandlers(ref.current);
  }, []);

  const formattedMessages = messages.map(formatMessage);
  const offsets = computeOffsets(formattedMessages);

  assert(messages.length === formattedMessages.length);

  return (
    <box
      ref={ref}
      keys
      vi
      clickable
      keyable
      scrollable
      scrollbar
      mouse
      border='line'
      tags
      style={style}
      shrink
      {...restProps}>
      {
        messages.map((message, index) => (
          <box
            key={message.id}
            style={{...style}} // avoid a problem about object mutation by blessed.js
            position={{
              top: offsets[index],
              height: computeHeight(formattedMessages[index]),
              width: '98%'
            }}
            tags
            content={formattedMessages[index]}
          />
        ))
      }
    </box>
  );
});

function computeOffsets(messages) {
  if (messages.length === 0) {
    return [];
  }

  const offsets = butLast(messages).reduce((offsets, message, index) => {
    const previousOffset = offsets[index];
    const offset = previousOffset + computeHeight(message);
    offsets.push(offset);
    return offsets;
  }, [0]);
  assert(offsets.length === messages.length);
  return offsets;
}

function computeHeight(message) {
  return numberOfLines(message);
}

function formatMessage(message) {
  return (
    `{bold}{gray-fg}[${blessed.helpers.escape(message.account.name)}] ${message.sendTime}{/}\n` +
    parseMarkdown(blessed.helpers.escape(message.body.trim()))
  );
}

export default MessagesList;
