export default function parseToken(token) {
  if (typeof token !== 'string') {
    throw new Error('Tokenizer input must be a string', token);
  }
  const [ address, noteString ] = token.split(':');
  const intNote = parseInt(noteString, 10);
  const note = isNaN(intNote) ? undefined : intNote;
  return { address, note };
}
