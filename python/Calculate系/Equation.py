import math

import sympy as sp


# 漸化式の解法

import sympy as sp

# 初期値が2つ以上，{a(1):10, a(2):20} 
# leftside　は　leftside = 0 となるように式変形
# e.x. a(n) = a(n-1) + 1  -->>  a(n)-a(n-1)-1 = 0


sp.var('n')
a = sp.Function('a')
leftside = a(n)-2*a(n-1)-3
ini_v = {a(1):10}

# 一般項を求める
te = sp.rsolve(leftside, a(n), ini_v)
print(te)

# n=? で解きたい　-> .sub(n, ?) e.x. n=2
te_2 = sp.rsolve(leftside, a(n), ini_v).subs(n, 2)
print(te_2)

# n = k で解きたい
te_k = sp.rsolve(leftside, a(n), ini_v).subs(n, k)
print(te_k)








