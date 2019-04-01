function removeTailingSlash(str) {
  if (str.substring(str.length - 1) === '/') {
    return str.substring(0, str.length - 1);
  }
  return str;
}

class Router {
  constructor() {
    this.routes = new Map();
    this.basePath = window.location.pathname === '/' ? '' : removeTailingSlash(window.location.pathname);
    window.addEventListener('hashchange', () => this.replaceRoute(`${this.basePath}/${location.hash}`));
    setTimeout(() => {
      const initialhash = location.hash || '#/';
      const initialRoute = `${this.basePath}/${initialhash}`;
      const path = this.routes.has(initialRoute) ? initialRoute : '/#/';
      this.replaceRoute(path);
    }, 100);
  }

  register(path, component) {
    const modifiedPath = `${this.basePath}${path}`;
    this.routes.set(modifiedPath, component);
  }

  _activateRoute(path) {
    const outgoingPath = this.routes.has(path) ? path : '';
    this.routes.forEach((component, routeName) => routeName === outgoingPath ?
      component.activateRoute() : component.deactivateRoute());
    return `${outgoingPath}`;
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
