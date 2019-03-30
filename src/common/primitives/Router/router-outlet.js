import router from './index';

export default class RouterOutlet extends HTMLElement {
  static get tag() {
    return 'router-outlet';
  }

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
