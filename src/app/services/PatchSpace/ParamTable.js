function binarySearch(arr, time, low, high) {
  while (low < high) {
    const mid = Math.floor((low + high) / 2);
    const d1 = Math.abs(arr[mid].time - time);
    const d2 = Math.abs(arr[mid + 1].time - time);
    if (d2 <= d1) {
      low = mid + 1;
    }
    else {
      high = mid;
    }
  }
  return high;
}

export default class ParamTable {
  constructor() {
    this.table = new Array(16);
    this.size = 0;
    this.writeIndex = 0;
  }

  addScheduledValue(time, value) {
    this.table[this.writeIndex] = { time, value };
    if (this.size < this.table.length) {
      this.size++;
    }
    this.writeIndex = (this.writeIndex + 1) % this.table.length;
  }

  getValueForTime(time) {
    if (!this.size) {
      return false;
    }
    if (this.size < this.table.length) {
      const targetIndex = binarySearch(this.table, time, 0, this.writeIndex - 1);
      return this.table[targetIndex].value;
    }
    const upperBoundBottom = this.writeIndex - 1 < 0 ? 0 : this.writeIndex - 1;
    const bottomIndex = binarySearch(this.table, time, 0, upperBoundBottom);
    const topIndex = binarySearch(this.table, time, this.writeIndex, this.table.length - 1);
    const deltaBottom = Math.abs(time - this.table[bottomIndex].time);
    const deltaTop = Math.abs(time - this.table[topIndex].time);
    return deltaBottom < deltaTop ? this.table[bottomIndex].value : this.table[topIndex].value;
  }
}
