import { FLBR } from '@system/config';
import { SYSTEM_NAME } from '@system/constants';

/**
 * Configuration Sheet for the Actor sheet.
 * @extends {EntitySheetConfig} Foundry
 */
export default class ActorSheetConfig extends EntitySheetConfig {
  static get defaultOptions() {
    const sysName = game.system.data.name || SYSTEM_NAME;
    return foundry.utils.mergeObject(super.defaultOptions, {
      template: `systems/${sysName}/templates/actor/actor-sheet-config.hbs`,
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