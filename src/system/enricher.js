import { ITEM_TYPES } from '@system/constants';
import { FLBR } from '@system/config';

/* ------------------------------------------ */
/*  ROLL TABLE                                */
/*   Adds a button that draws a table         */
/*   and displays the result in the chat      */
/* ------------------------------------------ */

/**
 * - $1: Table name or ID
 * - $2: Given name overriding the table's name
 * @example "[[/t My Table]]{Custom Name}"
 */
const ROLL_TABLE_PATTERN = /\[\[\/(?:t|table) (.+?)\]\](?:{(.+?)})?/gm;

function rollTableEnricher(match, _options) {
  const tableDoc = document.createElement('span');

  let table = game.tables.get(match[1]);
  if (!table) table = game.tables.getName(match[1]);
  if (!table) {
    tableDoc.innerHTML = _createBrokenLink('entity-link', match[2] ?? '[table?]');
    return tableDoc;
  };

  const title = match[2] ?? table.name;

  tableDoc.innerHTML =
`<a
  class="inline-table"
  data-id="${table.id}"
  onclick="game.tables.get('${table.id}').draw();"
  data-tooltip="Draw from table <b>${table.name}</b>"
>${FLBR.Icons.links.rolltable}${title}</a>`;

  return tableDoc;
}

/* ------------------------------------------ */
/*  DRAW TABLE                                */
/*   Draws the result of a table              */
/*   and displays it in the text              */
/* ------------------------------------------ */

/**
 * - $1: Table name or ID
 * - $2: Given name overriding the table's name
 * - $3: Predefined roll
 * @example "[[table: My Table]]{Custom Name}{2}"
 */
const DRAW_TABLE_PATTERN = /\[\[(?:t|table): (.+?)\]\](?:{(.*?)})?(?:{(.+?)})?/gm;

async function drawTableEnricher(match, options) {
  const tableDoc = document.createElement('span');

  let table = game.tables.get(match[1]);
  if (!table) table = game.tables.getName(match[1]);
  if (!table) {
    tableDoc.innerHTML = _createBrokenLink('entity-link', match[2] || '[table?]');
    return tableDoc;
  };

  const title = match[2];

  const tableDrawOptions = { displayChat: false };
  if (match[3]) tableDrawOptions.roll = Roll.create(match[3], options.rollData);

  const drawResult = await table.draw(tableDrawOptions);
  const result = drawResult.results[0];
  if (!result) {
    tableDoc.innerHTML = _createBrokenLink('entity-link', match[2] || '[result?]');
    return tableDoc;
  }

  let htmlFormat = '<a class="entity-link" '
    + `data-tooltip="${table.name}: ${drawResult.roll.formula} (${drawResult.roll.total})">`
    + `<img src="${result.img}" style="vertical-align: top; height: 1em;"/>&nbsp;`;

  if (result.type === 0) {
    htmlFormat += (title ? `${title}:&nbsp;` : '') + result.text;
  }
  else {
    const uuid = `${result.documentCollection}.${result.documentId}`;
    htmlFormat += `@UUID[${uuid}]${title ? `{${title}}` : ''}`;
  }

  htmlFormat += '</a>';

  tableDoc.innerHTML = await TextEditor.enrichHTML(htmlFormat, { rollData: options.rollData, async: true });
  return tableDoc;
}

/* ------------------------------------------ */
/*  CHOOSER                                   */
/*   Chooses a random result among            */
/*   a list of choices                        */
/* ------------------------------------------ */

/**
 * - $1: Roll formula
 * - $2: Choices, separated by "|"
 * - $3: Given name overriding the default one
 * @example "[[choose: 1d3 #Choice 1|Choice 2|Choice 3]]{Choice title}"
 */
const CHOOSER_PATTERN = /\[\[choose: (.+?) ?#(.+?)\]\](?:{(.+?)})?/gm;

async function chooserEnricher(match, options) {
  const chooseDoc = document.createElement('span');

  const roll = Roll.create(match[1], options.rollData);
  await roll.roll({ async: true });
  const choices = match[2].split('|');
  const index = Math.clamped(roll.total, 1, choices.length) - 1;
  const result = (match[3] ? `${match[3]}: ` : '') + choices[index];

  chooseDoc.innerHTML =
`<a
  class="entity-link"
  draggable="false"
  data-tooltip="${roll.formula} (${roll.total}):<ol><li>${choices.join('</li><li>')}</li></ol>"
>${FLBR.Icons.links.choice}${result}</a>`;

  return chooseDoc;
}

/* ------------------------------------------ */
/*  BLADE RUNNER WEAPON                       */
/*   Creates a HTML box that displays         */
/*   the weapon stats                         */
/* ------------------------------------------ */

/**
 * - $1: Weapon's name or ID
 * - $2: Given name overriding the default one
 */
const WEAPON_PATTERN = /@BladeRunnerWeapon\[(.+?)\](?:{(.+?)})?/gm;

async function weaponEnricher(match, _options) {
  const itemDoc = document.createElement('span');

  let item = game.items.get(match[1]);
  if (!item) item = game.items.getName(match[1]);
  if (!item && item.type !== ITEM_TYPES.WEAPON) {
    itemDoc.innerHTML = _createBrokenLink('entity-link', match[2] || '[weapon?]');
    return itemDoc;
  }

  const title = match[2] || item.name;
  const sys = item.system;

  const htmlFormat =
`<div class="flexrow">
  <div class="flbr-sector-box" style="height: initial; padding: 0;">
    <h3 style="position: absolute; left: 1em;">@UUID[Item.${item.id}]{${title}}</h3>
    <img class="nopopout" src="${item.img}" style="padding: 0 1em;"/>
    <div>${sys.description}</div>
  </div>
  <div class="flbr-table green" style="height: initial; max-width: 40%;">
    <table>
      <tbody>
        <tr><td>DAMAGE: <b>${sys.damage}</b></td></tr>
        <tr><td>CRIT DIE: D<b>${sys.crit}</b></td></tr>
        <tr><td>TYPE: <b>${game.i18n.localize(FLBR.damageTypes[sys.damageType])}</b></td></tr>
        <tr><td>MIN. RANGE: <b>${game.i18n.localize(FLBR.ranges[sys.range.min])}</b></td></tr>
        <tr><td>MAX. RANGE: <b>${game.i18n.localize(FLBR.ranges[sys.range.max])}</b></td></tr>
        <tr><td>AVAILABILITY: <b>${game.i18n.localize(FLBR.availabilities[sys.availability])}</b></td></tr>
        <tr><td>COST: <b>${sys.cost}</b></td></tr>
      </tbody>
    </table>
  </div>
</div>`;
  // itemDoc.setAttribute('style', 'flexrow');
  itemDoc.innerHTML = await TextEditor.enrichHTML(htmlFormat, { async: true });
  return itemDoc;
}

/* ------------------------------------------ */

function _createBrokenLink(type, title) {
  return `<a class="${type} broken" data-id="null">`
    // + '<i class="fa-solid fa-triangle-exclamation"></i>'
    + '<i class="fa-solid fa-pen-slash"></i>'
    + `${title}</a>`;
}

/* ------------------------------------------ */

export function enrichTextEditors() {
  CONFIG.TextEditor.enrichers.push(
    {
      pattern: ROLL_TABLE_PATTERN,
      enricher: rollTableEnricher,
    },
    {
      pattern: DRAW_TABLE_PATTERN,
      enricher: drawTableEnricher,
    },
    {
      pattern: CHOOSER_PATTERN,
      enricher: chooserEnricher,
    },
    {
      pattern: WEAPON_PATTERN,
      enricher: weaponEnricher,
    },
  );
}
