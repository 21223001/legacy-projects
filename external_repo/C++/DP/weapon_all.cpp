#include <bits/stdc++.h>

#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

// 総当たりで全ての組み合わせを試して最も強い強さを求める再帰関数
void bruteForce(long long currentStrength, int remainingPoints, long long& maxStrength) {
    if (remainingPoints == 0) {
        maxStrength = max(maxStrength, currentStrength);
        return;
    }
    // 1からremainingPointsまで試して強化する
    for (int q = 1; q <= remainingPoints; ++q) {
        long long newStrength = (currentStrength * (100 + q)) / 100;
        bruteForce(newStrength, remainingPoints - q, maxStrength);
    }
}

// DPを使って最大強さを求める関数
long long dpMethod(long long S, int P) {
    vector<long long> dp(P + 1, 0);
    dp[0] = S;
    for (int i = 1; i <= P; ++i) {
        for (int j = 0; j < i; ++j) {
            long long new_strength = dp[j] * (100 + (i - j)) / 100;
            dp[i] = max(dp[i], new_strength);
        }
    }
    return dp[P];
}

int main() {
    // 全てのPの組み合わせ（1から1000まで）を試す
    bool allTestsPassed = true; // 全てのテストが成功したかのフラグ

    // Sの範囲は一部に限定して検証する
    for (long long S = 790; S <= 1000; ++S) {  
        for (int P = 10; P <= 19; ++P) {  
            long long bruteForceMax = 0;
            bruteForce(S, P, bruteForceMax);
            long long dpResult = dpMethod(S, P);

            // 結果の比較
            if (bruteForceMax != dpResult) {
                cout << "Test Failed for S = " << S << ", P = " << P << endl;
                cout << "Brute Force Result: " << bruteForceMax << endl;
                cout << "DP Method Result: " << dpResult << endl;
                allTestsPassed = false;
                break;
            }
        }
        if (!allTestsPassed) break;
    }

    if (allTestsPassed) {
        cout << "All tests passed successfully!" << endl;
    } else {
        cout << "NG" << endl;
    }

    return 0;
}


/*
S P

・1 行目にそれぞれ武器の初期の強さと使える強化ポイントを表す整数 S, P がこの順で半角スペース区切りで与えられます。
・入力は 1 行となり、末尾に改行が 1 つ入ります。

文字列は標準入力から渡されます。標準入力からの値取得方法はこちらをご確認ください
期待する出力
強化して得られる最終的な武器の強さの最大値を出力してください。
出力の最後に改行を入れ、余計な文字、空行を含んではいけません。
条件
すべてのテストケースにおいて、以下の条件をみたします。
・1 ≦ S ≦ 1,000,000,000
・1 ≦ P ≦ 1,000


*/