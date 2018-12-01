import assert from 'assert';
import ScaleManager from 'services/scale/ScaleManager';

describe('ScaleManager', () => {
  it('throws an error if a scale is not defined', () => {
    assert.throws(() => new ScaleManager('FOO'), Error, 'Scale FOO is not defined');
  });

  it('acts as the identity function for single the major scale, with a base note of 24', () => {
    const scaleManager = new ScaleManager('major');
    const testCases = [
      { baseNote: 24, inputNote: 48, },
      { baseNote: 24, inputNote: 47, },
      { baseNote: 24, inputNote: 45, },
      { baseNote: 24, inputNote: 43, },
      { baseNote: 24, inputNote: 41, },
      { baseNote: 24, inputNote: 40, },
      { baseNote: 24, inputNote: 38, },
      { baseNote: 24, inputNote: 36, },
      { baseNote: 24, inputNote: 35, },
      { baseNote: 24, inputNote: 33, },
      { baseNote: 24, inputNote: 31, },
      { baseNote: 24, inputNote: 29, },
      { baseNote: 24, inputNote: 28, },
      { baseNote: 24, inputNote: 26, },
      { baseNote: 24, inputNote: 24, },
      { baseNote: 24, inputNote: 23, },
      { baseNote: 24, inputNote: 21, },
      { baseNote: 24, inputNote: 19, },
      { baseNote: 24, inputNote: 17, },
      { baseNote: 24, inputNote: 16, },
      { baseNote: 24, inputNote: 14, },
      { baseNote: 24, inputNote: 12, },
      { baseNote: 24, inputNote: 11, },
      { baseNote: 24, inputNote: 9, },
      { baseNote: 24, inputNote: 7, },
      { baseNote: 24, inputNote: 5, },
      { baseNote: 24, inputNote: 4, },
      { baseNote: 24, inputNote: 2, },
      { baseNote: 24, inputNote: 0, },
    ];
    testCases.forEach(testCase => assert.equal(
      scaleManager.getNearestNote(testCase.baseNote, testCase.inputNote), testCase.inputNote));
  });

  it('acts as the identity function for single the major scale, with a base note of 0', () => {
    const scaleManager = new ScaleManager('major');
    const testCases = [
      { baseNote: 0, inputNote: 24, },
      { baseNote: 0, inputNote: 23, },
      { baseNote: 0, inputNote: 21, },
      { baseNote: 0, inputNote: 19, },
      { baseNote: 0, inputNote: 17, },
      { baseNote: 0, inputNote: 16, },
      { baseNote: 0, inputNote: 14, },
      { baseNote: 0, inputNote: 12, },
      { baseNote: 0, inputNote: 11, },
      { baseNote: 0, inputNote: 9, },
      { baseNote: 0, inputNote: 7, },
      { baseNote: 0, inputNote: 5, },
      { baseNote: 0, inputNote: 4, },
      { baseNote: 0, inputNote: 2, },
      { baseNote: 0, inputNote: 0, },
    ];
    testCases.forEach(testCase => assert.equal(
      scaleManager.getNearestNote(testCase.baseNote, testCase.inputNote), testCase.inputNote));
  });

  it('acts as the identity function for single the major scale, with a base note of 1', () => {
    const scaleManager = new ScaleManager('major');
    const testCases = [
      { baseNote: 1, inputNote: 25, },
      { baseNote: 1, inputNote: 24, },
      { baseNote: 1, inputNote: 22, },
      { baseNote: 1, inputNote: 20, },
      { baseNote: 1, inputNote: 18, },
      { baseNote: 1, inputNote: 17, },
      { baseNote: 1, inputNote: 15, },
      { baseNote: 1, inputNote: 13, },
      { baseNote: 1, inputNote: 12, },
      { baseNote: 1, inputNote: 10, },
      { baseNote: 1, inputNote: 8, },
      { baseNote: 1, inputNote: 6, },
      { baseNote: 1, inputNote: 5, },
      { baseNote: 1, inputNote: 3, },
      { baseNote: 1, inputNote: 1, },
    ];
    testCases.forEach(testCase => assert.equal(
      scaleManager.getNearestNote(testCase.baseNote, testCase.inputNote), testCase.inputNote));
  });

  it('returns the nearest note', () => {
    const scaleManager = new ScaleManager('major');
    const testCases = [
      { baseNote: 0, inputNote: 11.6, expectedNote: 12, },
      { baseNote: 0, inputNote: 11.4, expectedNote: 11, },
      { baseNote: 0, inputNote: 10.6, expectedNote: 11, },
      { baseNote: 0, inputNote: 8.1, expectedNote: 9, },
      { baseNote: 0, inputNote: 7.7, expectedNote: 7, },
      { baseNote: 0, inputNote: 4.6, expectedNote: 5, },
      { baseNote: 0, inputNote: 4.4, expectedNote: 4, },
      { baseNote: 0, inputNote: 3.1, expectedNote: 4, },
      { baseNote: 0, inputNote: 2.9, expectedNote: 2, },
      { baseNote: 0, inputNote: 1.9, expectedNote: 2, },
      { baseNote: 0, inputNote: 1.6, expectedNote: 2, },
      { baseNote: 0, inputNote: 1.2, expectedNote: 2, },
      { baseNote: 0, inputNote: 0.8, expectedNote: 0, },
      { baseNote: 0, inputNote: 0.1, expectedNote: 0, },
    ];
    testCases.forEach(testCase => assert.equal(
      scaleManager.getNearestNote(testCase.baseNote, testCase.inputNote), testCase.expectedNote));
  });

  it('acts as the identity function for single the minor Pentatonic scale, with a base note of 24', () => {
    const scaleManager = new ScaleManager('minorPentatonic');
    const testCases = [
      { baseNote: 12, inputNote: 36, },
      { baseNote: 12, inputNote: 34, },
      { baseNote: 12, inputNote: 31, },
      { baseNote: 12, inputNote: 29, },
      { baseNote: 12, inputNote: 27, },
      { baseNote: 12, inputNote: 24, },
      { baseNote: 12, inputNote: 22, },
      { baseNote: 12, inputNote: 19, },
      { baseNote: 12, inputNote: 17, },
      { baseNote: 12, inputNote: 15, },
      { baseNote: 12, inputNote: 12, },
      { baseNote: 12, inputNote: 10, },
      { baseNote: 12, inputNote: 7, },
      { baseNote: 12, inputNote: 5, },
      { baseNote: 12, inputNote: 3, },
      { baseNote: 12, inputNote: 0, },
    ];
    testCases.forEach(testCase => assert.equal(
      scaleManager.getNearestNote(testCase.baseNote, testCase.inputNote), testCase.inputNote));
  });
});
