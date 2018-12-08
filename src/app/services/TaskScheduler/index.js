export function enqueueTask() {
  setTimeout(...arguments);
}

export function enqueueMicroTask(microTask) {
  Promise.resolve().then(microTask);
}
