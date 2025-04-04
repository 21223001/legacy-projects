import * as vscode from 'vscode';

export class MacroViewProvider implements vscode.TreeDataProvider<MacroItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<void> = new vscode.EventEmitter<void>();
  readonly onDidChangeTreeData: vscode.Event<void> = this._onDidChangeTreeData.event;

  private macros = [
    { label: 'For_Qiita_basic', command: 'macroReplace.replace1' },
    { label: 'For_Qitta_advn', command: 'macroReplace.replace2' },
    { label: 'Detect_keywords', command: 'macroReplace.checkKeywords' },
    { label: 'Open All .cpp and .h Files', command: 'macroReplace.openCppAndHeaderFiles' }
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

