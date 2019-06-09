import blessed from 'neo-blessed';
import { render, createElement } from 'rax';
import createDriver from 'rax-blessed-driver';
import App from './components/app';
import createChatworkClient from './modules/chatwork/client';
import { readSettings } from './modules/config';
import { initializeTheme } from './modules/theme';
import screen from './screen';

const driver = createDriver(blessed);

async function main() {
  const settings = await readSettings();
  const client = createChatworkClient({
    accessToken: settings.accessToken
  });
  const initialState = Object.freeze({
    rooms: [],
    messages: [],
    activeRoomId: null,
    activeShortcuts: [],
    theme: initializeTheme()
  });
  render(
    <App
      client={client}
      settings={settings}
      initialState={initialState}
    />,
    screen,
    { driver }
  );
}

main();
