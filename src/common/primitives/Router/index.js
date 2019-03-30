class Router {
  constructor() {
    this.routes = new Map();
    window.addEventListener('hashchange', () => this.replaceRoute(`/${location.hash}`));
    setTimeout(() => {
      const hash = `/${location.hash}`;
      const path = this.routes.has(hash) ? hash : '/#/';
      this.replaceRoute(path);
    }, 100);
  }

  register(path, component) {
    this.routes.set(path, component);
  }

  _activateRoute(path) {
    const outgoingPath = this.routes.has(path) ? path : '';
    this.routes.forEach((component, routeName) => routeName === outgoingPath ?
      component.activateRoute() : component.deactivateRoute());
    return outgoingPath;
  }

  pushRoute(path) {
    const outgoingPath = this._activateRoute(path);
    history.pushState({}, '', outgoingPath);
  }

  replaceRoute(path) {
    const outgoingPath = this._activateRoute(path);
    history.replaceState({}, '', outgoingPath);
  }
}

export default new Router();
