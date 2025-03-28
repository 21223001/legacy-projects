import * as vscode from 'vscode';
import { MacroViewProvider } from './MacroViewProvider';


export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('macroReplace.replaceText', async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage('エディタが開かれていません');
      return;
    }

    const doc = editor.document;
    const fullText = doc.getText();

    // ここに置換ペアをベタ書き
    const replaceList = [
      { from: '、', to: '，' },
      { from: '。', to: '．' },
      { from: '（', to: '(' },
      { from: '）', to: ')' }
    ];

    let newText = fullText;
    for (const pair of replaceList) {
      newText = newText.replace(new RegExp(pair.from, 'g'), pair.to);
    }

    const edit = new vscode.WorkspaceEdit();
    const fullRange = new vscode.Range(doc.positionAt(0), doc.positionAt(fullText.length));
    edit.replace(doc.uri, fullRange, newText);
    await vscode.workspace.applyEdit(edit);

    vscode.window.showInformationMessage('置換(、。（）)完了しました');
  });

  context.subscriptions.push(disposable);


  const viewProvider = new MacroViewProvider();
  vscode.window.registerTreeDataProvider('macroListView', viewProvider);


}
