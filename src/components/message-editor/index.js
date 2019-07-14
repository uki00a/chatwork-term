import { forwardRef, createElement, useCallback, useRef } from 'rax';
import { useContainer } from '../../hooks/container';
import { ShortcutsContainer } from '../../containers/shortcuts';
import { StatusContainer } from '../../containers/status';
import { MessagesContainer } from '../../containers/messages';

export default function({ client, roomId, ...restProps }) {
  const { keypressHandler, activateShortcuts } = useContainer(ShortcutsContainer);
  const { setStatus, clearStatus } = useContainer(StatusContainer);
  const { appendMessage, messages } = useContainer(MessagesContainer);
  const messageEditor = useRef(null);

  const addMessageToRoom = useCallback(async body => {
    setStatus('Now adding message to room...');
    const id = await client.addMessageToRoom(body, roomId);
    const newMessage = await client.getMessageById(id, roomId);
    if (newMessage) {
      appendMessage(newMessage);
    }
    clearStatus();
  }, [roomId, client, setStatus, clearStatus, appendMessage]);

  const handleFocus = useCallback(() => {
    activateShortcuts([
      {
        key: 'C-s',
        description: 'Submit',
        handler: async () => {
          const body = messageEditor.current.getValue();
          await addMessageToRoom(body);
          messageEditor.current.clearValue();
        }
      },
      {
        key: 'C-e',
        description: 'Open editor',
        handler: () => messageEditor.current.readEditor(value => {
          messageEditor.current.setValue(value);
        })
      }
    ]);
  }, [activateShortcuts, addMessageToRoom]);

  return (
    <MessageEditor
      ref={messageEditor}
      hidden={messages.length === 0}
      onFocus={handleFocus}
      onKeypress={keypressHandler}
      {...restProps}
    />
  );
}

const MessageEditor = forwardRef((props, ref) => {
  return (
    <textarea
      ref={ref}
      keyable
      vi
      inputOnFocus
      border='line'
      { ...props }
    />
  );
});