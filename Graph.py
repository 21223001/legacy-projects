"""グラフ理論系

重み付き：辺を通るのに必要なコスト
単一始点：スタート地点が一か所
最短経路：スタート地点から目的地まで最小コストで向かう経路
"""


# 重み付きグラフの単一始点最短経路問題
# ダイクストラ法（dijkstra）とベルマンフォード法（bellman-ford）



# ベルマンフォード法（bellman-ford）
# 全頂点間の最短路を求めます。
# ダイクストラ法と大きく異なる点は、負の重みが許容されること
# 負閉路 一部のサイクルを使用する事で無限にコストを下げる事が可能



def shortest_path(s,n,es):
    #s→iの最短距離
    # s:始点, n:頂点数, es[i]: [辺の始点,辺の終点,辺のコスト]

    #重みの初期化。ここに最短距離をメモしていく
    d = [float("inf")] * n

    #スタート地点は0
    d[s] = 0

    #最短路を計算
    for _ in range(n-1):
        # es: 辺iについて [from,to,cost]
        for p,q,r in es:
            #矢印の根が探索済、かつコストができるルートがあれば更新
            if d[p] != float("inf") and d[q] > d[p] + r:
                d[q] = d[p] + r

    #負閉路をチェック
    for _ in range(n-1):
        # e: 辺iについて [from,to,cost]
        for p,q,r in es:
            #更新される点は負閉路の影響を受けるので-infを入れる
            if d[q] > d[p] + r:
                d[q] = -float("inf")
    return d
################
#入力
n,w = map(int,input().split()) #n:頂点数　w:辺の数

es = [] #es[i]: [辺の始点,辺の終点,辺のコスト]
for _ in range(w):
    x,y,z = map(int,input().split())
    es.append([x,y,z])
    # es.append([y,x,z])

print(shortest_path(0,n,es))

'''
入力
7 12
0 1 2 
0 2 -5
0 3 5
1 2 3
1 4 1
1 5 3
2 4 6
3 2 -2
3 5 4
4 6 -5
5 4 -2
6 2 -3
'''


