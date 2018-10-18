let timerID = null;
let interval = 100;

const START = 'start';
const STOP = 'stop';
const TICK = 'tick';

onmessage = (event) => {
  if (event.data === START) {
		timerID = setInterval(() => postMessage(TICK), interval);
	}
	else if (event.data.interval) {
		interval = event.data.interval;
		if (timerID) {
			clearInterval(timerID);
			timerID = setInterval(() => postMessage(TICK), interval);
		}
	}
	else if (event.data === STOP) {
		clearInterval(timerID);
		timerID = null;
	}
};
