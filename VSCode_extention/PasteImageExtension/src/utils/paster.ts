// src/utils/paster.ts
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as fse from 'fs-extra';
import * as moment from 'moment';
import * as upath from 'upath';
import { spawn } from 'child_process';
import { PluginError } from './pluginError';
import { Logger } from '../logger';

export class Paster {
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


    static paste(): void {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return;
    
        const fileUri = editor.document.uri;
        if (!fileUri || fileUri.scheme === 'untitled') {
            Logger.showInformationMessage('Before pasting the image, you need to save current file first.');
            return;
        }
    
        const filePath = fileUri.fsPath;
        const folderPath = path.dirname(filePath);
        const projectPath = vscode.workspace.rootPath || "";
    
        const selection = editor.selection;
        const selectText = editor.document.getText(selection);
        if (selectText && /[\\:*?<>|]/.test(selectText)) {
            Logger.showInformationMessage('Your selection is not a valid filename!');
            return;
        }
    
        // 設定の読み込み
        const getConfig = (key: string, fallback: any) =>
            vscode.workspace.getConfiguration('pasteImage')[key] ?? fallback;
    
        this.defaultNameConfig = getConfig('defaultName', "Y-MM-DD-HH-mm-ss");
        this.folderPathConfig = getConfig('path', "${currentFileDir}");
        this.basePathConfig = getConfig('basePath', "");
        this.prefixConfig = getConfig('prefix', "");
        this.suffixConfig = getConfig('suffix', "");
        this.forceUnixStyleSeparatorConfig = !!getConfig('forceUnixStyleSeparator', false);
        this.encodePathConfig = getConfig('encodePath', "");
        this.namePrefixConfig = getConfig('namePrefix', "");
        this.nameSuffixConfig = getConfig('nameSuffix', "");
        this.insertPatternConfig = getConfig('insertPattern', "${imageFilePath}");
        this.showFilePathConfirmInputBox = !!getConfig('showFilePathConfirmInputBox', false);
        this.filePathConfirmInputBoxMode = getConfig('filePathConfirmInputBoxMode', Paster.FILE_PATH_CONFIRM_INPUTBOX_MODE_ONLY_NAME);
    
        // 変数を置換
        this.defaultNameConfig = this.replacePathVariable(this.defaultNameConfig, projectPath, filePath, (x) => `[${x}]`);
        this.folderPathConfig = this.replacePathVariable(this.folderPathConfig, projectPath, filePath);
        this.basePathConfig = this.replacePathVariable(this.basePathConfig, projectPath, filePath);
        this.namePrefixConfig = this.replacePathVariable(this.namePrefixConfig, projectPath, filePath);
        this.nameSuffixConfig = this.replacePathVariable(this.nameSuffixConfig, projectPath, filePath);
        this.insertPatternConfig = this.replacePathVariable(this.insertPatternConfig, projectPath, filePath);
    
        const instance = this;
        this.getImagePath(
            filePath,
            selectText ?? "",
            this.folderPathConfig,
            this.showFilePathConfirmInputBox,
            this.filePathConfirmInputBoxMode,
            (err, imagePath) => {
                if (err) {
                    const msg = (err as Error)?.message ?? String(err);
                    Logger.showErrorMessage(msg);
                    return;
                }
    
                const existed = fs.existsSync(imagePath);
                if (existed) {
                    Logger.showInformationMessage(
                        `File ${imagePath} existed. Would you want to replace?`,
                        'Replace',
                        'Cancel'
                    ).then((choose) => {
                        if (choose !== 'Replace') return;
                        instance.saveAndPaste(editor, imagePath);
                    });
                } else {
                    instance.saveAndPaste(editor, imagePath);
                }
            }
        );
    }
    


