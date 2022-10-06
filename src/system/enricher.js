import { FLBR } from '@system/config';

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
    tableDoc.innerHTML = _createBrokenLink('entity-link', match[2] ?? 'table?');
    return tableDoc;
  };

  const title = match[2] ?? table.name;

  tableDoc.innerHTML =
`<a
  class="content-link"
  draggable="true"
  data-id="null"
  data-uuid="null"
  data-tooltip="Draw from table <b>${table.name}</b>"
  onclick="game.tables.get('${table.id}').draw({ displayChat: true, async: true });"
>${FLBR.Icons.links.rolltable}${title}</a>`;

  return tableDoc;
}

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
    tableDoc.innerHTML = _createBrokenLink('entity-link', match[2] || 'table?');
    return tableDoc;
  };

  const title = match[2];

  const tableDrawOptions = { displayChat: false };
  if (match[3]) tableDrawOptions.roll = Roll.create(match[3], options.rollData);

  const drawResult = await table.draw(tableDrawOptions);
  const result = drawResult.results[0];
  if (!result) {
    tableDoc.innerHTML = _createBrokenLink('entity-link', match[2] || 'result?');
    return tableDoc;
  }

  let htmlFormat = '<a class="entity-link" draggable="false" '
    + `data-tooltip="${table.name}: ${drawResult.roll.formula} (${drawResult.roll.total})">`
    + `<img src="${result.img}" style="vertical-align: top; height: 1em;"/>&nbsp;`;

  if (result.type === 0) {
    htmlFormat += (title ? `${title}:&nbsp;` : '') + result.text;
  }
  else {
    const uuid = `${result.documentCollection}.${result.documentId}`;
    const uuidStr = `@UUID[${uuid}]${title ? `{${title}}` : ''}`;
    htmlFormat += await TextEditor.enrichHTML(
      uuidStr,
      { async: true },
    );
  }

  htmlFormat += '</a>';
  tableDoc.innerHTML = htmlFormat;

  return tableDoc;
}

/* ------------------------------------------ */

/**
 * - $1: Roll formula
 * - $2: Choices, separated by "|"
 * - $3: Given name overriding the default one
 * @example "[[choose: 1d3 #Choice 1|Choice 2|Choice 3]]{Choice title}"
 */
const CHOOSER_PATTERN = /\[\[choose: (.+?) ?#(.+?)\]\](?:{(.+?)})?/gm;

async function choiceEnricher(match, options) {
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
      enricher: choiceEnricher,
    },
  );
}
