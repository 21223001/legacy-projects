import * as vscode from 'vscode';
import { MacroViewProvider } from './MacroViewProvider';


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

export function activate(context: vscode.ExtensionContext) {
  // マクロ1: for basic
  const replace1 = [
    { from: '、', to: '，' },
    { from: '。', to: '．' },
    { from: '（', to: '(' },
    { from: '）', to: ')' }
  ];

  // マクロ2: for advantage
  const replace2 = [
    { from: '　', to: ' ' }
  ];

  context.subscriptions.push(for_qiita_extension('macroReplace.replace1', replace1, 'replace1'));
  context.subscriptions.push(for_qiita_extension('macroReplace.replace2', replace2, 'replace2'));

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
  

  const viewProvider = new MacroViewProvider();
  vscode.window.registerTreeDataProvider('macroListView', viewProvider);
}
console.log("=== Run:Extensions ===");

