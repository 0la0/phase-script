import Component from 'components/_util/component';
import router from 'services/Router';

const COMPONENT_NAME = 'router-outlet';

class RouterOutlet extends HTMLElement {
  constructor() {
    super();
    this.template = document.createElement('template');
    [...this.children].forEach((child) => {
      this.removeChild(child);
      this.template.content.appendChild(child);
    });
    const routeName = `/#${this.getAttribute('route')}`;
    router.register(routeName, this);
  }

  activateRoute() {
    this.appendChild(this.template.content.cloneNode(true));
  }

  deactivateRoute() {
    [...this.children].forEach(child => this.removeChild(child));
  }
}

export default new Component(COMPONENT_NAME, RouterOutlet);
