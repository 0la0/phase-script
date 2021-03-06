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
addr('a').envOsc('sin', 0, 0, 400).gain(0.5).dac()`
  },
  {
    name: 'Chain patterns',
    code:
`seq(
  p("a:48 a:60 a:60 a:72"),
  p("a a a")
)
addr('a').envOsc('squ', 0, 0, 40).gain(0.5).dac()`
  },
  {
    name: 'Play samples',
    code:
`seq(
  p('k h k h')
)

addr('k').samp('kick', 0, 0, 100).dac()
addr('h').samp('hat', 0, 0, 100).dac()`
  },
  {
    name: 'Play a sin wave',
    code: 'osc(\'sin\', 440).gain(0.5).dac()'
  },
  {
    name: 'Frequency modulation',
    code:
`seq(
  p("a:220 a:440 a:220").speed(0.25)
)
let mod = osc('squ', 220, 0x77).gain(300, 0x99)
osc('sin', addr('a'), mod).gain(0.1).dac()`
  },
  {
    name: 'More modulation',
    code:
`seq(
  p("a:4 a:22 a:22 a:4").speed(4)
)
let mod = osc('squ', addr('a'), 0x77).gain(400, 0x99)
osc('sin', 110, mod, 0x1).gain(0.1, 0x3).dac()`
  },
];

function getCopyButton(textToCopy, copyAck) {
  const button = document.createElement('button');
  button.classList.add('copy-button');
  button.textContent = 'Copy to Clipboard';
  button.onclick = (event) => {
    event.preventDefault();
    navigator.clipboard.writeText(textToCopy)
      .then(() => new Promise(resolve => {
        copyAck.classList.add('copy-ack-active');
        setTimeout(resolve, 2500);
      }))
      .then(() => copyAck.classList.remove('copy-ack-active'))
      .catch(error => console.log(error)); // eslint-disable-line no-console
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
        const copyAck = document.createElement('div');
        const copyToClipboard = getCopyButton(example.code, copyAck);
        section.classList.add('content-block');
        title.classList.add('sub-title');
        title.textContent = example.name;
        codeExample.classList.add('code-example');
        codeExample.textContent = example.code;
        copyAck.classList.add('copy-ack');
        copyAck.textContent = 'Copied to clipboard';
        section.appendChild(title);
        section.appendChild(codeExample);
        section.appendChild(copyToClipboard);
        section.appendChild(copyAck);
        return section;
      })
      .forEach(section => this.dom.exampleContainer.appendChild(section));
  }
}
