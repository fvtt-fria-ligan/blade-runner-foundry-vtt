/**
 * Gets the Game System's Manual journal entry from the compendium.
 * @returns {JournalEntry}
 */
export async function getManual() {
  const compedium = game.packs.get('blade-runner.blade-runner-rpg-system');
  if (!compedium) return;

  const indexes = await compedium.getIndex();
  const index = indexes.contents.find(i => i.name === 'Game System\'s Manual');
  const journal = await compedium.getDocument(index._id);
  return journal;
}
