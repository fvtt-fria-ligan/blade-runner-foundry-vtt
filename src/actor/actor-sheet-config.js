import { FLBR } from '@system/config';
import { SYSTEM_ID } from '@system/constants';

/**
 * Configuration Sheet for the Actor sheet.
 */
export default class ActorSheetConfig extends foundry.applications.apps.DocumentSheetConfig {

  static DEFAULT_OPTIONS = {
    tag: 'form',
    form: {
      handler: ActorSheetConfig.myFormHandler,
      submitOnChange: false,
      closeOnSubmit: true,
    },
    // position: {
    //   width: 500,
    //   height: 'auto',
    // },
  };

  static PARTS = {
    character: {
      classes: ['standard-form'],
      template: `systems/${SYSTEM_ID}/templates/actor/actor-sheet-config.hbs`,
    },
    form: {
      classes: ['standard-form'],
      template: 'templates/sheets/document-sheet-config.hbs',
    },
    footer: {
      template: 'templates/generic/form-footer.hbs',
    },
  };

  get title() {
    return `${this.document.name} - ${super.title}`;
  }

  async _preparePartContext(partId, context, options) {
    const data = await super._preparePartContext(partId, context, options);
    if (partId === 'character') {
      data.types = FLBR.characterSubtypes;
      data.isGM = game.user.isGM;
    }
    return data;
  }

  static async myFormHandler(_event, _form, formData) {
    // ----- Applies our character changes.
    const updateData = foundry.utils.expandObject(formData.object);
    await this.document.update(updateData);

    // ----- Applies theme changes (copy-pasted from the Foundry's code because their f*cking method is private!!)
    const { object } = formData;
    const { documentName, type = CONST.BASE_DOCUMENT_TYPE } = this.document;

    // Update themes.
    const themes = game.settings.get('core', 'sheetThemes');
    const defaultTheme = foundry.utils.getProperty(themes, `defaults.${documentName}.${type}`);
    const documentTheme = themes.documents?.[this.document.uuid];
    const themeChanged = (object.defaultTheme !== defaultTheme) || (object.theme !== documentTheme);
    if (themeChanged) {
      foundry.utils.setProperty(themes, `defaults.${documentName}.${type}`, object.defaultTheme);
      themes.documents ??= {};
      themes.documents[this.document.uuid] = object.theme;
      await game.settings.set('core', 'sheetThemes', themes);
    }

    // Update sheets.
    const { defaultClass } = this.constructor.getSheetClassesForSubType(documentName, type);
    const sheetClass = this.document.getFlag('core', 'sheetClass') ?? '';
    const defaultSheetChanged = object.defaultClass !== defaultClass;
    const documentSheetChanged = object.sheetClass !== sheetClass;

    if (themeChanged || (game.user.isGM && defaultSheetChanged)) {
      if (game.user.isGM && defaultSheetChanged) {
        const setting = game.settings.get('core', 'sheetClasses');
        foundry.utils.setProperty(setting, `${documentName}.${type}`, object.defaultClass);
        await game.settings.set('core', 'sheetClasses', setting);
      }

      // Trigger a sheet change manually if it wouldn't be triggered by the normal ClientDocument#_onUpdate workflow.
      if (!documentSheetChanged) return this.document._onSheetChange({ sheetOpen: true });
    }

    // Update the document-specific override.
    if (documentSheetChanged) return this.document.setFlag('core', 'sheetClass', object.sheetClass);
  }
}
