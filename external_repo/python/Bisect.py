import bisect

# alistはsortedである必要がある

alist = []

bisect.bisect(alist, 123)


bisect.bisect_left(alist, 123)

bisect.bisect_right(alist, 123)



bisect.insort(alist, 123)


bisect.insort_left(alist, 123)

bisect.insort_right(alist, 123)



"""ある数列に 値q が存在するかどうか"""
n = int(input())
alist = list(map(int, input().split()))
q = int(input())
qlist = [input() for i in range(q)]

import bisect


for i in qlist:
    i = int(i)
    temp = bisect.bisect(alist, i)
    lena = len(alist)
    

    if alist[temp-1] == i:
        print("Yes")
    else:
        print("No")
