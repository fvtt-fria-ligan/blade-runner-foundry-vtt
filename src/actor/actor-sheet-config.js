import { FLBR } from '@system/config';
import { SYSTEM_ID } from '@system/constants';
const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

/**
 * Configuration Sheet for the Actor sheet.
 */
export default class ActorSheetConfig extends HandlebarsApplicationMixin(ApplicationV2) {

  constructor(options = {}) {
    super(options);
    this.document = options.document;

    // Sets a dynamic title based on the actor's name.
    const actorName = this.document.name;
    const configTitle = game.i18n.localize('FLBR.SHEET_CONFIG.Title');
    this.options.window.title = `${actorName}: ${configTitle}`;
  }

  static DEFAULT_OPTIONS = {
    tag: 'form',
    classes: ['application', 'sheet', 'sheet-config'],
    form: {
      handler: ActorSheetConfig.myFormHandler,
      submitOnChange: false,
      closeOnSubmit: true,
    },
    window: {
      icon: 'fa-solid fa-gear',
      contentClasses: ['standard-form'],
    },
    position: {
      width: 500,
      height: 'auto',
    },
  };

  static PARTS = {
    body: {
      template: `systems/${SYSTEM_ID}/templates/actor/actor-sheet-config.hbs`,
    },
    footer: {
      template: 'templates/generic/form-footer.hbs',
    },
  };

  async _prepareContext(_options) {
    const documentName = this.document.documentName;
    const allSheetClasses = CONFIG[documentName]?.sheetClasses || {};
    const actorType = this.document.type || 'character';
    const relevantSheetClasses = allSheetClasses[actorType] || {};

    // console.log('actorType:', actorType);
    // console.log('relevantSheetClasses:', relevantSheetClasses);

    return {
      document: this.document,
      types: FLBR.characterSubtypes,
      sheetClasses: relevantSheetClasses,
      sheetClass: this.document._sheetClass,
      defaultClass: CONFIG[documentName]?.sheetClass,
      isGM: game.user.isGM,
      blankLabel: game.i18n.localize('None'),
      type: documentName,
      editable: true,
      buttons: [
        {
          type: 'submit',
          icon: 'fa-solid fa-save',
          label: 'SHEETS.Save',
        },
      ],
    };
  }

  static async myFormHandler(_event, _form, formData) {
    const updateData = foundry.utils.expandObject(formData.object);
    await this.document.update(updateData);
  }

  // async _updateObject(event, formData) {
  //   event.preventDefault();
  //   const original = this.getData();
  //   this.object.update(formData);
  //   if (
  //     formData.sheetClass !== original.sheetClass ||
  //     formData.defaultClass !== original.defaultClass
  //   ) {
  //     return super._updateObject(event, formData);
  //   }
  // }
}
