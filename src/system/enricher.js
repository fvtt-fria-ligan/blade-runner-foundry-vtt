/* eslint-disable max-len */
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
/*  BLADE RUNNER ACTOR                        */
/*   Creates an HTML box that displays        */
/*   the actor stats                          */
/* ------------------------------------------ */

/**
 * - $1: Actor's name or ID
 * - $2: Given name overriding the default one
 */
const ACTOR_PATTERN = /@BladeRunnerActor\[(.+?)\](?:{(.+?)})?/gm;

async function actorEnricher(match, _options) {
  const actorDoc = document.createElement('div');

  let actor = game.actors.get(match[1]);
  if (!actor) actor = game.actors.getName(match[1]);
  if (!actor) {
    actorDoc.innerHTML = _createBrokenLink('entity-link', match[2] || '[actor?]');
    return actorDoc;
  }

  const title = match[2] || actor.name;
  const sys = actor.system;

  // Builds attributes.
  const attributes = [];
  for (const attr of FLBR.attributes) {
    const value = sys.attributes[attr].value;
    const text = game.i18n.localize(`FLBR.ATTRIBUTE.${attr.toUpperCase()}`)
      + ` ${FLBR.dieMap.get(+value)}`;
    attributes.push(text);
  }

  // Builds skills.
  const skills = [];
  for (const sk of FLBR.skills) {
    const value = sys.skills[sk].value;
    if (value <= 6) continue;
    const text = game.i18n.localize(`FLBR.SKILL.${sk.capitalize()}`)
      + ` ${FLBR.dieMap.get(+value)}`;
    skills.push(text);
  }

  // Builds specialties.
  const specialties = [];
  for (const item of actor.items) {
    if (item.type === ITEM_TYPES.SPECIALTY) specialties.push(`@UUID[${item.uuid}]`);
  }
  if (specialties.length === 0) specialties.push('—');

  // Builds gear.
  const gear = [];
  for (const item of actor.items) {
    if (item.isPhysical) {
      const text = (item.qty > 1 ? `${item.qty}X ` : '')
        + `@UUID[${item.uuid}]`;
      gear.push(text);
    }
  }
  if (sys.signatureItem?.name) gear.push(sys.signatureItem.name);
  if (gear.length === 0) gear.push('—');

  const htmlFormat =
`<h3>@UUID[${actor.uuid}]{${title}}</h3>
${sys.description ? `<div class="actor-description">${sys.description}</div>` : ''}
<div class="actor-stats">
  <table>
    <tbody>
      <tr>
        <td>Attributes</td>
        <td>${attributes.join('<br/>')}</td>
      </tr>
      <tr>
        <td>Health</td>
        <td>${sys.health.max}</td>
      </tr>
      <tr>
        <td>Resolve</td>
        <td>${sys.resolve.max}</td>
      </tr>
      <tr>
        <td>Skills</td>
        <td>${skills.join('<br/>')}</td>
      </tr>
      <tr>
        <td>Specialties</td>
        <td>${specialties.join('<br/>')}</td>
      </tr>
      <tr>
        <td>Gear</td>
        <td>${gear.join('<br/>')}</td>
      </tr>
    </tbody>
  </table>
</div>
<img src="${actor.img}"/>`;

  actorDoc.className = 'flbr-enriched-actor';
  // actorDoc.style.flexWrap = 'nowrap';
  actorDoc.innerHTML = await TextEditor.enrichHTML(htmlFormat, { async: true });
  return actorDoc;
}

/* ------------------------------------------ */
/*  BLADE RUNNER WEAPON                       */
/*   Creates an HTML box that displays        */
/*   the weapon stats                         */
/* ------------------------------------------ */

/**
 * - $1: Weapon's name or ID
 * - $2: Given name overriding the default one
 */
const WEAPON_PATTERN = /@BladeRunnerWeapon\[(.+?)\](?:{(.+?)})?/gm;

async function weaponEnricher(match, _options) {
  const itemDoc = document.createElement('div');

  let item = game.items.get(match[1]);
  if (!item) item = game.items.getName(match[1]);
  if (!item || item.type !== ITEM_TYPES.WEAPON) {
    itemDoc.innerHTML = _createBrokenLink('entity-link', match[2] || '[weapon?]');
    return itemDoc;
  }

  const title = match[2] || item.name;
  const sys = item.system;

  const htmlFormat =
`<div class="flbr-sector-box" style="display: flex; flex-direction: column; justify-content: space-between; height: initial; padding: 0; background-color: rgba(0,0,0,.4);">
  <h3 style="padding: .5em">@UUID[${item.uuid}]{${title}}</h3>
  <img class="nopopout" src="${item.img}" style="align-self: center; padding: 0 1em; max-height: 200px;"/>
  <div class="flbr-weapon-description">${sys.description}</div>
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
</div>`;

  itemDoc.className = 'flbr-enriched-weapon flexrow';
  itemDoc.style.flexWrap = 'nowrap';
  itemDoc.innerHTML = await TextEditor.enrichHTML(htmlFormat, { async: true });
  return itemDoc;
}

