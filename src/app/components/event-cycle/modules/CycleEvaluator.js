const WHITESPACE = /(\s+)/;
const SPLIT_ON_BRACKET = /([\[|\]])/g;

function tokenizeString(str) {
  const cycleTokens = str.split(WHITESPACE)
    .map(token => token.trim())
    .filter(token => token);
  return JSON.stringify(cycleTokens);
}

function parser(rawString) {
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
    const jsonObj = JSON.parse(`{"content": ${jsonStringArray}}`);
    return Object.assign(jsonObj, { ok: true, });
  } catch (error) {
    return { ok: false, error, };
  }
}

module.exports = { parser };
