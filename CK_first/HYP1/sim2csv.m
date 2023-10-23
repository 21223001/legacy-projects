% Scope内のデータをcsvで出力する　
% これは'ret.csv'で出力される．
% 実行する際には，sim2csv(out.ScopeData)　を指示

function sim2csv(dataList)

% 時間を取得
timeArray = dataList.time;

% データが格納されている構造体
sigNameList = arrayfun(@(x) x.label, dataList.signals, 'UniformOutput', false);

% 結果を保存するセル配列
retCell = cell(size(timeArray, 1) + 1, size(sigNameList, 2) + 1);

% ヘッダーを作成
% 1列目は時間を表す文字列(好きなものでOK)
retCell{1, 1} = 'time';
% 2列目以降には取得した信号名を格納
retCell(1, 2 : end) = sigNameList;

% 1列目の2行目以降に時間データを格納
retCell(2 : end, 1) = num2cell(timeArray);

% 2列目、2行目以降にそれぞれ信号線のデータを格納
for icnt = 1 : size(sigNameList, 2)
    retCell(2 : end, icnt + 1) = num2cell(dataList.signals(icnt).values);
end

% 作成したセル配列をcsv形式で保存
fid = fopen('ret.csv', 'w');
for icnt = 1 : size(retCell, 1)
    for jcnt = 1 : size(retCell, 2)
        
        if icnt == 1 % 1行目は文字列
            formatStr = '%s';
        else % 2行目以降は数値
            formatStr = '%f';
        end
        
        if jcnt ~= size(retCell, 2) % 最終列ではない場合はコンマ区切り
            fprintf(fid, [formatStr, ','], retCell{icnt, jcnt});

        else % 最終列の場合は改行
            fprintf(fid, [formatStr, '\n'], retCell{icnt, jcnt});

        end
    end
end    
% ファイルを閉じる
fclose(fid);