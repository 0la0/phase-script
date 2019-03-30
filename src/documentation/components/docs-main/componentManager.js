import DocsMain from './index';
// import Primitives from 'common/primitives';
import DocumentModel from '../function-doc';

const components = [
  // Primitives.TextButton,
  // Primitives.ToggleButton,
  // Primitives.ComboBox,
  // Primitives.SliderHorizontal,
  // Primitives.RouterOutlet,
  // Primitives.TextInput,
  DocumentModel,
  DocsMain,
];

components.forEach(component => customElements.define(component.tag, component));
