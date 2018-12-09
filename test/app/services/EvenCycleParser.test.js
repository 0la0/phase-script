import assert from 'assert';
import cycleParser from 'services/EventCycle/Parser';

describe('CycleParser', () => {
  it('parses empty strings', () => {
    const result = cycleParser('');
    assert.deepEqual(result, []);
  });

  it('parses single item strings', () => {
    const result = cycleParser('foo');
    assert.deepEqual(result, [ { ok: true, content: [ 'foo' ] } ] );
  });

  it('parses multi-item strings', () => {
    const result = cycleParser('a b c d');
    assert.deepEqual(result, [ { ok: true, content: [ 'a', 'b', 'c', 'd' ] } ]);
  });

  it('parses multi-item strings with characters', () => {
    const result = cycleParser('a:b , .c d');
    assert.deepEqual(result, [ { ok: true, content: [ 'a:b', ',', '.c', 'd' ] } ]);
  });

  it('only accepts strings', () => {
    assert.throws(() => cycleParser(), Error, 'Input must be string');
    assert.throws(() => cycleParser(null), Error, 'Input must be string');
    assert.throws(() => cycleParser(true), Error, 'Input must be string');
    assert.throws(() => cycleParser(true), Error, 'Input must be string');
    assert.throws(() => cycleParser(false), Error, 'Input must be string');
    assert.throws(() => cycleParser({}), Error, 'Input must be string');
    assert.throws(() => cycleParser({ string: 'foo' }), Error, 'Input must be string');
    assert.throws(() => cycleParser([ 'one', 'two' ]), Error, 'Input must be string');
    assert.throws(() => cycleParser(String), Error, 'Input must be string');
    assert.throws(() => cycleParser(String.prototype.constructor), Error, 'Input must be string');
    assert.throws(() => cycleParser(0), Error, 'Input must be string');
    assert.throws(() => cycleParser(1), Error, 'Input must be string');
  });

  it('does not parse strings with open ended brackets', () => {
    [
      'a ]', '[', '[[]', '[][]['
    ].forEach(example => {
      const result = cycleParser(example);
      assert.equal(result.length, 1);
      assert.ok(!result[0].ok);
    });
  });

  it('parses strings with closed brackets', () => {
    const one = cycleParser('[a]');
    assert.deepEqual(one, [ { ok: true, content: [ ['a'] ] } ] );

    const two = cycleParser('[]');
    assert.deepEqual(two, [ { ok: true, content: [[]] } ] );

    const three = cycleParser('[[]]');
    assert.deepEqual(three, [ { ok: true, content: [[[]]] } ] );

    const four = cycleParser('[][][]');
    assert.deepEqual(four, [ { ok: true, content: [ [], [], [] ] } ] );

    const five = cycleParser('[[[]][[]][]]');
    assert.deepEqual(five, [ { ok: true, content: [ [ [ [] ], [ [] ], [] ] ] } ] );

    const six = cycleParser('[ [[] ][[ ]] [ ]]');
    assert.deepEqual(six, [ { ok: true, content: [ [ [ [] ], [ [] ], [] ] ] } ] );
  });

  it('parses strings with closed brackets', () => {
    const one = cycleParser('[a]');
    assert.deepEqual(one, [ { ok: true, content: [ ['a'] ] } ] );

    const two = cycleParser('[]');
    assert.deepEqual(two, [ { ok: true, content: [[]] } ] );

    const three = cycleParser('[[]]');
    assert.deepEqual(three, [ { ok: true, content: [[[]]] } ] );

    const four = cycleParser('[][][]');
    assert.deepEqual(four, [ { ok: true, content: [ [], [], [] ] } ] );

    const five = cycleParser('[[[]][[]][]]');
    assert.deepEqual(five, [ { ok: true, content: [ [ [ [] ], [ [] ], [] ] ] } ] );

    const six = cycleParser('[ [[] ][[ ]] [ ]]');
    assert.deepEqual(six, [ { ok: true, content: [ [ [ [] ], [ [] ], [] ] ] } ] );
  });

  it('handles line breaks', () => {
    const one = cycleParser('[]\n[]');
    assert.deepEqual(one, [
      { ok: true, content: [ [] ] },
      { ok: true, content: [ [] ] }
    ]);

    const two = cycleParser('a b [ c d ]\n1 2 [3 4 5]');
    assert.deepEqual(two, [
      { ok: true, content: [ 'a', 'b', ['c', 'd'] ] },
      { ok: true, content: [ '1', '2', ['3', '4', '5'] ] }
    ]);
  });
});
