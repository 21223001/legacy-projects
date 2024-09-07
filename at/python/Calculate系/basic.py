import math

# 最大公約数 2つ以上の数字で可能
math.gcd(a, b, c)

# 自作(listで格納可能)
import math
pp = len(alist)
a1= int(alist[0])
for i in range(pp-1):
    a2 = int(alist[i+1])
    a1 = math.gcd(a1,a2)

print(a1)   


# 最小公倍数 2つ以上の数字で可能

import math
# 自作(listで格納可能)
import math
pp = len(alist)
a1= int(alist[0])
for i in range(pp-1):
    a2 = int(alist[i+1])
    a1 = a1 * a2 / math.gcd(a1, a2)
    a1 = int(a1)

print(int(a1))   












