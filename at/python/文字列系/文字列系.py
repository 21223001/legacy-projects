
s = 'ABCDEFG'

"""文字列はイミュータブル(更新不可)なので，新しい変数に格納するほうが安全"""

# 全ての文字を大文字に変換
a = s.upper()

# 全ての文字を小文字に変換
a = s.lower()

# 大文字を小文字に、小文字を大文字に変換
a = s.swapcase()

#文字列の反転(並び順を逆に)
a = s[::-1]


# 特定の文字を含むか　true or false
s = 'I am Sam'
print('Sam' in s)

# 集合に特定の文字が含まれているかどうか
B = str(B)
ans = 0
for i in Alist:
    i = str(i)
    #print(i)
    #print(B)
    a = B in i
    #print(a)
    if a == True:
        ans = 1

if ans == 1:
    print("Yes")
else:
    print("No")


# 文字列において，特定の文字を削除
s = 'one two one two one'
print(s.replace(' ', ''))


# 整数であるか判定(10進数字)
a = s.isdecimal()


# 文字列がASCII文字か判定 (数字やアルファベットに加え、+や-などの記号もTrueとなる。)
# 数字 + 文字 なので，上記の isdecimalと組み合わせる
a = s.isascii()


"""アルファベット系"""


# aからzまで出力
for a in range(97, 123):
    print(chr(a))

# AからZまで出力
for a in range(65, 91):
    print(chr(a))



# abc は任意の文字列
def ABC_to_number(abc):
    STR_list_porpose = []
    for i in abc:
      temp = ord(i)
      STR_list_porpose.append(temp)

      return STR_list_porpose


# n123 は 各int を分けてリストに格納しておく
# e.x. n123 = [65, 66, 67]
def number_to_ABC(n123):
    N123_list_porpose = []
    for i in n123:
        temp = chr(i)
        N123_list_porpose.append(temp)

    return N123_list_porpose
