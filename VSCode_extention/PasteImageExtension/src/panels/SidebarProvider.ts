// src/panels/SidebarProvider.ts
import * as vscode from 'vscode';
import * as path from 'path';

export class SidebarProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'pasteImage.sidebar';
  private _view?: vscode.WebviewView;

  constructor(private readonly _extensionUri: vscode.Uri) {}

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [
        vscode.Uri.joinPath(this._extensionUri, 'dist'),
        vscode.Uri.joinPath(this._extensionUri, 'media'),
      ],
    };

    const scriptUri = webviewView.webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'dist', 'webview.js')
    );

    const styleUri = webviewView.webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'media', 'style.css')
    );

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview, scriptUri, styleUri);

    webviewView.webview.onDidReceiveMessage((message) => {
      switch (message.type) {
        case 'updateSettings':
          vscode.workspace.getConfiguration('pasteImage').update('customSettings', message.payload, true);
          vscode.window.showInformationMessage('PasteImage settings updated.');
          break;
      }
    });
  }

  private _getHtmlForWebview(webview: vscode.Webview, scriptUri: vscode.Uri, styleUri: vscode.Uri): string {
    const nonce = getNonce();
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="${styleUri}" rel="stylesheet">
  <title>PasteImage Sidebar</title>
</head>
<body>
  <div id="root"></div>
  <script nonce="${nonce}" src="${scriptUri}"></script>
</body>
</html>`;
  }
}

function getNonce() {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i++) {
    text
