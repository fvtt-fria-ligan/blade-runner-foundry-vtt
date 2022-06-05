import { capitalize } from '@utils/string-utils.js';
import { FLBR } from './config.js';
import { SYSTEM_NAME } from './constants';

/**
 * Defines a set of template paths to pre-load.
 * Pre-loaded templates are compiled and cached for fast access when rendering.
 * @returns {Promise}
 */
function preloadHandlebarsTemplates() {
  const sysName = game.system.data.name || SYSTEM_NAME;
  const path = `systems/${sysName}/templates`;
  return loadTemplates([
    `${path}/actor/character/character-sheet.hbs`,
    `${path}/actor/character/sheet-tabs/stats-tab.hbs`,
    `${path}/actor/character/sheet-tabs/combat-tab.hbs`,
    `${path}/actor/character/sheet-tabs/inventory-tab.hbs`,
    `${path}/actor/character/sheet-tabs/bio-tab.hbs`,
    `${path}/actor/character/inventory.hbs`,
  ]);
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
    return typeof str === 'string' && str.length > 0 ? str[0].toUpperCase() + str.slice(1) : str;
  });

  Handlebars.registerHelper('toLowerCase', function (str) {
    return str.toLowerCase();
  });

  Handlebars.registerHelper('toUpperCase', function (str) {
    return str.toUpperCase();
  });

  // TODO remove
  // Handlebars.registerHelper('flps_enrich', function(content) {
  //   // Enriches content.
  //   content = TextEditor.enrichHTML(content, { documents: true });
  //   return new Handlebars.SafeString(content);
  // });

  Handlebars.registerHelper('times', function (n, content) {
    let str = '';
    for (let i = 0; i < n; i++) {
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
      `<select name="${target}" class="score-selector">
      ${selectOptions.join('\n')}
      </select>`,
    );
  });

  Handlebars.registerHelper('boxes', function (field, options) {
    const value = Number(options.hash.value);
    const min = Number(options.hash.min);
    const max = Number(options.hash.max);
    let str = `<a class="capacity-boxes" data-field="${field}" data-min="${min}" data-max="${max}">`;
    for (let i = 0; i < max; i++) {
      if (i === 10) str += '<br/>';
      if (value > i) str += `${FLBR.Icons.boxes.full}`;
      else str += `${FLBR.Icons.boxes.empty}`;
    }
    str += '</a>';
    return new Handlebars.SafeString(str);
  });

  Handlebars.registerHelper('createNewItemButton', function (type) {
    const title = game.i18n.format('FLBR.CreateNewItem', {
      type: game.i18n.localize(`ITEM.Type${capitalize(type)}`),
    });
    const str = `<a class="button item-create" data-type="${type}" title="${title}">${FLBR.Icons.buttons.plus}</a>`;
    return new Handlebars.SafeString(str);
  });
}

export function initializeHandlebars() {
  preloadHandlebarsTemplates();
  registerHandlebarsHelpers();
}
