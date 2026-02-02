
import mitt from 'mitt';

const emitter = mitt();

const key = Symbol('VALUE_CHANGE');

let lastData;

export function setDataEmitter(to) {
  emitter.emit(key, to);
  lastData = to;
}

export function listenerDataChange(
  handler,
  immediate = true
) {
  emitter.on(key, handler);
  if (immediate && lastData) {
    handler(lastData);
  } 
}

export function removeDataListener() {
  emitter.off(key);
}