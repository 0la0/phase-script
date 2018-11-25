
export function getElementWithFunctionName(element, functionName) {
  if (!element) {
    return false;
  }
  if (element[functionName]) {
    return element;
  }
  if (element.host && !element.host[functionName] && element.host.parentNode) {
    return getElementWithFunctionName(element.host.parentNode, functionName);
  }
  if (element.host && element.host[functionName]) {
    return element.host;
  }
  if (!element.parentNode) {
    return false;
  }
  return getElementWithFunctionName(element.parentNode, functionName);
}

export function getShadowHost(element) {
  if (!element) {
    return false;
  }
  if (element.host) {
    return element.host;
  }
  return getShadowHost(element.parentNode);
}

export function reflectAttribute(component, attribute, element) {
  if (!component.hasAttribute(attribute)) { return; }
  element.setAttribute(attribute, component.getAttribute(attribute));
}

export function reflectCallback(component, attribute, element) {
  if (!component.hasAttribute(attribute)) { return; }
  const functionName = component.getAttribute(attribute);
  const targetElement = getElementWithFunctionName(component.parentNode, functionName);
  element.addEventListener(attribute, targetElement[functionName].bind(targetElement));
}
