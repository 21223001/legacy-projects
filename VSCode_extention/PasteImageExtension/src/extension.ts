'use strict';
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as fse from 'fs-extra';
import { spawn } from 'child_process';
import * as moment from 'moment';
import * as upath from 'upath';

// ロガークラス
class Logger {
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

// 拡張機能の初期化
export function activate(context: vscode.ExtensionContext): void {
    Logger.channel = vscode.window.createOutputChannel("PasteImage");
    context.subscriptions.push(Logger.channel);

    Logger.log('Congratulations, your extension "vscode-paste-image" is now active!');

    const disposable = vscode.commands.registerCommand('extension.pasteImage', () => {
        try {
            Paster.paste();
        } catch (e) {
            // e は unknown の可能性があるため文字列に変換
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

// メイン処理クラス
class Paster {
    static PATH_VARIABLE_CURRNET_FILE_DIR = /\$\{currentFileDir\}/g;
    static PATH_VARIABLE_PROJECT_ROOT = /\$\{projectRoot\}/g;
    static PATH_VARIABLE_CURRNET_FILE_NAME = /\$\{currentFileName\}/g;
    static PATH_VARIABLE_CURRNET_FILE_NAME_WITHOUT_EXT = /\$\{currentFileNameWithoutExt\}/g;

    static PATH_VARIABLE_IMAGE_FILE_PATH = /\$\{imageFilePath\}/g;
    static PATH_VARIABLE_IMAGE_ORIGINAL_FILE_PATH = /\$\{imageOriginalFilePath\}/g;
    static PATH_VARIABLE_IMAGE_FILE_NAME = /\$\{imageFileName\}/g;
    static PATH_VARIABLE_IMAGE_FILE_NAME_WITHOUT_EXT = /\$\{imageFileNameWithoutExt\}/g;
    static PATH_VARIABLE_IMAGE_SYNTAX_PREFIX = /\$\{imageSyntaxPrefix\}/g;
    static PATH_VARIABLE_IMAGE_SYNTAX_SUFFIX = /\$\{imageSyntaxSuffix\}/g;

    static FILE_PATH_CONFIRM_INPUTBOX_MODE_ONLY_NAME = "onlyName";
    static FILE_PATH_CONFIRM_INPUTBOX_MODE_PULL_PATH = "fullPath";

    static defaultNameConfig: string;
    static folderPathConfig: string;
    static basePathConfig: string;
    static prefixConfig: string;
    static suffixConfig: string;
    static forceUnixStyleSeparatorConfig: boolean;
    static encodePathConfig: string;
    static namePrefixConfig: string;
    static nameSuffixConfig: string;
    static insertPatternConfig: string;
    static showFilePathConfirmInputBox: boolean;
    static filePathConfirmInputBoxMode: string;

    public static paste(): void {
        // VSCode のエディタを取得
        const editor = vscode.window.activeTextEditor;
        if (!editor) return;

        const fileUri = editor.document.uri;
        if (!fileUri) return;
        if (fileUri.scheme === 'untitled') {
            Logger.showInformationMessage('Before pasting the image, you need to save current file first.');
            return;
        }

        const filePath = fileUri.fsPath;
        const folderPath = path.dirname(filePath);
        // rootPath は将来的に非推奨だが本拡張では継続利用
        const projectPath = vscode.workspace.rootPath || "";

        // 選択テキストから画像名を生成
        const selection = editor.selection;
        const selectText = editor.document.getText(selection);
        if (selectText && /[\\:*?<>|]/.test(selectText)) {
            Logger.showInformationMessage('Your selection is not a valid filename!');
            return;
        }

        // 設定の読み込み
        this.defaultNameConfig = vscode.workspace.getConfiguration('pasteImage')['defaultName'];
        if (!this.defaultNameConfig) {
            this.defaultNameConfig = "Y-MM-DD-HH-mm-ss";
        }

        this.folderPathConfig = vscode.workspace.getConfiguration('pasteImage')['path'];
        if (!this.folderPathConfig) {
            this.folderPathConfig = "${currentFileDir}";
        }
        if (this.folderPathConfig.length !== this.folderPathConfig.trim().length) {
            Logger.showErrorMessage(`The config pasteImage.path = '${this.folderPathConfig}' is invalid. please check your config.`);
            return;
        }

        this.basePathConfig = vscode.workspace.getConfiguration('pasteImage')['basePath'];
        if (!this.basePathConfig) {
            this.basePathConfig = "";
        }
        if (this.basePathConfig.length !== this.basePathConfig.trim().length) {
            Logger.showErrorMessage(`The config pasteImage.path = '${this.basePathConfig}' is invalid. please check your config.`);
            return;
        }

        this.prefixConfig = vscode.workspace.getConfiguration('pasteImage')['prefix'];
        this.suffixConfig = vscode.workspace.getConfiguration('pasteImage')['suffix'];
        this.forceUnixStyleSeparatorConfig = !!vscode.workspace.getConfiguration('pasteImage')['forceUnixStyleSeparator'];
        this.encodePathConfig = vscode.workspace.getConfiguration('pasteImage')['encodePath'];
        this.namePrefixConfig = vscode.workspace.getConfiguration('pasteImage')['namePrefix'];
        this.nameSuffixConfig = vscode.workspace.getConfiguration('pasteImage')['nameSuffix'];
        this.insertPatternConfig = vscode.workspace.getConfiguration('pasteImage')['insertPattern'];
        this.showFilePathConfirmInputBox = vscode.workspace.getConfiguration('pasteImage')['showFilePathConfirmInputBox'] || false;
        this.filePathConfirmInputBoxMode = vscode.workspace.getConfiguration('pasteImage')['filePathConfirmInputBoxMode'];

        // 変数を置き換え
        this.defaultNameConfig = this.replacePathVariable(
            this.defaultNameConfig ?? "",
            projectPath,
            filePath,
            (x) => `[${x}]`
        );
        this.folderPathConfig = this.replacePathVariable(
            this.folderPathConfig ?? "",
            projectPath,
            filePath
        );
        this.basePathConfig = this.replacePathVariable(
            this.basePathConfig ?? "",
            projectPath,
            filePath
        );
        this.namePrefixConfig = this.replacePathVariable(
            this.namePrefixConfig ?? "",
            projectPath,
            filePath
        );
        this.nameSuffixConfig = this.replacePathVariable(
            this.nameSuffixConfig ?? "",
            projectPath,
            filePath
        );
        this.insertPatternConfig = this.replacePathVariable(
            this.insertPatternConfig ?? "",
            projectPath,
            filePath
        );

        // getImagePath のコールバック内で this を使うためにインスタンス参照を保持
        const instance = this;
        this.getImagePath(
            filePath,
            selectText ?? "",
            this.folderPathConfig,
            this.showFilePathConfirmInputBox,
            this.filePathConfirmInputBoxMode,
            function (err: unknown, imagePath: string) {
                try {
                    if (err) {
                        // errがある場合はとりあえずエラーメッセージ表示
                        const eMsg = (err as Error)?.message ?? String(err);
                        Logger.showErrorMessage(eMsg);
                        return;
                    }
                    const existed = fs.existsSync(imagePath);
                    if (existed) {
                        Logger.showInformationMessage(
                            `File ${imagePath} existed.Would you want to replace?`,
                            'Replace',
                            'Cancel'
                        ).then((choose) => {
                            if (choose !== 'Replace') return;
                            instance.saveAndPaste(editor, imagePath);
                        });
                    } else {
                        instance.saveAndPaste(editor, imagePath);
                    }
                } catch (errCatch) {
                    const msg = (errCatch as Error)?.message ?? String(errCatch);
                    Logger.showErrorMessage(`fs.existsSync(${imagePath}) fail. message=${msg}`);
                    return;
                }
            }
        );
    }

    public static saveAndPaste(editor: vscode.TextEditor, imagePath: string): void {
        this.createImageDirWithImagePath(imagePath).then((imgPath) => {
            this.saveClipboardImageToFileAndGetPath(imgPath, (finalImgPath, imagePathReturnByScript) => {
                if (!imagePathReturnByScript) return;
                if (imagePathReturnByScript === 'no image') {
                    Logger.showInformationMessage('There is not an image in the clipboard.');
                    return;
                }
                const renderedPath = this.renderFilePath(
                    editor.document.languageId,
                    this.basePathConfig,
                    finalImgPath,
                    this.forceUnixStyleSeparatorConfig,
                    this.prefixConfig,
                    this.suffixConfig
                );
                editor.edit((edit) => {
                    const current = editor.selection;
                    if (current.isEmpty) {
                        edit.insert(current.start, renderedPath);
                    } else {
                        edit.replace(current, renderedPath);
                    }
                });
            });
        }).catch((err) => {
            if (err instanceof PluginError) {
                Logger.showErrorMessage(typeof err.message === 'string' ? err.message : String(err));
            } else {
                const msg = (err as Error)?.message ?? String(err);
                Logger.showErrorMessage(`Failed make folder. message=${msg}`);
            }
        });
    }

    public static getImagePath(
        filePath: string,
        selectText: string,
        folderPathFromConfig: string,
        showFilePathConfirmInputBox: boolean,
        filePathConfirmInputBoxMode: string,
        callback: (err: unknown, imagePath: string) => void
    ): void {
        // 画像ファイル名の作成
        const imageFileName = !selectText
            ? this.namePrefixConfig + moment().format(this.defaultNameConfig) + this.nameSuffixConfig + ".png"
            : this.namePrefixConfig + selectText + this.nameSuffixConfig + ".png";

        const filePathOrName = (filePathConfirmInputBoxMode === Paster.FILE_PATH_CONFIRM_INPUTBOX_MODE_PULL_PATH)
            ? makeImagePath(imageFileName)
            : imageFileName;

        if (showFilePathConfirmInputBox) {
            vscode.window.showInputBox({
                prompt: 'Please specify the filename of the image.',
                value: filePathOrName
            }).then((result) => {
                if (result) {
                    let inputResult = result;
                    if (!inputResult.endsWith('.png')) {
                        inputResult += '.png';
                    }
                    if (filePathConfirmInputBoxMode === Paster.FILE_PATH_CONFIRM_INPUTBOX_MODE_ONLY_NAME) {
                        inputResult = makeImagePath(inputResult);
                    }
                    callback(null, inputResult);
                } else {
                    // 入力がキャンセルされた場合は何もしない
                    callback("Input canceled", "");
                }
            });
        } else {
            callback(null, makeImagePath(imageFileName));
        }

        function makeImagePath(fileName: string): string {
            const folderPathLocal = path.dirname(filePath);
            let imagePathLocal = "";
            if (path.isAbsolute(folderPathFromConfig)) {
                imagePathLocal = path.join(folderPathFromConfig, fileName);
            } else {
                imagePathLocal = path.join(folderPathLocal, folderPathFromConfig, fileName);
            }
            return imagePathLocal;
        }
    }

    /**
     * ディレクトリを作成（存在しなければ）して画像パスを返す
     */
    private static createImageDirWithImagePath(imagePath: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const imageDir = path.dirname(imagePath);
            fs.stat(imageDir, (err, stats) => {
                if (err === null) {
                    if (stats && stats.isDirectory()) {
                        resolve(imagePath);
                    } else {
                        reject(new PluginError(
                            `The image dest directory '${imageDir}' is a file. Please check your 'pasteImage.path' config.`
                        ));
                    }
                } else if ((err as NodeJS.ErrnoException).code === "ENOENT") {
                    fse.ensureDir(imageDir, (errEnsure: NodeJS.ErrnoException | null) => {
                        if (errEnsure) {
                            reject(errEnsure);
                            return;
                        }
                        resolve(imagePath);
                    });
                } else {
                    reject(err);
                }
            });
        });
    }

    /**
     * クリップボードから画像を保存してファイルパスを返す
     */
    private static saveClipboardImageToFileAndGetPath(
        imagePath: string,
        cb: (imagePath: string, imagePathFromScript: string) => void
    ): void {
        if (!imagePath) return;

        const platform = process.platform;
        if (platform === 'win32') {
            // Windows
            const scriptPath = path.join(__dirname, '../../res/pc.ps1');
            let command = "C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe";
            const powershellExisted = fs.existsSync(command);
            if (!powershellExisted) {
                command = "powershell";
            }

            const powershell = spawn(command, [
                '-noprofile',
                '-noninteractive',
                '-nologo',
                '-sta',
                '-executionpolicy', 'unrestricted',
                '-windowstyle', 'hidden',
                '-file', scriptPath,
                imagePath
            ]);

            powershell.on('error', function (e: any) {
                if (e.code === "ENOENT") {
                    Logger.showErrorMessage(`The powershell command is not in you PATH environment variables. Please add it and retry.`);
                } else {
                    const msg = e?.message || String(e);
                    Logger.showErrorMessage(msg);
                }
            });

            powershell.on('exit', function () {
                // exit時の処理は特になし
            });

            powershell.stdout.on('data', function (data: Buffer) {
                cb(imagePath, data.toString().trim());
            });

        } else if (platform === 'darwin') {
            // Mac
            const scriptPath = path.join(__dirname, '../../res/mac.applescript');
            const ascript = spawn('osascript', [scriptPath, imagePath]);

            ascript.on('error', function (e: any) {
                const msg = e?.message || String(e);
                Logger.showErrorMessage(msg);
            });

            ascript.on('exit', function () {
                // 特になし
            });

            ascript.stdout.on('data', function (data: Buffer) {
                cb(imagePath, data.toString().trim());
            });

        } else {
            // Linux
            const scriptPath = path.join(__dirname, '../../res/linux.sh');
            const ascript = spawn('sh', [scriptPath, imagePath]);

            ascript.on('error', function (e: any) {
                const msg = e?.message || String(e);
                Logger.showErrorMessage(msg);
            });

            ascript.on('exit', function () {
                // 特になし
            });

            ascript.stdout.on('data', function (data: Buffer) {
                const result = data.toString().trim();
                if (result === "no xclip") {
                    Logger.showInformationMessage('You need to install xclip command first.');
                    return;
                }
                cb(imagePath, result);
            });
        }
    }

    /**
     * ファイルパスをレンダリング（Markdownなどで表示する用）
     */
    public static renderFilePath(
        languageId: string,
        basePath: string,
        imageFilePath: string,
        forceUnixStyleSeparator: boolean,
        prefix: string,
        suffix: string
    ): string {
        if (basePath) {
            imageFilePath = path.relative(basePath, imageFilePath);
        }

        if (forceUnixStyleSeparator) {
            imageFilePath = upath.normalize(imageFilePath);
        }

        const originalImagePath = imageFilePath;
        const ext = path.extname(originalImagePath);
        const fileName = path.basename(originalImagePath);
        const fileNameWithoutExt = path.basename(originalImagePath, ext);

        imageFilePath = `${prefix}${imageFilePath}${suffix}`;

        if (this.encodePathConfig === "urlEncode") {
            imageFilePath = encodeURI(imageFilePath);
        } else if (this.encodePathConfig === "urlEncodeSpace") {
            imageFilePath = imageFilePath.replace(/ /g, "%20");
        }

        let imageSyntaxPrefix = "";
        let imageSyntaxSuffix = "";
        switch (languageId) {
            case "markdown":
                imageSyntaxPrefix = `![](`;
                imageSyntaxSuffix = `)`;
                break;
            case "asciidoc":
                imageSyntaxPrefix = `image::`;
                imageSyntaxSuffix = `[]`;
                break;
            default:
                // 他の言語の場合は置き換えなし
                break;
        }

        let result = this.insertPatternConfig;
        // シンタックスを置換
        result = result.replace(this.PATH_VARIABLE_IMAGE_SYNTAX_PREFIX, imageSyntaxPrefix);
        result = result.replace(this.PATH_VARIABLE_IMAGE_SYNTAX_SUFFIX, imageSyntaxSuffix);

        // 各種パス変数を置換
        result = result.replace(this.PATH_VARIABLE_IMAGE_FILE_PATH, imageFilePath);
        result = result.replace(this.PATH_VARIABLE_IMAGE_ORIGINAL_FILE_PATH, originalImagePath);
        result = result.replace(this.PATH_VARIABLE_IMAGE_FILE_NAME, fileName);
        result = result.replace(this.PATH_VARIABLE_IMAGE_FILE_NAME_WITHOUT_EXT, fileNameWithoutExt);

        return result;
    }

    /**
     * パス変数の置換処理
     */
    public static replacePathVariable(
        pathStr: string,
        projectRoot: string,
        curFilePath: string,
        postFunction: (str: string) => string = (x) => x
    ): string {
        const currentFileDir = path.dirname(curFilePath);
        const ext = path.extname(curFilePath);
        const fileName = path.basename(curFilePath);
        const fileNameWithoutExt = path.basename(curFilePath, ext);

        let newPathStr = pathStr.replace(this.PATH_VARIABLE_PROJECT_ROOT, postFunction(projectRoot));
        newPathStr = newPathStr.replace(this.PATH_VARIABLE_CURRNET_FILE_DIR, postFunction(currentFileDir));
        newPathStr = newPathStr.replace(this.PATH_VARIABLE_CURRNET_FILE_NAME, postFunction(fileName));
        newPathStr = newPathStr.replace(this.PATH_VARIABLE_CURRNET_FILE_NAME_WITHOUT_EXT, postFunction(fileNameWithoutExt));
        return newPathStr;
    }
}

// 独自エラー
class PluginError {
    constructor(public message?: string) {
    }
}
