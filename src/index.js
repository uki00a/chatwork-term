import blessed from 'neo-blessed';
import { render, createElement } from 'rax';
import createDriver from 'rax-blessed-driver';
import App from './components/app';
import createChatworkClient from './modules/chatwork/client';
import { readOrCreateSettings } from './modules/config';
import { initializeTheme } from './modules/theme';
import createScreen from './screen';
import { MessagesContainer } from './containers/messages';
import { ShortcutsContainer } from './containers/shortcuts';
import { MessagePreviewerContainer } from './containers/message-previewer';
import { StatusContainer } from './containers/status';

const driver = createDriver(blessed);

async function main() {
  const settings = await readOrCreateSettings();
  const client = createChatworkClient({
    accessToken: settings.accessToken
  });
  const screen = createScreen();
  render(
    <StatusContainer.Provider>
      <ShortcutsContainer.Provider>
        <MessagesContainer.Provider>
          <MessagePreviewerContainer.Provider>
            <App
              client={client}
              settings={settings}
              theme={initializeTheme(settings.theme)}
            />
          </MessagePreviewerContainer.Provider>
        </MessagesContainer.Provider>
      </ShortcutsContainer.Provider>
    </StatusContainer.Provider>,
    screen,
    { driver }
  );
}

main();
