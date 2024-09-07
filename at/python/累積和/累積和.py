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


"""累積和　ある区間の和の，最大値"""
# N個の整数，
import itertools
ac_list = list(itertools.accumulate(alist))
ans =[]

#print(ac_list)

dab = 2 # かさなる部分

for i in range(N-dab):
    if i == 0:
        temp = ac_list[i+dab]
        ans.append(temp)
        
    else:
        temp = ac_list[i+dab] - ac_list[i-1]
        ans.append(temp)    

print(max(ans))

"""ある区間の特定の文字の個数"""
N, X, Y = map(int, input().split())
alist = input()
lenS = len(alist)

anss = []

for i in range(lenS):
    if alist[i] == "b":
        anss.append(1)
    else:
        anss.append(0)
        
import itertools

# X文字目とY文字目(0文字目はないので，-1をする)
X, Y = X-1, Y-1
 
ac_list = list(itertools.accumulate(anss))
ans =[]

if X == 0:
    ans = ac_list[Y]
    
else:
    ans = ac_list[Y]- ac_list[X-1]

print(ans)


