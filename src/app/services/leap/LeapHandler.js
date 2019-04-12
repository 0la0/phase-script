import { Controller } from 'leapjs';
import { clamp } from 'services/Math';

const EVENT_THRESH = 300;
const DISTANCE_MIN = 50;
const DISTANCE_MAX = 500;
const VECTOR_MIN = -300;
const VECTOR_MAX = 300;

function normalize(val, min, max) {
  return (clamp(val, min, max) - min) / (max - min);
}

function getContinuousControllerValues(palmPosition) {
  return {
    distance: normalize(
      Math.sqrt( palmPosition[0] ** 2 + palmPosition[1] ** 2 + palmPosition[2] ** 2),
      DISTANCE_MIN,
      DISTANCE_MAX
    ),
    x: normalize(palmPosition[0], VECTOR_MIN, VECTOR_MAX),
    y: normalize(palmPosition[2], VECTOR_MIN, VECTOR_MAX)
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
