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
  if (!table) return tableDoc;

  const title = match[2] ?? table.name;

  tableDoc.innerHTML =
`<a
  class="content-link"
  draggable="true"
  data-type="RollTable"
  data-uuid="RollTable.${table.id}"
  data-tooltip="Draw from table <b>${table.name}</b>"
  onclick="game.tables.get(${table.id}).draw({ displayChat: true });"
>${title}</a>`;

  return tableDoc;
}

/**
 * - $1: Table name or ID
 * - $2: Given name overriding the table's name
 * - $3: Predefined roll
 * @example "[[table: My Table]]{Custom Name}{2}"
 */
const DRAW_TABLE_PATTERN = /\[\[(?:t|table): (.+?)\]\](?:{(.+?)}){0,2}/gm;

async function drawTableEnricher(match, options) {
  const tableDoc = document.createElement('span');

  let table = game.tables.get(match[1]);
  if (!table) table = game.tables.getName(match[1]);
  if (!table) return tableDoc;

  const title = match[2];

  const tableDrawOptions = { displayChat: false };
  if (match[3]) tableDrawOptions.roll = Roll.create(match[3], options.rollData);

  const result = await table.draw(tableDrawOptions);

  console.warn(result);

  const object = result.results[0];

  tableDoc.innerHTML = (title ? `${title}: ` : '') + TextEditor.enrichHTML('@UUID', { async: true });

  return tableDoc;
}

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
  await roll.roll();
  const choices = match[2].split('|');
  const index = Math.clamped(roll.total, 1, choices.length) - 1;
  const result = (match[3] ? `${match[3]}: ` : '') + match[index];

  chooseDoc.innerHTML =
`<a
  class="content-link"
  draggable="false"
  data-type="RollTable"
  data-tooltip="(${roll.total}) →<br/>${choices.map((c, i) => `${i}. ${c}`).join('<br/>')}"
>${result}</a>`;

  return chooseDoc;
}

export function enrichTextEditors() {
  CONFIG.TextEditor.enrichers.push({
    pattern: ROLL_TABLE_PATTERN,
    enricher: rollTableEnricher,
  }, {
    pattern: DRAW_TABLE_PATTERN,
    enricher: drawTableEnricher,
  }, {
    pattern: CHOOSER_PATTERN,
    enricher: choiceEnricher,
  });
}
