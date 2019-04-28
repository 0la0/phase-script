import { eventBus } from 'services/EventBus';

class Store {
  constructor() {
    this.dataStore = {};
  }

  setValue(obj) {
    this.dataStore = Object.assign(this.dataStore, obj);
    eventBus.publish({ address: 'DATA_STORE', dataStore: this.dataStore });
  }
}

export default new Store();