/* ------------------------------------------ */
/*  BLADE RUNNER ACTOR                        */
/*   Creates an HTML box that displays        */
/*   the actor stats                          */
/* ------------------------------------------ */

/**
 * - $1: The Page's UUID that contains the image
 * - $2: Given name overriding the default one
 */
const HANDOUT_PATTERN = /@BladeRunnerHandout\[(.+?)\](?:{(.+?)})?/gm;

async function handoutEnricher(match) {
  const divDoc = document.createElement('div');

  const page = await fromUuid(match[1]);
  if (!page || page.type !== 'image') {
    divDoc.innerHTML = _createBrokenLink('entity-link', match[2] || '[handout?]');
    return divDoc;
  }

  const title = match[2] || page.name;

  const htmlFormat =
`<h3>@UUID[${page.uuid}]{${title}}</h3>
<img src="${page.src}"/>`;

  divDoc.className = 'flbr-enriched-handout flbr-tab-box handout';
  divDoc.innerHTML = await TextEditor.enrichHTML(htmlFormat, { async: true });
  return divDoc;
}

/* ------------------------------------------ */
/*  BLADE RUNNER SYMBOL                       */
/*   Generates a Blade Runner symbol          */
/* ------------------------------------------ */

/**
 * - $1: Symbol
 * @example "[[S]] or [[F]]"
 */
const BLADERUNNER_SYMBOL_PATTERN = /\[\[([SF]+)\]\]/gm;

async function bladeRunnerSymbolEnricher(match) {
  const symbolDoc = document.createElement('span');
  symbolDoc.className = 'blade-runner-symbols';
  symbolDoc.innerHTML = match[1];
  return symbolDoc;
}

/* ------------------------------------------ */
/*  FONT AWESOME ICON                         */
/*   Generates a FontAwesome icon HTML text   */
/* ------------------------------------------ */

/**
 * - $1: Icon classes
 * @example "@FontAwesomeIcon[fas fa-cog]"
 */
const FONT_AWESOME_ICON_PATTERN = /@FontAwesomeIcon\[(.+?)\]/gm;

async function fontAwesomeIconEnricher(match) {
  const iconDoc = document.createElement('i');
  iconDoc.style.textIndent = 0; // Fix for inherited <p> indent
  iconDoc.className = match[1];
  return iconDoc;
}

/* ------------------------------------------ */
/*  INLINE ICON IMAGE                         */
/*   Generates a small inline icon            */
/*   from an image                            */
/* ------------------------------------------ */

/**
 * - $1: Path to the image
 * - $2: Tooltip text
 * @example "@IconImage[icons/svg/dice-target.svg]{Dice Target}"
 */
const INLINE_ICON_IMAGE = /@IconImage\[(.+?)\](?:{(.+?)})?/gm;

async function iconImageEnricher(match) {
  const imgDoc = document.createElement('img');
  imgDoc.setAttribute('src', match[1]);
  // imgDoc.setAttribute('width', 16);
  // imgDoc.setAttribute('height', 16);
  imgDoc.style.width = '1em';
  imgDoc.style.height = '1em';
  imgDoc.style.verticalAlign = 'middle';
  // imgDoc.style.lineHeight = 0;
  imgDoc.className = 'nopopout';

  if (match[2]) {
    imgDoc.setAttribute('data-tooltip', match[2]);
  }

  return imgDoc;
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
      pattern: ACTOR_PATTERN,
      enricher: actorEnricher,
    },
    {
      pattern: WEAPON_PATTERN,
      enricher: weaponEnricher,
    },
    {
      pattern: HANDOUT_PATTERN,
      enricher: handoutEnricher,
    },
    {
      pattern: BLADERUNNER_SYMBOL_PATTERN,
      enricher: bladeRunnerSymbolEnricher,
    },
    {
      pattern: FONT_AWESOME_ICON_PATTERN,
      enricher: fontAwesomeIconEnricher,
    },
    {
      pattern: INLINE_ICON_IMAGE,
      enricher: iconImageEnricher,
    });
}
