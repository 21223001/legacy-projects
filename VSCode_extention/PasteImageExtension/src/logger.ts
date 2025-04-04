// src/logger.ts

import * as vscode from 'vscode';
import * as moment from 'moment';

export class Logger {
    static channel: vscode.OutputChannel;

    static log(message: any): void {
        if (this.channel) {
            const time = moment().format("MM-DD HH:mm:ss");
            this.channel.appendLine(`[${time}] ${message}`);
        }
    }

    static showInformationMessage(message: string, ...items: string[]): Thenable<string | undefined> {
        this.log(message);
        return vscode.window.showInformationMessage(message, ...items);
    }

    static showErrorMessage(message: string, ...items: string[]): Thenable<string | undefined> {
        this.log(message);
        return vscode.window.showErrorMessage(message, ...items);
    }
}
