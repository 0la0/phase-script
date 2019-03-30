import BaseComponent from 'common/util/base-component';
import FunctionDocumentation from '../function-doc';
import PatternDocumentation from '../../DocModels/Pattern';
import UnitGeneratorDocumentation from '../../DocModels/UnitGenerators';
import markup from './docs-main.html';
import styles from './docs-main.css';

export default class DocsMain extends BaseComponent {
  static get tag() {
    return 'docs-main';
  }

  constructor() {
    super(styles, markup, [ 'patternContainer', 'ugenContainer' ]);
  }

  connectedCallback() {
    this.populatePatternDocumentation();
    this.populateUnitGeneratorDocumentation();
  }

  populatePatternDocumentation() {
    Object.keys(PatternDocumentation)
      .map(key => Object.assign(PatternDocumentation[key], { id: key }))
      .map(patternDocModel => new FunctionDocumentation(patternDocModel))
      .forEach(docComponent => this.dom.patternContainer.appendChild(docComponent));
  }

  populateUnitGeneratorDocumentation() {
    Object.keys(UnitGeneratorDocumentation)
      .map(key => Object.assign(UnitGeneratorDocumentation[key], { id: key }))
      .map(ugenDocModel => new FunctionDocumentation(ugenDocModel))
      .forEach(docComponent => this.dom.ugenContainer.appendChild(docComponent));
  }
}
