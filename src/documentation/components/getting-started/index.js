import BaseComponent from 'common/util/base-component';
import markup from './getting-started.html';
import styles from './getting-started.css';

const examples = [
  {
    name: 'Make a sound',
    code:
`seq(
  p("a:48 a:60 a:60 a:72")
)
addr('a').envSin(0, 0, 400).gain(0.5).dac()`
  }
];

function getCopyButton(textToCopy) {
  const button = document.createElement('button');
  button.classList.add('copy-button');
  button.textContent = 'Copy to Clipboard';
  button.onclick = (event) => {
    event.preventDefault();
    navigator.clipboard.writeText(textToCopy)
      .then(() => console.log('TODO: pop toast'))
      .catch(error => console.log(error));
  };
  return button;
}

export default class DocsMain extends BaseComponent {
  static get tag() {
    return 'getting-started';
  }

  constructor() {
    super(styles, markup, [ 'exampleContainer' ]);
  }

  connectedCallback() {
    examples
      .map((example) => {
        const section = document.createElement('section');
        const title = document.createElement('h2');
        const codeExample = document.createElement('code');
        const copyToClipboard = getCopyButton(example.code);
        section.classList.add('content-block');
        title.classList.add('sub-title');
        title.textContent = example.name;
        codeExample.classList.add('code-example');
        codeExample.textContent = example.code;
        section.appendChild(title);
        section.appendChild(codeExample);
        section.appendChild(copyToClipboard);
        return section;
      })
      .forEach(section => this.dom.exampleContainer.appendChild(section));
  }
}
