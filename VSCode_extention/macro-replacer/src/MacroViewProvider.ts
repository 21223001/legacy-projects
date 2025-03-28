import * as vscode from 'vscode';

export class MacroViewProvider implements vscode.TreeDataProvider<MacroItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<void> = new vscode.EventEmitter<void>();
  readonly onDidChangeTreeData: vscode.Event<void> = this._onDidChangeTreeData.event;

  private macros = [
    { label: '句読点変換', command: 'macroReplace.replaceText' },
    { label: '記号変換', command: 'macroReplace.replaceText' }
  ];

  getTreeItem(element: MacroItem): vscode.TreeItem {
    return element;
  }

  getChildren(): Thenable<MacroItem[]> {
    return Promise.resolve(
      this.macros.map(m => new MacroItem(m.label, m.command))
    );
  }
}

class MacroItem extends vscode.TreeItem {
  constructor(label: string, command: string) {
    super(label, vscode.TreeItemCollapsibleState.None);
    this.command = {
      command,
      title: label
    };
  }
}

