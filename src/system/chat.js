import BRRollHandler from '@components/roll/roller';

/**
 * Adds Event Listeners to the Chat log.
 * @param {JQuery} html
 */
export function addChatListeners(html) {
  html.on('click', '.roll-button', _onRollAction);
}

/* ------------------------------------------- */
/*  Roll Push                                  */
/* ------------------------------------------- */

/**
 * Triggers an action on the ChatMessage's roll.
 * @param {Event} event
 * @returns {Promise<import('@lib/yzur').YearZeroRoll|ChatMessage>}
 */
function _onRollAction(event) {
  event.preventDefault();

  // Disables the button to avoid any tricky double push.
  const button = event.currentTarget;
  button.disabled = true;

  // Gets infos and requires a push.
  const chatCard = event.currentTarget.closest('.chat-message');
  const messageId = chatCard.dataset.messageId;
  const message = game.messages.get(messageId);

  // Gets the desired action.
  const action = button.dataset.action;
  switch (action) {
    case 'push': return BRRollHandler.pushRoll(message);
    case 'cancel-push': return BRRollHandler.cancelPush(message);
    default: return null;
  }
}

/* ------------------------------------------- */
/*  Hiding Buttons                             */
/* ------------------------------------------- */

/**
 * Hides buttons of Chat messages for non-owners.
 * @param {JQuery} html
 */
export function hideChatActionButtons(html) {
  const chatCard = html.find('.yzur.chat-card');

  // Exits early if no chatCard were found.
  if (chatCard.length === 0) return;

  // Hides buttons.
  const actor = game.actors.get(chatCard.attr('data-actor-id'));
  const buttons = chatCard.find('button');
  for (const btn of buttons) {
    if (actor && !actor.isOwner) btn.style.display = 'none';
  }
}