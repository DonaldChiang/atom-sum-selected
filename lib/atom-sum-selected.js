'use babel';

import AtomSumSelectedView from './atom-sum-selected-view';
import { CompositeDisposable } from 'atom';

export default {

    atomSumSelectedView: null,
    modalPanel: null,
    subscriptions: null,

    activate(state) {
        this.atomSumSelectedView = new AtomSumSelectedView(state.atomSumSelectedViewState);
        this.modalPanel = atom.workspace.addModalPanel({
            item: this.atomSumSelectedView.getElement(),
            visible: false
        });

        // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
        this.subscriptions = new CompositeDisposable();

        // Register command that toggles this view
        this.subscriptions.add(atom.commands.add('atom-workspace', {
            'atom-sum-selected:toggle': () => this.toggle()
        }));
    },

    deactivate() {
        this.modalPanel.destroy();
        this.subscriptions.dispose();
        this.atomSumSelectedView.destroy();
    },

    serialize() {
        return {
            atomSumSelectedViewState: this.atomSumSelectedView.serialize()
        };
    },

    toggle() {
        let editor
        if (editor = atom.workspace.getActiveTextEditor()) {
            let selections = editor.selections
            let sum = 0
            for (let selection of selections) {
                if (!isNaN(selection.getText())) {
                    sum += parseFloat(selection.getText())
                } else {
                    atom.workspace.notificationManager.addWarning("You can only select number to sum.")
                }
            }
            atom.workspace.notificationManager.addSuccess("Sum of selected numbers: " + sum.toString())
        }
    }
};
