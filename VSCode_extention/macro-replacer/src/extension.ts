import * as vscode from 'vscode';
import * as path from 'path';


function for_qiita_extension(commandId: string, replaceList: { from: string, to: string }[], label: string) {
  return vscode.commands.registerCommand(commandId, async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage('エディタが開かれていません');
      return;
    }

    const doc = editor.document;
    const fullText = doc.getText();

    let newText = fullText;
    for (const pair of replaceList) {
      newText = newText.replace(new RegExp(pair.from, 'g'), pair.to);
    }

    const edit = new vscode.WorkspaceEdit();
    const fullRange = new vscode.Range(doc.positionAt(0), doc.positionAt(fullText.length));
    edit.replace(doc.uri, fullRange, newText);
    await vscode.workspace.applyEdit(edit);

    vscode.window.showInformationMessage(`置換（${label}）を完了しました`);
  });
}



class MacroItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly command?: vscode.Command
  ) {
    super(label, collapsibleState);
  }
}

class MacroProvider implements vscode.TreeDataProvider<MacroItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<MacroItem | undefined> = new vscode.EventEmitter<MacroItem | undefined>();
  readonly onDidChangeTreeData: vscode.Event<MacroItem | undefined> = this._onDidChangeTreeData.event;

  getTreeItem(element: MacroItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: MacroItem): Thenable<MacroItem[]> {
    if (!element) {
      return Promise.resolve([
        new MacroItem('For_Qiita', vscode.TreeItemCollapsibleState.Expanded),
        new MacroItem('For_Turgor', vscode.TreeItemCollapsibleState.Expanded)
      ]);
    }

    if (element.label === 'For_Qiita') {
      return Promise.resolve([
        new MacroItem('replace1', vscode.TreeItemCollapsibleState.None, {
          command: 'macroReplace.replace1',
          title: 'Run replace1'
        }),
        new MacroItem('replace2', vscode.TreeItemCollapsibleState.None, {
          command: 'macroReplace.replace2',
          title: 'Run replace2'
        }),
        new MacroItem('keyword detection', vscode.TreeItemCollapsibleState.None, {
          command: 'macroReplace.checkKeywords',
          title: 'Run keyword detection'
        })

      ]);
    }

    if (element.label === 'For_Turgor') {
      return Promise.resolve([
        new MacroItem('open files (.cpp .h) in sorted order', vscode.TreeItemCollapsibleState.None, {
          command: 'macroReplace.openCppAndHeaderFiles',
          title: 'Run open files (.cpp .h) in sorted order'
        })
      ]);
    }

    return Promise.resolve([]);
  }
}



export function activate(context: vscode.ExtensionContext) {
  // Ex1: for basic
  const replace1 = [
    { from: '、', to: '，' },
    { from: '。', to: '．' },
    { from: '（', to: '(' },
    { from: '）', to: ')' },
    { from: '→', to: '->' },
    { from: '←', to: '<-' },
    { from: '：', to: ':' }
  ];

  
  // Ex2:for advantage
  const replace2 = [
    { from: '　', to: ' ' }
  ];

  context.subscriptions.push(for_qiita_extension('macroReplace.replace1', replace1, 'replace1'));
  context.subscriptions.push(for_qiita_extension('macroReplace.replace2', replace2, 'replace2'));

  // Ex3:keyword detection
  context.subscriptions.push(
    vscode.commands.registerCommand('macroReplace.checkKeywords', async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showErrorMessage('エディタが開かれていません');
        return;
      }
      const doc = editor.document;
      const text = doc.getText();

      const keywords = ['In a nutshell', '予想される読み手', 'Summary', 'References'];  
      
      const notFound = keywords.filter(word => !text.includes(word));
      if (notFound.length === 0) {
        vscode.window.showInformationMessage('All detected');
      } else {
        vscode.window.showErrorMessage(`Cannnot found: ${notFound.join(', ')}`);
      }
    })
  );
  

  // Ex4: open files (.cpp .h) in sorted order
  context.subscriptions.push(
    vscode.commands.registerCommand('macroReplace.openCppAndHeaderFiles', async () => {


    // [1] .vscode/macro_config.json読み込み
    // したがって， .vscode内に記述したjsonごとに変更できる
    let specificFiles: string[] = [];
    let ignoreFiles: string[] = [];
    let configFound = false;

    if (!vscode.workspace.workspaceFolders) {
      vscode.window.showErrorMessage('Not open Workspace');
      return;
    }

    for (const folder of vscode.workspace.workspaceFolders) {
      try {
        const configUri = vscode.Uri.joinPath(folder.uri, '.vscode', 'macro_config.json');
        const configDoc = await vscode.workspace.openTextDocument(configUri);
        const config = JSON.parse(configDoc.getText());
    
        specificFiles = config.specificFiles ?? [];
        ignoreFiles = config.ignoreFiles ?? [];
        configFound = true;
        break;
      } catch (err) {
        continue;
      }
    }
    
    if (!configFound) {
      vscode.window.showErrorMessage('Cannot find macro_config.json');
      return;
    }

    // [2] 特定のファイルを開く
    const openedUris = new Set<string>();
    const notFoundFiles: string[] = [];

    for (const fileName of specificFiles) {
      const foundFiles = await vscode.workspace.findFiles(`**/${fileName}`, '**/node_modules/**');
      if (foundFiles.length > 0) {
        const doc = await vscode.workspace.openTextDocument(foundFiles[0]);
        await vscode.window.showTextDocument(doc, { preview: false, preserveFocus: true });
        openedUris.add(foundFiles[0].toString());
      } else {
        notFoundFiles.push(fileName);
      }
    }

    if (notFoundFiles.length > 0) {
      vscode.window.showErrorMessage(`Cannot found: ${notFoundFiles.join(', ')}`);
    }



    // [3] .cpp/.h をソートして開く（すでに開いたものと除外ファイルはスキップ）
    const files = await vscode.workspace.findFiles('**/*.{cpp,h}', '**/node_modules/**');

    if (files.length === 0) {
      vscode.window.showInformationMessage('No .cpp or .h files found.');
      return;
    }

    // 除外ファイル名一覧を取得（ファイル名だけで比較）
    const sortedFiles = files.sort((a, b) => {
      const nameA = a.path.split('/').pop()!;
      const nameB = b.path.split('/').pop()!;
      const baseA = nameA.replace(/\.(cpp|h)$/, '');
      const baseB = nameB.replace(/\.(cpp|h)$/, '');
      if (baseA === baseB) {
        return nameA.endsWith('.cpp') ? -1 : 1;
      }
      return nameA.localeCompare(nameB);
    });


    let openedCount = 0;
    for (const file of sortedFiles) {
      const fileName = path.basename(file.fsPath);

      if (ignoreFiles.includes(fileName)) {
        continue; 
      }

      if (openedUris.has(file.toString())) {
        continue;
      }

      const doc = await vscode.workspace.openTextDocument(file);
      await vscode.window.showTextDocument(doc, { preview: false, preserveFocus: true });
      openedCount++;

    }
  })
);



    const macroProvider = new MacroProvider();
    vscode.window.createTreeView('macroListView', {
      treeDataProvider: macroProvider
    });
  

}

console.log("=== Run:Extensions ===");

