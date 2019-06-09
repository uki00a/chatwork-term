import assert from 'assert';
import { findLast, first, last } from '../../modules/utils';

export function registerHandlers(element) {
  const onScroll = createScrollHandler(element);
  element.on('scroll', onScroll);
  return () => {
    element.removeEventListener('scroll', onScroll);
  };
}

function createScrollHandler(scrollable) {
  let hovered = null;
  let previousScrollTop = scrollable.getScroll();

  assert(!scrollable.alwaysScroll, 'alwaysScroll must be false'); // FIXME
  assert(scrollable.scrollable, 'scrollable must be true');

  function hover(element) {
    assert(element);
    if (hovered == null) {
      element.emit('mouseover');
      hovered = element;
      scrollable.selected = scrollable.children.indexOf(element); // FIXME this is ugly code
    } else if (hovered != element) {
      hovered.emit('mouseout');
      element.emit('mouseover');
      hovered = element;
      scrollable.selected = scrollable.children.indexOf(element); // FIXME this is ugly code
    }
    assert(hovered);
    assert(typeof scrollable.selected === 'number');
  }

  function determineHoveredElement(children, top) {
    const element = findNearestElement(children, top);
    if (element) {
      return element;
    } else {
      return top > previousScrollTop
        ? last(children) // scroll down
        : first(children); // scroll up
    }
  }

  function onScroll() {
    const currentScrollTop = scrollable.getScroll();
    if (currentScrollTop === previousScrollTop) {
      return;
    }

    const childToHover = determineHoveredElement(scrollable.children, currentScrollTop);
    hover(childToHover);
    previousScrollTop = currentScrollTop;
  }

  return onScroll;
}

function findNearestElement(children, top) {
  return findLast(children, x => x.top <= top);
}

