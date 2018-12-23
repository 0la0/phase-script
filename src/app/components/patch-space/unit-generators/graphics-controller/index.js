import BaseComponent from 'components/_util/base-component';
import Component from 'components/_util/component';
import PATCH_EVENT from 'services/PatchSpace/PatchEvent';
import PatchAudioModel from 'services/PatchSpace/PatchAudioModel';
import PatchEventModel from 'services/PatchSpace/PatchEventModel';
import PatchParam, { PatchParamModel } from 'components/patch-space/patch-param';
import { getGraphicsStates } from 'components/graphics/graphics-root/graphicsManager';
import graphicsChannel from 'services/GraphicsChannel';

const markup = '<combo-box id="graphicsSelector" change="handleGraphicsChange"></combo-box>';

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
    graphicsChannel.sync();
    requestAnimationFrame(() => {
      this.dom.graphicsSelector.setOptions(getGraphicsStates());
      // TODO: different way of getting graphics options, when we make different bundles this will be problematic
    });
  }

  handleGraphicsChange(event) {
    graphicsChannel.setMode(event.target.value);
  }
}

export default new Component('graphics-controller', GraphicsController);
