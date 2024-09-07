"""素数判定"""

import math

# 素数=True, Not素数 = False
def sosuu_hantei(n):
    if n < 2:
        return False
    if n == 2:
        return True
    if n % 2 == 0:
        return False
    for i in range(3, int(math.sqrt(n)) + 1, 2):
        if n % i == 0: 
            return False
    return True



"""nを素因数分解"""
"""2以上の整数n => [[素因数, 指数], ...]の2次元リスト"""

def soinbunkai(n):
    temp_list = []
    temp = n
    for i in range(2, int(- ( -n** 0.5 // 1 )) + 1):
        if temp % i == 0:
            count = 0
            while temp % i == 0:
                count += 1
                temp //= i
            temp_list.append([i, count])

    if temp != 1:
        temp_list.append([temp, 1])

    if temp_list == []:
        temp_list.append([n, 1])

    return temp_list


""" 一行づつ羅列
ans = soinbunkai(N)
for i in ans:
    #print(i)
    aa = i[0]
    bb = i[1]
    
    for n in range(bb):
        print(aa)
"""
