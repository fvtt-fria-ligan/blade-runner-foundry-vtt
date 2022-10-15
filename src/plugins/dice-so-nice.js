export function registerDiceSoNice(dice3d) {
  dice3d.addSystem({
    id: 'blade-runner',
    name: 'Blade Runner RPG',
  }, 'preferred');

  dice3d.addColorset({
    name: 'blade-runner-base-die',
    category: 'Blade Runner RPG',
    description: 'Blade Runner Base Die',
    foreground: '#fff',
    background: '#C53426',
    outline: 'none',
    // edge: '#000',
    texture: 'none',
    material: 'metal',
    font: 'IdentikalSans, Consolas, sans-Serif',
  }, 'default');

  dice3d.addDicePreset({
    type: 'd6',
    labels: [
      'systems/blade-runner/assets/dice/d6/br_d6_1.webp',
      '2',
      '3',
      '4',
      '5',
      'systems/blade-runner/assets/dice/d6/br_d6_6.webp',
    ],
    // eslint-disable-next-line no-sparse-arrays
    bumpMaps: [
      'systems/blade-runner/assets/dice/d6/br_d6_1.webp',,,,,
      'systems/blade-runner/assets/dice/d6/br_d6_6.webp',
    ],
    system: 'blade-runner',
    colorset: 'blade-runner-base-die',
  }, 'd6');

  dice3d.addDicePreset({
    type: 'd8',
    labels: [
      'systems/blade-runner/assets/dice/d8/br_d8_1.webp',
      '2',
      '3',
      '4',
      '5',
      'systems/blade-runner/assets/dice/d8/br_d8_6.webp',
      'systems/blade-runner/assets/dice/d8/br_d8_7.webp',
      'systems/blade-runner/assets/dice/d8/br_d8_8.webp',
    ],
    // eslint-disable-next-line no-sparse-arrays
    bumpMaps: [
      'systems/blade-runner/assets/dice/d8/br_d8_1_bump.webp',,,,,
      'systems/blade-runner/assets/dice/d8/br_d8_6_bump.webp',
      'systems/blade-runner/assets/dice/d8/br_d8_7_bump.webp',
      'systems/blade-runner/assets/dice/d8/br_d8_8_bump.webp',
    ],
    system: 'blade-runner',
    colorset: 'blade-runner-base-die',
  }, 'd8');

  dice3d.addDicePreset({
    type: 'd10',
    labels: [
      'systems/blade-runner/assets/dice/d10/br_d10_1.webp',
      '2',
      '3',
      '4',
      '5',
      'systems/blade-runner/assets/dice/d10/br_d10_6.webp',
      'systems/blade-runner/assets/dice/d10/br_d10_7.webp',
      'systems/blade-runner/assets/dice/d10/br_d10_8.webp',
      'systems/blade-runner/assets/dice/d10/br_d10_9.webp',
      'systems/blade-runner/assets/dice/d10/br_d10_10.webp',
    ],
    // eslint-disable-next-line no-sparse-arrays
    bumpMaps: [
      'systems/blade-runner/assets/dice/d10/br_d10_1_bump.webp',,,,,
      'systems/blade-runner/assets/dice/d10/br_d10_6_bump.webp',
      'systems/blade-runner/assets/dice/d10/br_d10_7_bump.webp',
      'systems/blade-runner/assets/dice/d10/br_d10_8_bump.webp',
      'systems/blade-runner/assets/dice/d10/br_d10_9_bump.webp',
      'systems/blade-runner/assets/dice/d10/br_d10_10_bump.webp',
    ],
    system: 'blade-runner',
    colorset: 'blade-runner-base-die',
  }, 'd10');

  dice3d.addDicePreset({
    type: 'd12',
    labels: [
      'systems/blade-runner/assets/dice/d12/br_d12_1.webp',
      '2',
      '3',
      '4',
      '5',
      'systems/blade-runner/assets/dice/d12/br_d12_6.webp',
      'systems/blade-runner/assets/dice/d12/br_d12_7.webp',
      'systems/blade-runner/assets/dice/d12/br_d12_8.webp',
      'systems/blade-runner/assets/dice/d12/br_d12_9.webp',
      'systems/blade-runner/assets/dice/d12/br_d12_10.webp',
      'systems/blade-runner/assets/dice/d12/br_d12_11.webp',
      'systems/blade-runner/assets/dice/d12/br_d12_12.webp',
    ],
    // eslint-disable-next-line no-sparse-arrays
    bumpMaps: [
      'systems/blade-runner/assets/dice/d12/br_d12_1_bump.webp',,,,,
      'systems/blade-runner/assets/dice/d12/br_d12_6_bump.webp',
      'systems/blade-runner/assets/dice/d12/br_d12_7_bump.webp',
      'systems/blade-runner/assets/dice/d12/br_d12_8_bump.webp',
      'systems/blade-runner/assets/dice/d12/br_d12_9_bump.webp',
      'systems/blade-runner/assets/dice/d12/br_d12_10_bump.webp',
      'systems/blade-runner/assets/dice/d12/br_d12_11_bump.webp',
      'systems/blade-runner/assets/dice/d12/br_d12_12_bump.webp',
    ],
    system: 'blade-runner',
    colorset: 'blade-runner-base-die',
  }, 'd12');
}
