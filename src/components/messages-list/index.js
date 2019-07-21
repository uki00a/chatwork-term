import { createElement, useRef, useEffect, useCallback } from 'rax';
import assert from 'assert';
import * as Account from '../../core/account';
import MessagesList from './messages-list';
import { useContainer } from '../../hooks/container';
import { usePolling } from '../../hooks/polling';
import { MessagesContainer } from '../../containers/messages';
import { ShortcutsContainer } from '../../containers/shortcuts';
import { StatusContainer } from '../../containers/status';
import { MessagePreviewerContainer } from '../../containers/message-previewer';

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



