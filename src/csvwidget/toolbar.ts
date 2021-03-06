// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

import {
  each, zip
} from 'phosphor/lib/algorithm/iteration';

import {
  Message
} from 'phosphor/lib/core/messaging';

import {
  clearSignalData, defineSignal, ISignal
} from 'phosphor/lib/core/signaling';

import {
  Widget
} from 'phosphor/lib/ui/widget';


/**
 * The class name added to a csv toolbar widget.
 */
const CSV_TOOLBAR_CLASS = 'jp-CSVToolbar';

/**
 * The class name added to a csv toolbar's dropdown element.
 */
const CSV_TOOLBAR_DROPDOWN_CLASS = 'jp-CSVToolbar-dropdown';


/**
 * A widget for CSV widget toolbars.
 */
export
class CSVToolbar extends Widget {
  /**
   * Construct a new csv table widget.
   */
  constructor() {
    super({ node: Private.createNode() });
    this.addClass(CSV_TOOLBAR_CLASS);
  }

  /**
   * A signal emitted when the delimiter selection has changed.
   */
  readonly delimiterChanged: ISignal<this, string>;

  /**
   * The delimiter dropdown menu.
   */
  get selectNode(): HTMLSelectElement {
    return this.node.getElementsByTagName('select')[0];
  }

  /**
   * Dispose of the resources held by the toolbar.
   */
  dispose(): void {
    if (this.isDisposed) {
      return;
    }
    clearSignalData(this);
  }

  /**
   * Handle the DOM events for the widget.
   *
   * @param event - The DOM event sent to the widget.
   *
   * #### Notes
   * This method implements the DOM `EventListener` interface and is
   * called in response to events on the dock panel's node. It should
   * not be called directly by user code.
   */
  handleEvent(event: Event): void {
    switch (event.type) {
    case 'change':
      this.delimiterChanged.emit(this.selectNode.value);
      break;
    default:
      break;
    }
  }

  /**
   * Handle `after-attach` messages for the widget.
   */
  protected onAfterAttach(msg: Message): void {
    this.selectNode.addEventListener('change', this);
  }

  /**
   * Handle `before-detach` messages for the widget.
   */
  protected onBeforeDetach(msg: Message): void {
    this.selectNode.removeEventListener('change', this);
  }
}


// Define the signals for the `CSVToolbar` class.
defineSignal(CSVToolbar.prototype, 'delimiterChanged');


/**
 * A namespace for private toolbar methods.
 */
namespace Private {
  /**
   * Create the node for the delimiter switcher.
   */
  export
  function createNode(): HTMLElement {
    let div = document.createElement('div');
    let label = document.createElement('span');
    let select = document.createElement('select');
    select.className = CSV_TOOLBAR_DROPDOWN_CLASS;
    label.textContent = 'Delimiter: ';
    each(zip([',', ';', '\t'], [',', ';', '\\t']), ([delimiter, label]) => {
      let option = document.createElement('option');
      option.value = delimiter;
      option.textContent = label;
      select.appendChild(option);
    });
    div.appendChild(label);
    div.appendChild(select);
    return div;
  }
}
