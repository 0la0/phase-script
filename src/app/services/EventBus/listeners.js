import provideEventBus from 'services/EventBus/eventBusProvider';

const eventBus = provideEventBus();

export function initListeners() {
  window.addEventListener('mousemove', $event =>
    eventBus.publish({
      address: 'MOUSE_MOVE',
      $event
    })
  );
  window.addEventListener('mouseup', $event =>
  eventBus.publish({
    address: 'MOUSE_UP',
    $event
  })
  );
}
