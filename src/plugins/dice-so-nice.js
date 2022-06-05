export function registerDiceSoNice(dice3d) {
  dice3d.addSystem({
    id: 'blade-runner',
    name: 'Blade Runner RPG',
  }, 'preferred');

  dice3d.addColorset({
    name: 'flbr-base',
    category: 'Blade Runner RPG',
    description: 'Blade Runner Base Die',
    foreground: '#f00',
    background: '#000',
    outline: 'none',
    // edge: '#000',
    texture: 'none',
    material: 'metal',
    font: 'Consolas',
  }, 'default');
}