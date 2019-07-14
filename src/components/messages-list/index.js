import { createElement, forwardRef, useRef, useEffect, useCallback } from 'rax';
import blessed from 'neo-blessed';
import assert from 'assert';
import { numberOfLines, butLast } from '../../modules/utils';
import {
  selectFirstChild,
  selectFirstOrPreviousChild,
  selectLastChild,
  selectLastOrNextChild,
} from './helpers';
import * as Account from '../../core/account';
import { useContainer } from '../../hooks/container';
import { usePolling } from '../../hooks/polling';
import { MessagesContainer } from '../../containers/messages';
import { ShortcutsContainer } from '../../containers/shortcuts';
import { StatusContainer } from '../../containers/status';
import { MessagePreviewerContainer } from '../../containers/message-previewer';
import parseMarkdown from '../../modules/markdown';

export default function({
  client,
  roomId,
  me,
  settings,
  ...restProps
}) {
  const messagesList = useRef(null);
  const { messages, setMessages, updateMessage } = useContainer(MessagesContainer);
  const { activateShortcuts, keypressHandler } = useContainer(ShortcutsContainer);
  const { setStatus, clearStatus } = useContainer(StatusContainer);
  const { previewMessage } = useContainer(MessagePreviewerContainer);

  const pollingHandler = useCallback(async () => {
    if (roomId == null) {
      return;
    }

    // FIXME
    const messages = await client.listMessagesInRoom(roomId);
    setMessages(messages);
  }, [client, roomId, setMessages]);

  usePolling(settings, pollingHandler);

  useEffect(() => {
    if (roomId == null) {
      return;
    }

    setStatus('Loading list of messages...');
    client.listMessagesInRoom(roomId).then(messages => {
      setMessages(messages);
      clearStatus();
    })
  }, [client, roomId, setStatus, clearStatus, setMessages]);

  useEffect(() => {
    if (messages.length > 0) {
      messagesList.current.focus();
    }
  }, [messages]);

  const saveMessage = useCallback(async ({ id, body }) => {
    setStatus('Now updating message...');
    await client.updateMessage({
      roomId,
      id,
      body
    });
    updateMessage({ id, body });
    clearStatus();
  }, [client, setStatus, clearStatus, roomId, updateMessage]);

  const previewSelectedMessage = useCallback(() => {
    const index = messagesList.current.selected; // FIXME selected
    const message = messages[index];
    assert(index >= 0 && index < messages.length);
    previewMessage(message);
  }, [messages, previewMessage]);

  const editAndSaveMessage = useCallback(() => {
    const index = messagesList.current.selected; // FIXME selected
    const message = messages[index];

    assert(message);
    if (!Account.canEditMessage(me, message)) {
      return false;
    }

    messagesList.current.screen.readEditor({ value: message.body }, async (error, body) => {
      if (error) {
        throw error; // TODO error handling
      }
      await saveMessage({
        id: message.id,
        body
      });
    });
  }, [messages, saveMessage, me]);

  const handleFocus = useCallback(() => {
    activateShortcuts([
      {
        key: 'return',
        description: 'Preview',
        handler: previewSelectedMessage
      },
      {
        key: 'C-e',
        description: 'Edit',
        handler: editAndSaveMessage
      }
    ]);
  }, [activateShortcuts, editAndSaveMessage, previewSelectedMessage]);

  return (
    <MessagesList
      ref={messagesList}
      hidden={messages.length === 0}
      messages={messages}
      onKeypress={keypressHandler}
      onFocus={handleFocus}
      {...restProps}
    />
  )
}

const MessagesList = forwardRef(({
  messages = [],
  style = {},
  onKeypress,
  ...restProps
}, ref) => {

  useEffect(() => {
    if (ref.current.children.length > 0) {
      selectLastChild(ref.current);
    }
  }, [ref, messages]);

  const handleKeypress = useCallback(function handleKeypress(ch, key) {
    const element = ref.current;
    switch (key.full) {
    case 'g':
      if (element.children.length > 0) {
        selectFirstChild(element);
      }
      break;
    case 'S-g':
      if (element.children.length > 0) {
        selectLastChild(element);
      }
      break;
    case 'down':
    case 'j':
      if (element.children.length > 0) {
        selectLastOrNextChild(element);
      }
      break;
    case 'up':
    case 'k':
      if (element.children.length > 0) {
        selectFirstOrPreviousChild(element);
      }
      break;
    default:
      if (onKeypress) {
        onKeypress(ch, key);
      }
    }
  }, [ref, onKeypress]);

  const formattedMessages = messages.map(formatMessage);
  const offsets = computeOffsets(formattedMessages);

  assert(messages.length === formattedMessages.length);

  return (
    <box
      ref={ref}
      keyable
      scrollable
      scrollbar
      border='line'
      tags
      keys
      style={style}
      shrink
      onKeypress={handleKeypress}
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

