export function registerFontEditor() {
  CONFIG.fontDefinitions['Crimson Text'] = {
    editor: true,
    fonts: [
      { urls: [getFontPath('CrimsonText-Regular.ttf')] },
      { urls: [getFontPath('CrimsonText-Bold.ttf')], weight: 700 },
      { urls: [getFontPath('CrimsonText-Italic.ttf')], style: 'italic' },
      { urls: [getFontPath('CrimsonText-BoldItalic.ttf')], style: 'italic', weight: 700 },
    ],
  };
  CONFIG.fontDefinitions.Teko = {
    editor: true,
    fonts: [
      { urls: [getFontPath('Teko-VariableFont_wght.ttf')] },
    ],
  };
  CONFIG.fontDefinitions.Quantico = {
    editor: true,
    fonts: [
      { urls: [getFontPath('Quantico-Regular.ttf')] },
      { urls: [getFontPath('Quantico-Bold.ttf')], weight: 700 },
      { urls: [getFontPath('Quantico-Italic.ttf')], style: 'italic' },
      { urls: [getFontPath('Quantico-BoldItalic.ttf')], style: 'italic', weight: 700 },
    ],
  };
  CONFIG.fontDefinitions.AllertaStencil = {
    editor: true,
    fonts: [
      { urls: [getFontPath('AllertaStencil-Regular.ttf')] },
    ],
  };
  CONFIG.fontDefinitions.Caveat = {
    editor: true,
    fonts: [
      { urls: [getFontPath('Caveat-Medium.ttf')] },
    ],
  };
}

function getFontPath(fontName) {
  return `systems/blade-runner/fonts/${fontName}`;
}