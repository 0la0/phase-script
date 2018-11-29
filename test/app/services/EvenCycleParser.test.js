import assert from 'assert';
import { arrayEquality } from './_util';
import cycleParser from '../../../src/app/services/EventCycle/cycleParser';

describe('cycleParser', () => {
  it('parses empty strings', () => {
    const result = cycleParser('');
    assert.equal(result.ok, true);
    assert.equal(arrayEquality(result.content, []), true);
  });

  it('parses single item strings', () => {
    const result = cycleParser('foo');
    assert.equal(result.ok, true);
    assert.equal(arrayEquality(result.content, [ 'foo' ]), true);
  });

  it('parses multi-item strings', () => {
    const result = cycleParser('a b c d');
    assert.equal(result.ok, true);
    assert.equal(arrayEquality(result.content, [ 'a', 'b', 'c', 'd' ]), true);
  });

  it('parses multi-item strings with characters', () => {
    const result = cycleParser('a:b , .c d');
    assert.equal(result.ok, true);
    assert.equal(arrayEquality(result.content, [ 'a:b', ',', '.c', 'd' ]), true);
  });

  it('does not parse non-string inputs', () => {
    assert.equal(cycleParser().ok, false);
    assert.equal(cycleParser(null).ok, false);
    assert.equal(cycleParser(true).ok, false);
    assert.equal(cycleParser(false).ok, false);
    assert.equal(cycleParser({}).ok, false);
    assert.equal(cycleParser({ string: 'foo' }).ok, false);
    assert.equal(cycleParser([ 'one', 'two' ]).ok, false);
    assert.equal(cycleParser(String).ok, false);
    assert.equal(cycleParser(String.prototype).ok, false);
    assert.equal(cycleParser(0).ok, false);
    assert.equal(cycleParser(1).ok, false);
  });

  it('does not parse strings with open ended brackets', () => {
    assert.equal(cycleParser('a ]').ok, false);
    assert.equal(cycleParser('[').ok, false);
    assert.equal(cycleParser('[[]').ok, false);
    assert.equal(cycleParser('[][][').ok, false);
  });

  it('parses strings with closed brackets', () => {
    const one = cycleParser('[a]');
    assert.equal(one.ok, true);
    assert.equal(arrayEquality(one.content, [ ['a'] ]), true);

    const two = cycleParser('[]');
    assert.equal(two.ok, true);
    assert.equal(arrayEquality(two.content, [[]]), true);

    const three = cycleParser('[[]]');
    assert.equal(three.ok, true);
    assert.equal(arrayEquality(three.content, [[[]]]), true);

    const four = cycleParser('[][][]');
    assert.equal(four.ok, true);
    assert.equal(arrayEquality(four.content, [ [], [], [] ]), true);

    const five = cycleParser('[[[]][[]][]]');
    assert.equal(five.ok, true);
    assert.equal(arrayEquality(five.content, [ [ [ [] ], [ [] ], [] ] ]), true);

    const six = cycleParser('[ [[] ][[ ]] [ ]]');
    assert.equal(six.ok, true);
    assert.equal(arrayEquality(six.content, [ [ [ [] ], [ [] ], [] ] ]), true);
  });

  it('parses strings with closed brackets', () => {
    const one = cycleParser('[a]');
    assert.equal(one.ok, true);
    assert.equal(arrayEquality(one.content, [ ['a'] ]), true);

    const two = cycleParser('[]');
    assert.equal(two.ok, true);
    assert.equal(arrayEquality(two.content, [[]]), true);

    const three = cycleParser('[[]]');
    assert.equal(three.ok, true);
    assert.equal(arrayEquality(three.content, [[[]]]), true);

    const four = cycleParser('[][][]');
    assert.equal(four.ok, true);
    assert.equal(arrayEquality(four.content, [ [], [], [] ]), true);

    const five = cycleParser('[[[]][[]][]]');
    assert.equal(five.ok, true);
    assert.equal(arrayEquality(five.content, [ [ [ [] ], [ [] ], [] ] ]), true);

    const six = cycleParser('[ [[] ][[ ]] [ ]]');
    assert.equal(six.ok, true);
    assert.equal(arrayEquality(six.content, [ [ [ [] ], [ [] ], [] ] ]), true);
  });
});
