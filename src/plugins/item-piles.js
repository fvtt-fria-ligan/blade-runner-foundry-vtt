import { AVAILABILITIES, ACTOR_TYPES, ITEM_TYPES } from '@system/constants';
// import { FLBR } from '@system/config';

export default {

  'VERSION': '1.0.1',

  // The actor class type is the type of actor that will be used
  //   for the default item pile actor that is created on first item drop.
  'ACTOR_CLASS_TYPE': ACTOR_TYPES.LOOT,

  // The item class type is the type of item that will be used for the default loot item
  'ITEM_CLASS_LOOT_TYPE': ITEM_TYPES.GENERIC,

  // The item class type is the type of item that will be used for the default weapon item
  'ITEM_CLASS_WEAPON_TYPE': ITEM_TYPES.WEAPON,

  // The item class type is the type of item that will be used for the default equipment item
  'ITEM_CLASS_EQUIPMENT_TYPE': ITEM_TYPES.ARMOR,

  // The item quantity attribute is the path to the attribute on items that denote how many of that item that exists
  'ITEM_QUANTITY_ATTRIBUTE': 'system.qty',

  // The item price attribute is the path to the attribute on each item that determine how much it costs
  'ITEM_PRICE_ATTRIBUTE': 'system.cost',

  // Item filters actively remove items from the item pile inventory UI that users cannot loot,
  //   such as spells, feats, and classes
  'ITEM_FILTERS': [
    {
      path: 'type',
      filters: [ITEM_TYPES.SPECIALTY, ITEM_TYPES.CRITICAL_INJURY].join(','),
    },
  ],

  'UNSTACKABLE_ITEM_TYPES': [ITEM_TYPES.WEAPON, ITEM_TYPES.ARMOR, ITEM_TYPES.SYNTHETIC_AUGMENTATION],

  'PILE_DEFAULTS': {
    merchantColumns: [{
      label: 'FLBR.ItemAvailability',
      path: 'system.availability',
      formatting: '{#}',
      buying: true,
      selling: true,
      // mapping: FLBR.availabilities,
      mapping: {
        '5': 'FLBR.ITEM_AVAILABILITY.Incidental',
        '4': 'FLBR.ITEM_AVAILABILITY.Standard',
        '3': 'FLBR.ITEM_AVAILABILITY.Premium',
        '2': 'FLBR.ITEM_AVAILABILITY.Rare',
        '1': 'FLBR.ITEM_AVAILABILITY.Luxury',
      },
    }, {
      label: '&nbsp;',
      path: 'system.consumable',
      formatting: '{#}',
      buying: true,
      selling: true,
      mapping: {
        'true': '<i class="fa-solid fa-apple-core"></i>',
        'false': '',
      },
    }, {
      label: '<i class="fa-solid fa-shield-halved"></i>',
      path: 'system.armor',
      formatting: '{#}',
      buying: true,
      selling: true,
      mapping: {
        '0': '',
        '6': 'D',
        '8': 'C',
        '10': 'B',
        '12': 'A',
      },
    }],
  },

  // This function is an optional system handler that specifically transforms an item when it is added to actors
  'ITEM_TRANSFORMER': async itemData => {
    if (itemData?.system?.mounted) itemData.system.mounted = false;
    return itemData;
  },

  // Item similarities determines how item piles detect similarities and differences in the system
  'ITEM_SIMILARITIES': ['name', 'type'],

  // Currencies in item piles is a versatile system that can accept actor attributes
  //   (a number field on the actor's sheet) or items (actual items in their inventory)
  // In the case of attributes, the path is relative to the "actor.system"
  // In the case of items, it is recommended you export the item with `.toObject()` and strip out any module data
  'CURRENCIES': [
    {
      type: 'attribute',
      name: 'FLBR.HEADER.ChinyenPoints',
      img: 'icons/commodities/currency/coins-plain-stack-silver.webp',
      abbreviation: '{#}C¥',
      data: {
        path: 'system.metaCurrencies.chinyen',
      },
      primary: true,
      exchangeRate: 1,
    },
  ],

  'SECONDARY_CURRENCIES': [
    {
      type: 'attribute',
      name: 'FLBR.HEADER.PromotionPoints',
      img: 'icons/commodities/treasure/medal-ribbon-gold-blue.webp',
      abbreviation: '{#}<i class="fa-solid fa-award-simple"></i>',
      data: {
        path: 'system.metaCurrencies.promotion',
      },
    },
    {
      type: 'attribute',
      name: 'FLBR.HEADER.HumanityPoints',
      img: 'icons/sundries/gaming/chess-knight-white.webp',
      abbreviation: '{#}<i class="fa-solid fa-chess-knight"></i>',
      data: {
        path: 'system.metaCurrencies.humanity',
      },
    },
  ],

  'VAULT_STYLES': [
    {
      path: 'system.availability',
      value: AVAILABILITIES.LUXURY,
      styling: {
        'box-shadow': 'inset 0px 0px 7px 0px rgba(255,119,0,1)',
      },
    },
    {
      path: 'system.availability',
      value: AVAILABILITIES.RARE,
      styling: {
        'box-shadow': 'inset 0px 0px 7px 0px rgba(255,0,247,1)',
      },
    },
    {
      path: 'system.availability',
      value: AVAILABILITIES.PREMIUM,
      styling: {
        'box-shadow': 'inset 0px 0px 7px 0px rgba(0,136,255,1)',
      },
    },
  ],
};
