import { SYSTEM_ID } from '@system/constants';
import BladeRunnerDialog from './dialog';

export default class BladeRunnerActionChooserDialog extends BladeRunnerDialog {
  constructor(data, options) {
    if (!data.buttons) data.buttons = {};
    super(data, options);
    this.actions = data.actions;
    this.value = null;
  }

  get template() {
    const sysId = game.system.id || SYSTEM_ID;
    return `systems/${sysId}/templates/components/dialog/action-chooser-dialog.hbs`;
  }

  /** @override */
  getData() {
    const data = super.getData();
    data.actions = this.actions;
    return data;
  }

  /** @override */
  activateListener(html) {
    super.activateListeners(html);

    html.find('.choose-action').click(event => {
      const id = event.currentTarget.dataset.actionId;
      this.value = id;
    });
  }
}
