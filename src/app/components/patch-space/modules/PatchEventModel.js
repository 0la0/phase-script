function defaultSchedulable(message) {
  console.log('Schedulable not implemented', message);
}

export default class PatchEventModel {
  constructor(schedulable) {
    this.schedule = schedulable || defaultSchedulable;
    this.outlets = new Set([]);
  }

  getInput() {
    return this;
  }

  connect(model) {
    this.outlets.add(model);
  }

  disconnect(model) {
    this.outlets.delete(model);
  }

  getOutlets() {
    return this.outlets;
  }
}
