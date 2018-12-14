import assert from 'assert';
import parseCycle from 'services/EventCycle/Parser';

describe('CycleParser', () => {
  it('parses empty strings', () => {
    const result = parseCycle('');
    assert.deepEqual(result, { ok: true, content: [] });
  });

  it('parses single item strings', () => {
    const result = parseCycle('foo');
    assert.deepEqual(result, { ok: true, content: [ 'foo' ] } );
  });

  it('parses multi-item strings', () => {
    const result = parseCycle('a b c d');
    assert.deepEqual(result, { ok: true, content: [ 'a', 'b', 'c', 'd' ] } );
  });

  it('parses multi-item strings with characters', () => {
    const result = parseCycle('a:b , .c d');
    assert.deepEqual(result, { ok: true, content: [ 'a:b', ',', '.c', 'd' ] } );
  });

  it('does not parse strings with open ended brackets', () => {
    [
      'a ]', '[', '[[]', '[][]['
    ].forEach(example => {
      const result = parseCycle(example);
      assert.ok(!result.ok);
    });
  });

  it('parses strings with closed brackets', () => {
    const one = parseCycle('[a]');
    assert.deepEqual(one, { ok: true, content: [ ['a'] ] } );

    const two = parseCycle('[]');
    assert.deepEqual(two, { ok: true, content: [[]] } );

    const three = parseCycle('[[]]');
    assert.deepEqual(three, { ok: true, content: [[[]]] } );

    const four = parseCycle('[][][]');
    assert.deepEqual(four, { ok: true, content: [ [], [], [] ] } );

    const five = parseCycle('[[[]][[]][]]');
    assert.deepEqual(five, { ok: true, content: [ [ [ [] ], [ [] ], [] ] ] } );

    const six = parseCycle('[ [[] ][[ ]] [ ]]');
    assert.deepEqual(six, { ok: true, content: [ [ [ [] ], [ [] ], [] ] ] } );
  });

  it('parses strings with closed brackets', () => {
    const one = parseCycle('[a]');
    assert.deepEqual(one, { ok: true, content: [ ['a'] ] } );

    const two = parseCycle('[]');
    assert.deepEqual(two, { ok: true, content: [[]] } );

    const three = parseCycle('[[]]');
    assert.deepEqual(three, { ok: true, content: [[[]]] } );

    const four = parseCycle('[][][]');
    assert.deepEqual(four, { ok: true, content: [ [], [], [] ] } );

    const five = parseCycle('[[[]][[]][]]');
    assert.deepEqual(five, { ok: true, content: [ [ [ [] ], [ [] ], [] ] ] } );

    const six = parseCycle('[ [[] ][[ ]] [ ]]');
    assert.deepEqual(six, { ok: true, content: [ [ [ [] ], [ [] ], [] ] ] } );
  });
});
