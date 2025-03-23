
"""一次元の場合
Purpose
ある区間に値vを可算したい
但し，for loopで各マスに値を足していくと計算量が増加する
そこで，値を加算する始点と終点の次の点に対して操作を行い，累積和で全マスの値を求める

Protocol
予め用意した長さNの配列を0で用意する
区間に加算したい v について，始点に v, 終点+1 に -v を加算する

"""

# N = 配列の長さ(idx : 0 ~ N-1)

N, Q = map(int, input().split())
alist = [list(map(int,input().split(" "))) for i in range(Q)]


imosu_data = [0] * N

def imosu_add(x, y, v):
  # l = x, r = y
  imosu_data[x] = imosu_data[x] + v
  if y+1 < N:
      imosu_data[y+1] = imosu_data[y+1] - v

  return imosu_data

# ある区間 x から y  に 値v を追加したい

v = 1

for i in alist:
    x, y = i[0], i[1]
    imosu_data = imosu_add(x,y,v)

import itertools

ac_list = list(itertools.accumulate(imosu_data))

print(max(ac_list))









# 累積和

import itertools

# 2番目から7番目まで
X = 2
Y = 7

ac_list = list(itertools.accumulate(plist))
ans =[]

 
if X == 0:
    ans = ac_list[Y]
    
else:
    ans = ac_list[Y]- ac_list[X-1]

print(ans)
