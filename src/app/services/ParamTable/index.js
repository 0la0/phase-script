
function binarySearch(arr, time) {
  let low = 0;
  let high = arr.length - 1;
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
    this.table = [];
  }

  addScheduledValue(time, value) {
    this.table.push({ time, value });
  }

  getValueForTime(time) {
    if (!this.table.length) {
      return false;
    }
    // binary search for closest scheduled value
    const targetIndex = binarySearch(this.table, time);
    const targetValue = this.table[targetIndex].value;
    this.table.splice(0, targetIndex + 1);
    return targetValue;
  }
}

// (function () {
//   const param = new ParamTable();
//   console.log('get anything from empty table:', param.getValueForTime(0));
//   [ 0, 1, 2, 3, 4, 5, ].forEach(val => param.addScheduledValue(val, `${val}`))
//   console.log('original size:', param.table.length);
//   console.log('get at 0', param.getValueForTime(0));
//   console.log('size', param.table.length);
//   console.log('get at 3.3', param.getValueForTime(3.3));
//   console.log('size', param.table.length);
//   console.log('get at 6', param.getValueForTime(6));
//   console.log('size', param.table.length);
//   console.log('get at 7', param.getValueForTime(7));
//   console.log('size', param.table.length);
//   [ 10, 11, 12, 13, 14, 15, ].forEach(val => param.addScheduledValue(val, `${val}`))
//   console.log('get at 14.7', param.getValueForTime(14.7));
//   console.log('size', param.table.length);
//   console.log('get at 3.3', param.getValueForTime(3.3));
//   console.log('size', param.table.length);
// })()
