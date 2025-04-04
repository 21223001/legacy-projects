'use strict';
import * as vscode from 'vscode';
import { Logger } from './logger';
import { Paster } from './utils/paster';

// 拡張機能の初期化
export function activate(context: vscode.ExtensionContext): void {
    Logger.channel = vscode.window.createOutputChannel("PasteImage");
    context.subscriptions.push(Logger.channel);

    Logger.log('Congratulations, your extension "vscode-paste-image" is now active!');

    const disposable = vscode.commands.registerCommand('extension.pasteImage', () => {
        try {
            Paster.paste();
        } catch (e) {
            const errMsg = (e as Error)?.message ?? String(e);
            Logger.showErrorMessage(errMsg);
        }
    });

    context.subscriptions.push(disposable);
}

// 拡張機能の終了
export function deactivate(): void {
    // 特に処理なし
}
