import { SYSTEM_ID } from '@system/constants';

export default class BladeRunnerDialog extends Dialog {

  static get defaultOptions() {
    const sysId = game.system.id || SYSTEM_ID;
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: [sysId, 'dialog'],
    });
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Input Focus
    html.find('input').focus(ev => ev.currentTarget.select());

    // Range Pickers
    html.find('input[type=range]').change(event => {
      event.preventDefault();
      const elem = event.currentTarget;
      const span = elem.nextElementSibling;
      span.innerHTML = elem.value;
    });
  }

  /* ------------------------------------------ */
  /*  Dialogs                                   */
  /* ------------------------------------------ */

  /**
   * Displays a dialog for choosing a number with a range slider.
   * @see {@link Dialog}
   * @param {Object}  config              Dialog configuration options
   * @param {number} [config.value=1]     Initial value
   * @param {number} [config.min=1]       Minimum allowed value
   * @param {number} [config.max]         Maximum allowed value
   * @param {string} [config.title]       Window title
   * @param {string} [config.description] Window description/message
   * @returns {Promise.<number>} The returned value
   */
  static async rangePicker({ value = 1, min = 1, max, title, description }) {
    max = max ?? value;
    const template = 'systems/blade-runner/templates/components/dialog/range-picker-dialog.hbs';
    const content = await renderTemplate(template, {
      value, min, max, description,
    });
    return this.prompt({
      title,
      content,
      label: game.i18n.localize('FLBR.OK'),
      callback: html => html[0].querySelector('form').chooser.value,
      rejectClose: false,
    });
  }

  /* ------------------------------------------ */

  /**
   * Displays a dialog with multiple choice buttons.
   * @param {[string, string][]} choices  [returned id, button label]
   * @param {string}  title     The title of the dialog
   * @param {string} [content]  Additional content
   */
  static async choose(choices, title, content) {
    const buttons = choices.reduce((btns, [id, label]) => {
      btns[id] = {
        label,
        icon: '<i class="fa-solid fa-play"></i>',
        callback: () => id,
      };
      return btns;
    }, {});

    return this.wait({
      title,
      content,
      buttons,
      default: choices[0][0],
      // close: () => Promise.resolve(),
    }, {}, {
      classes: ['blade-runner', 'dialog', 'choice-dialog'],
    });
  }
}
