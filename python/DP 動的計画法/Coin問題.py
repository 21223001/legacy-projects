#入力値を取得
# Coin_kind = コインの種類
# Totalfee = 支払う合計金額
# coin_list = [a円, b円, c円, ...]

# or

Totalfee, Coin_kind = map(int,input().split())
coin_list = list(map(int,input().split()))


#入力値を取得
Coin_kind = 7
Totalfee = 1499
coin_list = [2, 3, 5, 10, 15, 30, 100]


def coin_list_check_problem(Coin_kind, Totalfee, coin_list):

    # 方針：dp表を作成して埋めていく
    # dp表の初期値は全てinf(無限大)
    inf = float("inf")
    dp=[[inf for x in range(Totalfee+1)] for y in range(Coin_kind)]

    for k in range(Coin_kind):
      dp[k][0] = 0

    #(j<ci)と(それ以外)の場合に分けてdp[i][j]を埋めていく
    for i in range(Coin_kind):
      for j in range(Totalfee+1):
        if j < coin_list[i]:
           dp[i][j] = dp[i-1][j]
        else:
           dp[i][j] = min(dp[i-1][j],dp[i][j-coin_list[i]]+1)
    
    #print(dp[m-1][n])
    
    # ans_maisuu = 使用する最小枚数
    ans_maisuu = dp[Coin_kind-1][Totalfee]
    return ans_maisuu



a = coin_check_problem(Coin_kind, Totalfee, coin_list)
print(a)



"""
使えるコインの枚数(m)を行、支払う金額の値(n+1)列として
使用するコインの枚数の最小値(dp[i][j])を要素にもつ行列を作る。
(0円の支払いを加えるため→n+1)
"""