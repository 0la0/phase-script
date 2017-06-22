import {MarkovStateEntity} from './markovStateEntity';

function getColorFromValue(value) {
  const colorValue = 255 - Math.floor(255 * value);
  const hexValue = colorValue.toString(16);
  return `#${hexValue}${hexValue}${hexValue}`;
}

export function buildMarkovState(index, width, height, element, isActive) {
  const size = width * height;
  const edges = {};

  // Up
  if (Math.floor(index / width) > 0) {
    edges.up = index - width;
  }
  // Right
  if ((index + 1) % width > 0) {
    edges.right = index + 1;
  }
  // Down
  if (index < (size - width)) {
    edges.down = index + width;
  }
  //Left
  if ((index % width) > 0) {
    edges.left = index - 1;
  }

  const markovState = new MarkovStateEntity(edges);

  // paint edges
  const up = markovState.getEdgeByDirection('up') || 0;
  const right = markovState.getEdgeByDirection('right') || 0;
  const down = markovState.getEdgeByDirection('down') || 0;
  const left = markovState.getEdgeByDirection('left') || 0;


  const borderSize = 6;

  element.style.setProperty('border-top', `${borderSize}px solid ${getColorFromValue(up)}`);
  element.style.setProperty('border-right', `${borderSize}px solid ${getColorFromValue(right)}`);
  element.style.setProperty('border-bottom', `${borderSize}px solid ${getColorFromValue(down)}`);
  element.style.setProperty('border-left', `${borderSize}px solid ${getColorFromValue(left)}`);

  if (isActive) {
    // element.classList.add('markov-state--live');
    //element.style.setProperty('background-color', '#999999');
  }

  return markovState;
}
