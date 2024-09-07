text1 = "akgh"
text2 = "hsari"

def hensyukyori_levenshtein(text1, text2):
    """
    >>> levenshtein('kitten', 'sitting')
    3
    >>> levenshtein('あいうえお', 'あいうえお')
    0
    >>> levenshtein('あいうえお', 'かきくけこ')
    5
    """

    n, m = len(text1), len(text2)

    dp = [[0] * (m + 1) for _ in range(n + 1)]

    for i in range(n + 1):
        dp[i][0] = i

    for j in range(m + 1):
        dp[0][j] = j

    for i in range(1, n + 1):
        for j in range(1, m + 1):
            cost = 0 if text1[i - 1] == text2[j - 1] else 1
            dp[i][j] = min(dp[i - 1][j] + 1,         # insertion
                           dp[i][j - 1] + 1,         # deletion
                           dp[i - 1][j - 1] + cost)  # replacement

    return dp[n][m]

hensyukyori_levenshtein(text1, text2)

