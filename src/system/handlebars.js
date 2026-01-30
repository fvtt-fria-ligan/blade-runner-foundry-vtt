import { FLBR } from './config.js';

/**
 * Defines a set of template paths to pre-load.
 * Pre-loaded templates are compiled and cached for fast access when rendering.
 * @returns {Promise}
 */
function preloadHandlebarsTemplates() {
  /* Esbuild defines the template paths for us at build time. */
  // eslint-disable-next-line no-undef
  const paths = TEMPLATE_PATHS;
  console.log('Blade Runner RPG | Loading Handlebars templates:', paths);
  return foundry.applications.handlebars.loadTemplates(paths);
}

export function registerCustomItemTypesTemplates() {
  const customItemTypesTemplates = Object.values(FLBR.customItemTypesTemplates);
  return foundry.applications.handlebars.loadTemplates(customItemTypesTemplates);
}

/* ------------------------------------------ */
/*  HandlebarsJS Custom Helpers               */
/* ------------------------------------------ */

/**
 * Defines Handlebars custom Helpers and Partials.
 */
function registerHandlebarsHelpers() {
  /**
   * Replaces the default Foundry concat helper
   * because we want to return a string
   * and not a SafeString object.
   */
  Handlebars.registerHelper('concat', function () {
    let str = '';
    for (const arg in arguments) {
      if (typeof arguments[arg] !== 'object') {
        str += arguments[arg];
      }
    }
    return str;
  });

  Handlebars.registerHelper('capitalize', function (str) {
    // return typeof str === 'string' && str.length > 0 ? str[0].toUpperCase() + str.slice(1) : str;
    return str.capitalize();
  });

  Handlebars.registerHelper('toLowerCase', function (str) {
    return str.toLowerCase();
  });

  Handlebars.registerHelper('toUpperCase', function (str) {
    return str.toUpperCase();
  });

  Handlebars.registerHelper('trim', function (str, n) {
    n = +n;
    if (isNaN(n)) {
      console.warn('Handlebars Helper [trim] → maxLength Not a Number!\nDefaulting to max 100.');
      n = 100;
    }
    // return TextEditor.truncateText(str, { maxLength: n, splitWords: true });
    return foundry.applications.ux.TextEditor.previewHTML(str, n);
  });

  Handlebars.registerHelper('times', function (n, content) {
    let str = '';
    for (let i = 0; i < n; i++) {
      content.data.first = i === 0;
      content.data.last = i === n - 1;
      content.data.max = n;
      content.data.index = i + 1;
      str += content.fn(i);
    }
    return str;
  });

  Handlebars.registerHelper('mathMin', function (...args) {
    return Math.min(...args);
  });

  Handlebars.registerHelper('mathMax', function (...args) {
    return Math.max(...args);
  });

  Handlebars.registerHelper('add', function (a, b) {
    return a + b;
  });

  Handlebars.registerHelper('substract', function (a, b) {
    return a - b;
  });

  Handlebars.registerHelper('divide', function (a, b) {
    return a / b;
  });

  Handlebars.registerHelper('multiply', function (a, b) {
    return a * b;
  });

  Handlebars.registerHelper('ratio', function (a, b) {
    return (a / b) * 100;
  });

  // Handlebars.registerHelper('isPushable', function (die, result) {
  //   const lockedValues = CONFIG.YZUR.Dice.DIE_TERMS[`brD${die}`]?.LOCKED_VALUES;
  //   if (Array.isArray(lockedValues)) {
  //     result = Number(result);
  //     return !lockedValues.some(v => v === result);
  //   }
  //   return undefined;
  // });

  // Handlebars.registerHelper('enrichText', function (text) {
  //   // Enriches content.
  //   text = TextEditor.enrichHTML(text, { documents: true, async: false });
  //   return new Handlebars.SafeString(text);
  // });

  Handlebars.registerHelper('enrichDocumentName', function (text) {
    const rgx = /@UUID\[(.+?)\](?:{(.+?)})?/gm;
    if (rgx.test(text)) {
      text = text.replace(rgx, (_match, p1, p2) => {
        // eslint-disable-next-line no-undef
        const title = p2 ?? foundry.utils.fromUuidSync(p1)?.name ?? '{undefined}';
        return `<b>${title}</b>`;
      });
    }
    // ! Next line removed because Foundry dropped support for async:
    // text = TextEditor.enrichHTML(text, { documents: true, async: false });
    return new Handlebars.SafeString(text);
  });

  /**
   * Foundry's {{#select}} custom helper used here because pending removal from Foundry's code.
   * A helper to assign an `<option>` within a `<select>` block as selected based on its value.
   * Escape the string as handlebars would, then escape any regexp characters in it.
   * Parameters:
   * * `selected` - Value to be tagged as "selected"
   * * `options` - options for the helper
   */
  Handlebars.registerHelper('select', function (selected, options) {
    const escapedValue = RegExp.escape(Handlebars.escapeExpression(selected));
    const rgx = new RegExp(` value=["']${escapedValue}["']`);
    const html = options.fn(foundry.applications.handlebars);
    return html.replace(rgx, '$& selected');
  });

  /**
   * Templates for a die Score selector.
   * Parameters:
   * * `target` - The name of the affected variable.
   * * `selected` - The current selected value.
   */
  Handlebars.registerHelper('scoreSelector', function (target, options) {
    const selectOptions = [];
    const selected = Number(options.hash.selected);
    for (const [score, size] of FLBR.scoreMap) {
      const isSelected = size === selected;
      const opt = `<option value="${size}"${isSelected ? ' selected' : ''}>${score}</option>`;
      selectOptions.push(opt);
    }
    return new Handlebars.SafeString(
      `<select name="${target}" class="score-selector" data-dtype="Number">
      ${selectOptions.join('\n')}
      </select>`,
    );
  });

  Handlebars.registerHelper('boxes', function (field, options) {
    const value = Number(options.hash.value);
    const min = Number(options.hash.min);
    const max = Number(options.hash.max);
    let loss = Number(options.hash.loss);
    let str = `<a class="capacity-boxes" data-field="${field}" data-min="${min}" data-max="${max}">`;
    for (let i = 0; i < max; i++) {
      if (i === 10) str += '<br/>';
      if (value > i) str += `${FLBR.Icons.boxes.full}`;
      else str += `${FLBR.Icons.boxes.empty}`;
    }
    if (loss < 0) {
      str += '<span class="loss">';
      for (; loss < 0; loss++) {
        str += `${FLBR.Icons.boxes.lost}`;
      }
      str += '</span>';
    }
    str += '</a>';
    return new Handlebars.SafeString(str);
  });

  Handlebars.registerHelper('createNewItemButton', function (type) {
    const title = game.i18n.format('FLBR.CreateNewItem', {
      type: game.i18n.localize(`TYPES.Item.${type}`),
    });
    const str = `<a class="btn item-create" data-type="${type}" data-tooltip="${title}">${FLBR.Icons.buttons.plus}</a>`;
    return new Handlebars.SafeString(str);
  });
}

export async function initializeHandlebars() {
  await preloadHandlebarsTemplates();
  registerHandlebarsHelpers();
}
