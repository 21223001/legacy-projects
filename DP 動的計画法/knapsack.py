nmt = 3  # 荷物の数
Wmax = 15  # 許容量
weight = [9, 6, 4] # 荷物それぞれの重さの配列
value = [15, 10, 6] # 荷物それぞれの価値の配列

def knapsack_solve(nmt, Wmax, weight, value):

    # 次使用する配列に今回の結果を残すので+1している
    dp = [[0]*(Wmax+1) for i in range(nmt+1)] # DPの配列作成

    for i in range(nmt):
        for j in range(Wmax+1):
            if j < weight[i]: # この時点では許容量を超えていないので選択しない
                dp[i+1][j] = dp[i][j] # ただ選択はしていないが、今回の情報をそのままi+1の方へ移す
            else:
                dp[i+1][j] = max(dp[i][j], dp[i][j-weight[i]]+value[i])
    ans = dp[nmt][Wmax]
    return ans
  
#knapsack_solve(nmt, Wmax, weight, value)
