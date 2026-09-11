
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
  // 返回注销函数，便于组件卸载时只移除自己的监听
  return () => emitter.off(key, handler);
}

// 不传 handler 时清空该事件的全部监听
export function removeDataListener(handler) {
  if (handler) {
    emitter.off(key, handler);
  } else {
    emitter.off(key);
  }
}