import BaseComponent from 'common/util/base-component';
import FunctionDocumentation from '../function-doc';
import PatternDocumentation from '../../DocModels/Pattern';
import UnitGeneratorDocumentation from '../../DocModels/UnitGenerators';
import markup from './function-documentation.html';
import styles from './function-documentation.css';

function alphabeticalComparator(a, b) {
  if(a < b) { return -1; }
  if(a > b) { return 1; }
  return 0;
}

export default class DocsMain extends BaseComponent {
  static get tag() {
    return 'function-documentation';
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
      .sort((a, b) => alphabeticalComparator(a.id, b.id))
      .map(patternDocModel => new FunctionDocumentation(patternDocModel))
      .forEach(docComponent => this.dom.patternContainer.appendChild(docComponent));
  }

  populateUnitGeneratorDocumentation() {
    Object.keys(UnitGeneratorDocumentation)
      .map(key => Object.assign(UnitGeneratorDocumentation[key], { id: key }))
      .sort((a, b) => alphabeticalComparator(a.id, b.id))
      .map(ugenDocModel => new FunctionDocumentation(ugenDocModel))
      .forEach(docComponent => this.dom.ugenContainer.appendChild(docComponent));
  }
}
