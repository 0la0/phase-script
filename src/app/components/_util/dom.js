
function getElementWithFunctionName(element, functionName) {
  if (!element) {
    return false;
  }
  if (element[functionName]) {
    return element;
  }
  if (element.host && !element.host[functionName]) {
    return false;
  }
  if (element.host && element.host[functionName]) {
    return element.host;
  }
  if (!element.parentNode) {
    return false;
  }
  return getElementWithFunctionName(element.parentNode, functionName);
}

export {getElementWithFunctionName};
