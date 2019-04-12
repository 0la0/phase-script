import { Controller } from 'leapjs';

const EVENT_THRESH = 300;

function getContinuousControllerValues(palmPosition) {
  return {
    distance: Math.sqrt(
      palmPosition[0] ** 2 +
      palmPosition[1] ** 2 +
      palmPosition[2] ** 2
    ),
    x: palmPosition[0],
    y: palmPosition[2]
  };
}

class LeapHandler {
  constructor() {
    this.leapController = new Controller({ frameEventName: 'deviceFrame' }).connect();
    this.lastPalmZ = 0;
  }

  update() {
    const leapFrame = this.leapController.frame();
    if (!leapFrame.valid || !leapFrame.hands.length) {
      return {};
    }
    let leftHandEvents;
    let rightHandEvents;
    leapFrame.hands.forEach((hand) => {
      if (hand.type === 'left') {
        leftHandEvents = getContinuousControllerValues(hand.palmPosition);
        return;
      }
      const palmZ = hand.palmPosition[1];
      if (palmZ < EVENT_THRESH && this.lastPalmZ >= EVENT_THRESH) {
        rightHandEvents = { triggerEvent: true, };
      }
      this.lastPalmZ = palmZ;
    });
    return { leftHandEvents, rightHandEvents, };
  }
}

const leapHandler = new LeapHandler();
export default leapHandler;
