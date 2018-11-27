import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import { PATCH_EVENT } from 'components/patch-space/modules/PatchEvent';
import PatchAudioModel from 'components/patch-space/modules/PatchAudioModel';
import PatchEventModel from 'components/patch-space/modules/PatchEventModel';
import PatchParam, { PatchParamModel } from 'components/patch-param';
import { getGraphicsStates } from 'components/graphics/graphics-root/modules/graphicsManager';
import graphicsChannel from 'services/GraphicsChannel';

const COMPONENT_NAME = 'graphics-controller';
const markup = require(`./${COMPONENT_NAME}.html`);

class GraphicsController extends BaseComponent {
  constructor() {
    super('', markup, [ 'graphicsSelector', ]);
    this.eventModel = new PatchEventModel(() => {});
    this.audioModel = new PatchAudioModel('Graphics Controller', this.eventModel, PATCH_EVENT.NONE, PATCH_EVENT.NONE);
  }

  connectedCallback() {
    this.tickParam = new PatchParam.element(new PatchParamModel({
      defaultValue: 0,
      setValue: () => graphicsChannel.tick(0),
      setValueFromMessage: message => graphicsChannel.tick(message.time.midi)
    }));
    this.shadowRoot.appendChild(this.tickParam);

    setTimeout(() => {
      this.dom.graphicsSelector.setOptions(getGraphicsStates());
    });
    graphicsChannel.sync();
  }

  handleGraphicsChange(event) {
    graphicsChannel.setMode(event.target.value);
  }
}

export default new Component(COMPONENT_NAME, GraphicsController);
