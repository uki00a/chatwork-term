import blessed from 'neo-blessed';
import { render, createElement } from 'rax';
import createDriver from 'rax-blessed-driver';
import App from './components/app';
import createChatworkClient from './modules/chatwork/client';
import { readOrCreateSettings } from './modules/config';
import { initializeTheme } from './modules/theme';
import createScreen from './screen';
import reducer from './components/app/reducer';

const driver = createDriver(blessed);

async function main() {
  const settings = await readOrCreateSettings();
  const client = createChatworkClient({
    accessToken: settings.accessToken
  });
  // FIXME
  const state = {
    ...reducer(),
    theme: initializeTheme(settings.theme)
  };
  const screen = createScreen();
  render(
    <App
      client={client}
      settings={settings}
      initialState={state}
    />,
    screen,
    { driver }
  );
}

main();
