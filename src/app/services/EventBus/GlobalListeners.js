
export default function initGlobalListeners(eventBus) {
  window.addEventListener('mousemove', event =>
    eventBus.publish({ address: 'MOUSE_MOVE', event }));
  window.addEventListener('mouseup', event =>
    eventBus.publish({ address: 'MOUSE_UP', event }));
}
