
## セットアップ
npm install -g yo generator-code

yo code


## 修正方法

以下の内容を修正
C:\Users\mosuk\Documents\legacy-projects\VSCode_extention\macro-replacer\src\extension.ts


C:\Users\mosuk\Documents\legacy-projects\VSCode_extention\macro-replacer> 

```powershell
npm run compile
```

F5からデバッグ


拡張機能のVSIX(配布可能)で出力

npm install -g @vscode/vsce
vsce --version

vsce package

VSCodeから直接インストール
サイドバーより拡張機能

...（右上の「その他アクション」）→ Install from VSIX... を選択

macro-replacer-0.0.1.vsix を選択してインストール


## 上手くいかないとき
更新が反映されないのはキャッシュが残っている為
outフォルダ内は全て削除して良い

また，VSCodeを再起動したらデバッグが反映された事もあるので，注意

## log

2のreplaceと1つのdetect機能


