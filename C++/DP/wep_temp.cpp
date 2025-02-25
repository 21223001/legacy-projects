#include <bits/stdc++.h>

using namespace std;

int main() {

    long long S = 30;
    int P = 5;


    vector<long long> dp(P + 1, 0);
    dp[0] = S;


    for (int i = 1; i <= P; ++i) {
        for (int j = 0; j < i; ++j) {
            long long new_strength = dp[j] * (100 + (i - j)) / 100;
            dp[i] = max(dp[i], new_strength);
        }
    }


    cout << "For S = " << S << ", P = " << P << " -> DP Result: " << dp[P] << endl;

    return 0;
}
