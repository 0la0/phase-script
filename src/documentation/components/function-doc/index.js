import BaseComponent from 'common/util/base-component';
import style from './function-doc.css';
import markup from './function-doc.html';

export default class FunctionDocumentation extends BaseComponent {
  static get tag() {
    return 'function-doc';
  }

  constructor(document) {
    super(style, markup, [ 'fn', 'fnSignature', 'description', 'returnType', ]);
    this.document = document;
  }

  connectedCallback() {
    this.setAttribute('id', this.document.id);
    this.dom.fn.innerText = this.document.fn;
    this.dom.description.innerText = this.document.description;
    this.dom.returnType.innerText = this.document.returnType;
    this.dom.returnType.setAttribute('href', `#${this.document.returnType}`);
    this.populateSignature();
  }

  populateSignature() {
    this.document.params
      .map((param, index) => {
        const comma = index >= (this.document.params.length - 1) ? '' : ', ';
        const type = param.type ? `: ${param.type}` : '';
        const text = `${param.name}${type}${comma}`;
        const spanEle = document.createElement('span');
        spanEle.classList.add('param');
        spanEle.innerText = text;
        if (param.enum) {
          const enumText = `[${param.enum.join(', ')}]`;
          spanEle.innerText = `${text} ${enumText}`;
        }
        return spanEle;
      })
      .forEach(span => this.dom.fnSignature.appendChild(span));
  }
}
