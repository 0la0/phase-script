import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import router from 'services/Router';

const COMPONENT_NAME = 'router-outlet';

class RouterOutlet extends BaseComponent {
  constructor() {
    super('', '');
    const routeName = this.getAttribute('route');
    router.register(`/#${routeName}`, this);
    this.deactivateRoute();
  }

  activateRoute() {
    this.shadowRoot.innerHTML = this.originalMarkup;
    // const fragment = this.template.content.cloneNode(true);
    // this.shadowRoot.appendChild(fragment);
  }

  deactivateRoute() {
    // this.shadowRoot.innerHTML = '';
    [...this.shadowRoot.children].forEach(child => this.shadowRoot.removeChild(child));
  }
}

export default new Component(COMPONENT_NAME, RouterOutlet);
