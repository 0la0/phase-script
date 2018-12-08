import assert from 'assert';
import cycleParser from 'services/EventCycle/Parser';

describe('CycleParser', () => {
  it('parses empty strings', () => {
    const result = cycleParser('');
    assert.ok(result.ok);
    assert.deepEqual(result.content, []);
  });

  it('parses single item strings', () => {
    const result = cycleParser('foo');
    assert.ok(result.ok);
    assert.deepEqual(result.content, [ 'foo' ]);
  });

  it('parses multi-item strings', () => {
    const result = cycleParser('a b c d');
    assert.ok(result.ok);
    assert.deepEqual(result.content, [ 'a', 'b', 'c', 'd' ]);
  });

  it('parses multi-item strings with characters', () => {
    const result = cycleParser('a:b , .c d');
    assert.ok(result.ok);
    assert.deepEqual(result.content, [ 'a:b', ',', '.c', 'd' ]);
  });

  it('does not parse non-string inputs', () => {
    assert.ok(!cycleParser().ok);
    assert.ok(!cycleParser(null).ok);
    assert.ok(!cycleParser(true).ok);
    assert.ok(!cycleParser(false).ok);
    assert.ok(!cycleParser({}).ok);
    assert.ok(!cycleParser({ string: 'foo' }).ok);
    assert.ok(!cycleParser([ 'one', 'two' ]).ok);
    assert.ok(!cycleParser(String).ok);
    assert.ok(!cycleParser(String.prototype).ok);
    assert.ok(!cycleParser(0).ok);
    assert.ok(!cycleParser(1).ok);
  });

  it('does not parse strings with open ended brackets', () => {
    assert.ok(!cycleParser('a ]').ok);
    assert.ok(!cycleParser('[').ok);
    assert.ok(!cycleParser('[[]').ok);
    assert.ok(!cycleParser('[][][').ok);
  });

  it('parses strings with closed brackets', () => {
    const one = cycleParser('[a]');
    assert.ok(one.ok);
    assert.deepEqual(one.content, [ ['a'] ]);

    const two = cycleParser('[]');
    assert.ok(two.ok);
    assert.deepEqual(two.content, [[]]);

    const three = cycleParser('[[]]');
    assert.ok(three.ok);
    assert.deepEqual(three.content, [[[]]]);

    const four = cycleParser('[][][]');
    assert.ok(four.ok);
    assert.deepEqual(four.content, [ [], [], [] ]);

    const five = cycleParser('[[[]][[]][]]');
    assert.ok(five.ok);
    assert.deepEqual(five.content, [ [ [ [] ], [ [] ], [] ] ]);

    const six = cycleParser('[ [[] ][[ ]] [ ]]');
    assert.ok(six.ok);
    assert.deepEqual(six.content, [ [ [ [] ], [ [] ], [] ] ]);
  });

  it('parses strings with closed brackets', () => {
    const one = cycleParser('[a]');
    assert.ok(one.ok);
    assert.deepEqual(one.content, [ ['a'] ]);

    const two = cycleParser('[]');
    assert.ok(two.ok);
    assert.deepEqual(two.content, [[]]);

    const three = cycleParser('[[]]');
    assert.ok(three.ok);
    assert.deepEqual(three.content, [[[]]]);

    const four = cycleParser('[][][]');
    assert.ok(four.ok);
    assert.deepEqual(four.content, [ [], [], [] ]);

    const five = cycleParser('[[[]][[]][]]');
    assert.ok(five.ok);
    assert.deepEqual(five.content, [ [ [ [] ], [ [] ], [] ] ]);

    const six = cycleParser('[ [[] ][[ ]] [ ]]');
    assert.ok(six.ok);
    assert.deepEqual(six.content, [ [ [ [] ], [ [] ], [] ] ]);
  });
});
