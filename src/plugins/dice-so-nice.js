export function registerDiceSoNice(dice3d) {
  dice3d.addSystem({
    id: 'blade-runner',
    name: 'Blade Runner RPG',
  }, 'preferred');

  dice3d.addColorset({
    name: 'flbr-base',
    category: 'Blade Runner RPG',
    description: 'Blade Runner Base Die',
    foreground: '#fff',
    background: '#C53426',
    outline: 'none',
    // edge: '#000',
    texture: 'none',
    material: 'metal',
    font: 'Consolas',
  }, 'default');

  dice3d.addDicePreset({
    type: 'd6',
    labels: [
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
    ],
    system: 'blade-runner',
    colorset: 'flbr-base',
  }, 'd6');

  dice3d.addDicePreset({
    type: 'd8',
    labels: [
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
    ],
    system: 'blade-runner',
    colorset: 'flbr-base',
  }, 'd8');

  dice3d.addDicePreset({
    type: 'd10',
    labels: [
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '10',
    ],
    system: 'blade-runner',
    colorset: 'flbr-base',
  }, 'd10');

  dice3d.addDicePreset({
    type: 'd12',
    labels: [
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '10',
      '11',
      '12',
    ],
    system: 'blade-runner',
    colorset: 'flbr-base',
  }, 'd12');
}