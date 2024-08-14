a = int(input())
a = list(map(int, input().split()))

#j方向にint(N, M)あり
N, M = map(int, input().split())

# i方向に複数
a = [input() for i in range(N)]

# j方向に複数
list(map(int,input().split(" ")))

#ij 方向に複数
a = [input().split() for i in range(n)]

#ij 方向の数値を格納
a=[list(map(int,input().split(" "))) for i in range(N)]

#単なる複数行listにも可能？？？？　[[]]
IJ = [[int(a) for a in input().split()] for _ in range(N)]



# print系

#半角スペースでlistを出力  list_name の前に*を付与
print(*list)

#list内の要素をstrとして一つにして出力
S = ['a', 'b', 'c', 'd', 'e'] 
#abcde
print(''.join(S))



#小数点切り捨て
import math
math.ceil()     #数字の切り上げ
math.floor()    #数字の切り下げ









