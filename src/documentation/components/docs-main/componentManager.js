import DocsMain from './index';
import Primitives from 'common/primitives';
import DocumentModel from '../function-doc';
import FuncitonDocumentation from '../function-documentation';
import GettingStarted from '../getting-started';

const components = [
  Primitives.RouterOutlet,
  FuncitonDocumentation,
  DocumentModel,
  GettingStarted,
  DocsMain,
];

components.forEach(component => customElements.define(component.tag, component));
