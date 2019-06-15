import blessed from 'neo-blessed';
import { removeLastChar } from './modules/utils';

const screen = blessed.screen({
  autopadding: true,
  smartCSR: true,
  title: 'chatwork-term',
  fullUnicode: true,
  debug: true
});

screen.key(['C-c'], () => process.exit(0));
screen.on('element keypress', (el, ch, key) => {
  if (key.full === 'tab') {
    focusNext(screen);
  }
});
screen.program.disableMouse();

function focusNext(screen) {
  const isInputElement = typeof screen.focused.cancel === 'function';
  if (isInputElement) {
    const nextIndex = screen.children.indexOf(screen.focused) + 1;
    const nextElement = screen.children[nextIndex];
    screen.focused.setValue(removeLastChar(screen.focused.getValue()));
    screen.focused.cancel();
    screen.focusPush(nextElement);
  } else {
    screen.focusNext();
  }
}

export default screen;
