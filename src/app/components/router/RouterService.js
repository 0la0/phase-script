class Router {
  constructor() {
    this.routes = new Map();
    window.addEventListener('hashchange', () => this.goToPath(`/${location.hash}`));
    setTimeout(() => {
      const hash = `/${location.hash}`;
      const path = this.routes.has(hash) ? hash : '/#/';
      this.goToPath(path);
    });
  }

  goToPath(path, shouldPush) {
    const outgoingPath = this.routes.has(path) ? path : '';
    this.routes.forEach((component, routeName) => {
      routeName === outgoingPath ?
        component.activateRoute() :
        component.deactivateRoute();
    });
    if (shouldPush) {
      history.pushState({}, '', outgoingPath);
    } else {
      history.replaceState({}, '', outgoingPath);
    }
  }

  register(path, component) {
    this.routes.set(path, component);
  }
}

export default new Router();