    static saveAndPaste(editor: vscode.TextEditor, imagePath: string): void {
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
            const msg = (err instanceof PluginError)
                ? err.message
                : (err as Error)?.message ?? String(err);
            Logger.showErrorMessage(`Failed make folder. message=${msg}`);
        });
    }

    static getImagePath(
        filePath: string,
        selectText: string,
        folderPathFromConfig: string,
        showFilePathConfirmInputBox: boolean,
        filePathConfirmInputBoxMode: string,
        callback: (err: unknown, imagePath: string) => void
    ): void {
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
                    callback("Input canceled", "");
                }
            });
        } else {
            callback(null, makeImagePath(imageFileName));
        }

        function makeImagePath(fileName: string): string {
            const folderPathLocal = path.dirname(filePath);
            return path.isAbsolute(folderPathFromConfig)
                ? path.join(folderPathFromConfig, fileName)
                : path.join(folderPathLocal, folderPathFromConfig, fileName);
        }
    }

    static createImageDirWithImagePath(imagePath: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const imageDir = path.dirname(imagePath);
            fs.stat(imageDir, (err, stats) => {
                if (err === null && stats?.isDirectory()) {
                    resolve(imagePath);
                } else if ((err as NodeJS.ErrnoException)?.code === "ENOENT") {
                    fse.ensureDir(imageDir, (errEnsure: NodeJS.ErrnoException | null) => {
                        if (errEnsure) return reject(errEnsure);
                        resolve(imagePath);
                    });
                } else {
                    reject(new PluginError(`The image dest directory '${imageDir}' is a file or cannot be accessed.`));
                }
            });
        });
    }

    static saveClipboardImageToFileAndGetPath(
        imagePath: string,
        cb: (imagePath: string, imagePathFromScript: string) => void
    ): void {
        if (!imagePath) return;

        const platform = process.platform;
        const scriptPath = path.join(__dirname, `../../res/${platform === 'darwin' ? 'mac.applescript' : platform === 'linux' ? 'linux.sh' : 'pc.ps1'}`);

        const command = platform === 'win32'
            ? fs.existsSync("C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe")
                ? "C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe"
                : "powershell"
            : platform === 'darwin'
                ? 'osascript'
                : 'sh';

        const args = platform === 'win32'
            ? ['-noprofile', '-noninteractive', '-nologo', '-sta', '-executionpolicy', 'unrestricted', '-windowstyle', 'hidden', '-file', scriptPath, imagePath]
            : [scriptPath, imagePath];

        const processSpawn = spawn(command, args);

        processSpawn.on('error', (e: any) => {
            Logger.showErrorMessage(e?.message || String(e));
        });

        processSpawn.stdout.on('data', (data: Buffer) => {
            const result = data.toString().trim();
            if (result === "no xclip") {
                Logger.showInformationMessage('You need to install xclip command first.');
                return;
            }
            cb(imagePath, result);
        });
    }

    static renderFilePath(
        languageId: string,
        basePath: string,
        imageFilePath: string,
        forceUnixStyleSeparator: boolean,
        prefix: string,
        suffix: string
    ): string {
        if (basePath) imageFilePath = path.relative(basePath, imageFilePath);
        if (forceUnixStyleSeparator) imageFilePath = upath.normalize(imageFilePath);

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
                imageSyntaxPrefix = "![](";
                imageSyntaxSuffix = ")";
                break;
            case "asciidoc":
                imageSyntaxPrefix = "image::";
                imageSyntaxSuffix = "[]";
                break;
        }

        let result = this.insertPatternConfig;
        result = result.replace(this.PATH_VARIABLE_IMAGE_SYNTAX_PREFIX, imageSyntaxPrefix);
        result = result.replace(this.PATH_VARIABLE_IMAGE_SYNTAX_SUFFIX, imageSyntaxSuffix);
        result = result.replace(this.PATH_VARIABLE_IMAGE_FILE_PATH, imageFilePath);
        result = result.replace(this.PATH_VARIABLE_IMAGE_ORIGINAL_FILE_PATH, originalImagePath);
        result = result.replace(this.PATH_VARIABLE_IMAGE_FILE_NAME, fileName);
        result = result.replace(this.PATH_VARIABLE_IMAGE_FILE_NAME_WITHOUT_EXT, fileNameWithoutExt);

        return result;
    }

    static replacePathVariable(
        pathStr: string,
        projectRoot: string,
        curFilePath: string,
        postFunction: (str: string) => string = (x) => x
    ): string {
        const currentFileDir = path.dirname(curFilePath);
        const ext = path.extname(curFilePath);
        const fileName = path.basename(curFilePath);
        const fileNameWithoutExt = path.basename(curFilePath, ext);

        return pathStr
            .replace(this.PATH_VARIABLE_PROJECT_ROOT, postFunction(projectRoot))
            .replace(this.PATH_VARIABLE_CURRNET_FILE_DIR, postFunction(currentFileDir))
            .replace(this.PATH_VARIABLE_CURRNET_FILE_NAME, postFunction(fileName))
            .replace(this.PATH_VARIABLE_CURRNET_FILE_NAME_WITHOUT_EXT, postFunction(fileNameWithoutExt));
    }
}
