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
  // Ex1: for basic
  const replace1 = [
    { from: '、', to: '，' },
    { from: '。', to: '．' },
    { from: '（', to: '(' },
    { from: '）', to: ')' }
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
      const files = await vscode.workspace.findFiles('**/*.{cpp,h}', '**/node_modules/**');

      if (files.length === 0) {
        vscode.window.showInformationMessage('No .cpp or .h files found.');
        return;
      }

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

      for (const file of sortedFiles) {
        const doc = await vscode.workspace.openTextDocument(file);
        await vscode.window.showTextDocument(doc, { preview: false, preserveFocus: true });
      }
      vscode.window.showInformationMessage(`${sortedFiles.length} files opened in sorted order.`);
    })
  );

  const viewProvider = new MacroViewProvider();
  vscode.window.registerTreeDataProvider('macroListView', viewProvider);
}

console.log("=== Run:Extensions ===");

