import { FLBR } from '@system/config';
import { SYSTEM_ID } from '@system/constants';

// TODO deprecated class
/**
 * Configuration Sheet for the Actor sheet.
 * @extends {DocumentSheetConfig} Foundry
 */
// eslint-disable-next-line no-undef
export default class ActorSheetConfig extends DocumentSheetConfig {
  static get defaultOptions() {
    const sysId = game.system.id || SYSTEM_ID;
    return foundry.utils.mergeObject(super.defaultOptions, {
      template: `systems/${sysId}/templates/actor/actor-sheet-config.hbs`,
    });
  }

  getData() {
    return {
      ...super.getData(),
      types: FLBR.characterSubtypes,
    };
  }

  async _updateObject(event, formData) {
    event.preventDefault();
    const original = this.getData();
    this.object.update(formData);
    if (
      formData.sheetClass !== original.sheetClass ||
      formData.defaultClass !== original.defaultClass
    ) {
      return super._updateObject(event, formData);
    }
  }
}
