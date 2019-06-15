import assert from 'assert';
import { first, last } from '../../modules/utils';

export function selectLastOrNextChild(element) {
  if (element.selected == null) {
    selectLastChild(element);
  } else {
    selectNextChild(element);
  }
}

export function selectFirstOrPreviousChild(element) {
  if (element.selected == null) {
    selectFirstChild(element);
  } else {
    selectPreviousChild(element);
  }
}

export function selectLastChild(element) {
  assert(element.children.length > 0);
  selectChild(element, last(element.children));
}

export function selectFirstChild(element) {
  assert(element.children.length > 0);
  selectChild(element, first(element.children));
}

function selectNextChild(element) {
  const index = computeIndexOfNextChild(element);
  const nextChild = element.children[index];
  selectChild(element, nextChild);
}

function selectPreviousChild(element) {
  const index = computeIndexOfPreviousChild(element);
  const previousChild = element.children[index];
  selectChild(element, previousChild);
}

function computeIndexOfNextChild(element) {
  assert(element.children.length > 0);

  const index = Math.min(
    element.selected + 1,
    element.children.length - 1
  );

  assert(index > -1);
  assert(index < element.children.length);

  return index;
}

function computeIndexOfPreviousChild(element) {
  assert(element.children.length > 0);

  const index = Math.max(
    element.selected - 1,
    0
  );

  assert(index > -1);
  assert(index < element.children.length);

  return index;
}

function selectChild(parent, child) {
  assert(parent.scrollable);

  const childIndex = parent.children.indexOf(child);
  const offset = childIndex > (parent.selected || -1)
    ? 1   // scroll down
    : -1; // scroll up
  mouseout(parent.children[parent.selected]);
  parent.scrollTo(Math.max(child.top + offset, 0));
  parent.selected = childIndex; // FIXME this is ugly code.
  mouseover(parent.children[parent.selected]);

  assert(parent.selected !== -1);
}

function mouseout(element) {
  if (element) {
    element.emit('mouseout');
  }
}

function mouseover(element) {
  if (element) {
    element.emit('mouseover');
  }
}