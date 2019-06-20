import BaseComponent from 'common/util/base-component';
import keyShortcutManager from 'services/keyShortcut';
import parseToAst from './modules/Parser';
import astToDom from './modules/evaluator';
import style from './markup-editor.css';
import markup from './markup-editor.html';
import { join } from 'path';

const KEY_CODE_ENTER = 13;
const testScript = `
<ps-gain value="100" id="testmod">
  <ps-env-osc
    wav="sin"
    attack="0"
    sustain="0"
    release="200"
    trigger="b">
  </ps-env-osc>
</ps-gain>

<ps-dac>
  <ps-gain value="0.15">
    <ps-osc wav="sin" frequency="440"></ps-osc>
  </ps-gain>
</ps-dac>`;

export default class MarkupEditor extends BaseComponent {
  static get tag() {
    return 'markup-editor';
  }

  constructor() {
    super(style, markup, [ 'markupInput', 'hiddenOutput' ]);
  }

  connectedCallback() {
    console.log('markup-editor connected');
    this.rootNode = this.getRootNode();

    this.dom.markupInput.innerText = testScript.trim();
    this.handleInputSubmit();

    this.dom.markupInput.addEventListener('keydown', event => {
      if (keyShortcutManager.offerKeyShortcutEvent(event)) {
        event.stopPropagation();
        return;
      }
      event.stopPropagation();
      if (event.keyCode === KEY_CODE_ENTER && event.ctrlKey) {
        event.preventDefault();
        this.handleInputSubmit();
        return;
      }
    });
  }

  _getSanatizedMarkup() {
    const inputString = this.dom.markupInput.innerText.trim();
    return `<div>${inputString}</div>`;
  }

  handleInputSubmit() {
    const markupString = this._getSanatizedMarkup();
    console.log('parseToAst', markupString);
    try {
      const ast = parseToAst(markupString);
      if (ast.length > 1) {
        throw new Error('Ambiguous root node', ast);
      }
      astToDom(ast[0], this.dom.hiddenOutput, this.rootNode);
    } catch (error) {
      console.log(error);
    }
  }
}
