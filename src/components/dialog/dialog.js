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
    const template = `systems/${SYSTEM_ID}/templates/components/dialog/range-picker-dialog.hbs`;
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
   * @param {Object} [options]  Additional options
   * @param {string} [options.content]  Additional content
   * @param {string} [options.icon]     FontAwesome icon of the buttons
   */
  static async choose(choices, title, { content, icon = 'fa-solid fa-play' } = {}) {
    if (choices.length <= 1) return choices[0][0];
    const buttons = choices.reduce((btns, [id, label]) => {
      btns[id] = {
        label,
        icon: `<i class="${icon}"></i>`,
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
      classes: [SYSTEM_ID, 'dialog', 'choice-dialog'],
    });
  }

  /* ------------------------------------------ */

  /**
   * Displays a dialog to draw from a roll table.
   * @param {RollTable[]} tables
   * @param {Object}  [options]               Additional options
   * @param {number}  [options.qty=1]           Quantity to draw
   * @param {string}  [options.title]           Dialog title
   * @param {string}  [options.formula]         Overriding formula
   * @param {string}  [options.defaultSelected] ID of the default table
   * @param {boolean} [options.disableSelection=false]
   * @param {boolean} [options.disableFormula=false]
   * @param {boolean} [options.displayChat=true] Whether to display the drawn results in chat
   * @param {string}  [options.rollMode]         Customize the roll mode used to display the drawn results
   * @returns {Promise.<{ roll: Roll, results: TableResult[]}>}
   */
  static async drawTable(tables, options = {}) {
    const template = `systems/${SYSTEM_ID}/templates/components/dialog/table-draw-dialog.hbs`;
    const content = await renderTemplate(template, {
      formula: options.formula,
      qty: options.qty || 1,
      selected: options.defaultSelected,
      disableSelection: options.disableSelection,
      disableFormula: options.disableFormula,
      hideFormula: options.disableFormula && !options.formula,
      tables,
    });

    const form = await Dialog.prompt({
      title: options.title ?? 'Draw From Table',
      label: game.i18n.localize('FLBR.OK'),
      content,
      callback: html => html[0].querySelector('form'),
      options: {
        classes: [SYSTEM_ID, 'dialog', 'table-draw-dialog'],
      },
    });

    if (!form) return;

    const table = game.tables.get(form.table.value);
    const formula = form.formula?.value || table.formula;
    const drawOptions = {
      displayChat: options.displayChat,
      rollMode: options.rollMode,
    };
    if (formula) drawOptions.roll = new Roll(formula);

    const n = Number(form.qty.value) || 1;
    if (n > 1) return table.drawMany(n, drawOptions);
    return table.draw(drawOptions);
  }
}
