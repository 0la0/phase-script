const WHITESPACE = /(\s+)/;
const SPLIT_ON_BRACKET = /([[|\]])/g;
const LINE_BREAK = /\n/;

function tokenizeString(str) {
  const cycleTokens = str.split(WHITESPACE)
    .map(token => token.trim())
    .filter(token => token);
  return JSON.stringify(cycleTokens);
}

function parseCycle(rawString) {
  const str = `[${rawString}]`;
  const jsonStringArray = str.split(SPLIT_ON_BRACKET)
    .map(chunk => chunk.trim())
    .filter(chunk => chunk)
    .map((chunk, index, arr) => {
      if (chunk === '[') {
        return chunk;
      }
      if (chunk === ']') {
        const nextChar = arr[index + 1];
        const comma = (nextChar !== undefined && nextChar !== ']') ? ',' : '';
        return `${chunk}${comma}`;
      }
      const comma = arr[index + 1] === ']' ? '' : ',';
      const tokenized = tokenizeString(chunk);
      const stringifiedElements = tokenized.substring(1, tokenized.length - 1);
      return `${stringifiedElements}${comma}`;
    })
    .join('');
  try {
    const cycleContent = JSON.parse(jsonStringArray);
    return { content: cycleContent, ok: true };
  } catch (error) {
    return { ok: false, error, };
  }
}

export default function cycleParser(rawString) {
  if (typeof rawString !== 'string') {
    throw new Error('Input must be string');
  }
  return rawString.split(LINE_BREAK)
    .map(line => line.trim())
    .filter(line => !!line)
    .map(line => parseCycle(line));
}
