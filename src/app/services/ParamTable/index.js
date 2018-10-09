
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
      return this.table[targetIndex].time;
    }
    const upperBoundBottom = this.writeIndex - 1 < 0 ? 0 : this.writeIndex - 1;
    const bottomIndex = binarySearch(this.table, time, 0, upperBoundBottom);
    const topIndex = binarySearch(this.table, time, this.writeIndex, this.table.length - 1);
    const deltaBottom = Math.abs(time - this.table[bottomIndex].time);
    const deltaTop = Math.abs(time - this.table[topIndex].time);
    return deltaBottom < deltaTop ? this.table[bottomIndex].value : this.table[topIndex].value;
  }
}

// (function () {
//   const param = new ParamTable();
//   console.log('get anything from empty table:', param.getValueForTime(0), false);
//   [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, ].forEach(val => param.addScheduledValue(val, `${val}`))
//   console.log('original size:', param.table.length, 16);
//   console.log('get at 0', param.getValueForTime(0), 0);
//   console.log('get at 3.3', param.getValueForTime(3.3), 3);
//   console.log('get at 6', param.getValueForTime(6), 6);
//   console.log('get at 7', param.getValueForTime(7), 7);
//   console.log('get at 1.2', param.getValueForTime(1.2), 1);
//   console.log('get at 1.5', param.getValueForTime(1.5), 2);
//   [ 10, 11, 12, 13, 14, 15, 16, 17, 18, ].forEach(val => param.addScheduledValue(val, `${val}`))
//   console.log('get at 14.7', param.getValueForTime(14.7), 15);
//   console.log('get at 3.3', param.getValueForTime(3.3), 3);
//   param.addScheduledValue(19, `${19}`)
//   console.log('get at 3.3', param.getValueForTime(3.3), 4);
//   [ 20, 21, 22, 23, ].forEach(val => param.addScheduledValue(val, `${val}`))
//   console.log('get at 0', param.getValueForTime(0), 8);
//   console.log('get at 25', param.getValueForTime(25), 23);
//   console.log('get at 16', param.getValueForTime(16), 16);
//   console.log('get at 22', param.getValueForTime(22), 22);
//   console.log('get at 23', param.getValueForTime(23), 23);
//   console.log('get at 27', param.getValueForTime(27), 23);
// })()
