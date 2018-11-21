import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import { getPosNeg, clamp } from 'components/_util/math';
import { PATCH_EVENT } from 'components/patch-space/modules/PatchEvent';
import PatchAudioModel from 'components/patch-space/modules/PatchAudioModel';
import PatchEventModel from 'components/patch-space/modules/PatchEventModel';
import ParamScheduler from 'components/patch-space/modules/ParamScheduler';
import PatchParam, { PatchParamModel } from 'components/patch-param';
import { getGraphicsStates } from 'components/graphics/graphics-root/modules/graphicsManager';
import graphicsChannel from 'services/GraphicsChannel';

const COMPONENT_NAME = 'graphics-controller';
const markup = require(`./${COMPONENT_NAME}.html`);

class GraphicsController extends BaseComponent {
  constructor(options) {
    super('', markup, [ 'graphicsSelector', ]);
    this.eventModel = new PatchEventModel(this.schedule.bind(this));
    this.audioModel = new PatchAudioModel('Graphics Controller', this.eventModel, PATCH_EVENT.MESSAGE, PATCH_EVENT.NONE);
  }

  connectedCallback() {
    const tickModel = {
      defaultValue: 0,
      setValue: value => graphicsChannel.tick(0),
      setValueFromMessage: message => graphicsChannel.tick(message.time.midi)
    };
    this.tickParam = new PatchParam.element(tickModel);
    this.shadowRoot.appendChild(this.tickParam);


    setTimeout(() => {
      this.dom.graphicsSelector.setOptions(getGraphicsStates());
    });
    graphicsChannel.sync();
  }

  onGraphicsChange(value) {
    graphicsChannel.setMode(value);
  }

  schedule(message) {
    console.log('schedule message', message);
  }
}

export default new Component(COMPONENT_NAME, GraphicsController);
