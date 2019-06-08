import BaseComponent from 'common/util/base-component';
import '../componentManager';
import GlobalListeners from 'services/EventBus/GlobalListeners';
import style from './markup-testbed.css';
import markup from './markup-testbed.html';

function templateTest() {
  const markupTemplate = document.createElement('template');
  markupTemplate.innerHTML = markup;
  return markupTemplate;
}

export default class MarkupTestbed extends BaseComponent {
  static get tag() {
    return 'markup-testbed';
  }

  constructor() {
    super(style, markup, [ 'testSlot', ]);
  }

  connectedCallback() {
    GlobalListeners.init();
    const template = templateTest('<div></div>');
    console.log('template', template);
    const clone = document.importNode(template.content, true);
    // this.dom.testSlot.appendChild(clone);
  }

  disconnectedCallback() {
    GlobalListeners.tearDown();
  }
}
