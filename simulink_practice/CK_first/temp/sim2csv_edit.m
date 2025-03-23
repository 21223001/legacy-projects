% Scope内のデータをcsvで出力する　
% これは'ret.csv'で出力される．
% 実行する際には，sim2csv(out.ScopeData)　を指示

% for loop より，Cytを 0 から 5 まで 0.5 幅で変化させる．

for k=0:0.5:5
    Cyt = k;

    sim('CK_free');

    function sim2csv(dataList)

    timeArray = dataList.time;
    sigNameList = arrayfun(@(x) x.label, dataList.signals, 'UniformOutput', false);
    retCell = cell(size(timeArray, 1) + 1, size(sigNameList, 2) + 1);

    % ヘッダーを作成
    retCell{1, 1} = 'time';
    retCell(1, 2 : end) = sigNameList;
    retCell(2 : end, 1) = num2cell(timeArray);

    for icnt = 1 : size(sigNameList, 2)
        retCell(2 : end, icnt + 1) = num2cell(dataList.signals(icnt).values);
    end

    % cellをcsvでsave
    rootname = 'temptable'; 
    extension = '.csv'; 
    filename = [rootname, num2str(k), extension];
    fid = fopen(filename, 'w');
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

    fclose(fid);
end