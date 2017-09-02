import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import router from './RouterService';

const COMPONENT_NAME = 'router-outlet';

function registerRouteClicks(element) {
  const children = [...element.children];
  if (!children.length) {
    if (element.hasAttribute('onclicktoroute')) {
      const routeName = element.getAttribute('onclicktoroute');
      const hashPath = `/#${routeName}`;
      element.addEventListener('click', $event => router.goToPath(hashPath, true));
    }
  }
  else {
    children.forEach(registerRouteClicks);
  }
}

class RouterOutlet extends BaseComponent {

  constructor() {
    super('', '');
    const routeName = this.getAttribute('route');
    router.register(`/#${routeName}`, this);
    this.deactivateRoute();
  }

  connectedCallback() {}

  disconnectedCallback() {};

  attributeChangedCallback(attribute, oldVal, newVal) {}

  activateRoute() {
    this.root.innerHTML = this.originalMarkup;
    registerRouteClicks(this.root);
  }

  deactivateRoute() {
    this.root.innerHTML = '';
  }

}

export default new Component(COMPONENT_NAME, RouterOutlet);
