import DocsMain from './index';
import Primitives from 'common/primitives';

const components = [
  Primitives.TextButton,
  Primitives.ToggleButton,
  Primitives.ComboBox,
  Primitives.SliderHorizontal,
  Primitives.RouterOutlet,
  Primitives.TextInput,
  DocsMain,
];

components.forEach(component => customElements.define(component.tag, component));
