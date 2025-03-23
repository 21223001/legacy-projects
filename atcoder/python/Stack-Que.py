from collections import deque

# deque とは，Stack or Que を実装する為の一時的なlistの様な箱
# main_list と deque_object を使って作業するイメージ

# deque object
decdec = deque()
print(decdec)

# .append は 最後にappend
decdec.append("hoge")

# .appendleft は 最初にappend
decdec.appendleft("hoge")


# pop  rightside
decdec.pop()

# popleft   leftside
decdec.popleft()

declist = list(decdec)


"""Stack"""
Q = int(input())
alist = [input().split() for i in range(Q)]

Adec = deque()
for i in alist:
    if i[0] == "2":
        print(Adec.pop())
        declist = list(Adec)
        print(*declist)
    else:
        t = i[1]
        Adec.append(t)
        declist = list(Adec)
        print(*declist)



"""Que"""
Q = int(input())
alist = [input().split() for i in range(Q)]

Adec = deque()
for i in alist:
    if i[0] == "2":
        print(Adec.popleft())
        declist = list(Adec)
        print(*declist)
    else:
        t = i[1]
        Adec.append(t)
        declist = list(Adec)
        print(*declist)