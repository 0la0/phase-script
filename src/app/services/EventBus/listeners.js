import { eventBus } from 'services/EventBus';

function debounce(fn, time) {
  let timeout;
  return () => {
    const functionCall = () => fn.apply(this, arguments);
    clearTimeout(timeout);
    timeout = setTimeout(functionCall, time);
  };
}

function onMouseMove($event) {
  eventBus.publish({
    address: 'MOUSE_MOVE',
    $event
  });
}

export function initListeners() {
  window.addEventListener('mousemove', onMouseMove);
  // window.addEventListener('mousemove', e => debounce(onMouseMove(e), 500));
  window.addEventListener('mouseup', $event =>
    eventBus.publish({
      address: 'MOUSE_UP',
      $event
    })
  );
}
