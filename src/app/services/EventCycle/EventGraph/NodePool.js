import Dac from './Nodes/Dac';

export default class NodePool {
  constructor() {
    this.singletons = {
      dac: new Dac(),
    };
  }

  provideDac() {
    return this.singletons.dac;
  }
}
