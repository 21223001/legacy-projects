
"""文字探索アルゴリズム BM method
目的の文字列の末尾が一致するかを，対象の先頭から比較をする
よって比較する必要の無い場所をskipできる．

目的の文字列が対象文字列において，先頭から何文字目に入っているかを出力
"""

# 先頭の文字のidxを0とする

def BM_method_function(original_text, comparing_text):
    interval = {}

    for i in range(len(comparing_text) - 1):
        interval[comparing_text[i]] = len(comparing_text) - i -1

    i = len(comparing_text) - 1    

    while i < len(original_text):
        check = 1    

        for j in range(len(comparing_text)):
            if original_text[i - j] != comparing_text[-1 - j]:
                check = 0
                break  

        if check == 1:   
            return i - len(comparing_text) + 1 
        
        if original_text[i] in interval:
            i = i + interval[original_text[i]]    

        else:
            i = i + len(comparing_text)   


# main

oriC = "abcdabc"
conC = "cd"

result_BMmethod = BM_method_function(oriC, conC)
print(result_BMmethod)


