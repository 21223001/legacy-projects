
import numpy as np



n, m = map(int, input().split())
graph = [[0]*n for _ in range(n)]
for _ in range(m):
    a, b = map(int, input().split())
    graph[a-1][b-1] = 1
    graph[b-1][a-1] = 1  # 有向グラフなら消す
print(graph)  # [[0, 1, 1, 0, 1], ..., [1, 0, 1, 1, 0]]


n, m = map(int, input().split())
graph = [[0]*n for _ in range(n)]
for _ in range(m):
    u, v, w = map(int, input().split())
    graph[u-1][v-1] = w
    graph[v-1][u-1] = w  # 有向グラフなら消す
print(graph)  # [[0, 2, 3, 0, 1], ..., [2, 0, 3, 0, 0]
