// cinは半角を1つづつ?
// getline()は一度に全て?

#include <bits/stdc++.h>


#include <iostream>
using namespace std;
int main(void){
    string str;
    getline(cin, str);
    cout << str << endl;
    return 0;
}



// i方向に多数(N, string)

int main(void) {
    int N;
    cin >> N;
    for (int i = 0; i < N; ++i) {
        string S;
        cin >> S;
        cout << S << endl;
    }
}




// j方向多数　N + string(半角分け)

int main() {
    int N;
    cin >> N;

    for (int i = 0; i < N; ++i) {
        string S;
        cin >> S;
        cout << S << endl;
    }
}



/* ij方向に多数
N + string(半角含む)

*/

int main() {
    int N;
    cin >> N;
    string dummy;
    getline(cin, dummy);
    for (int i = 0; i < N; ++i) {
        string S;
        getline(cin, S);
        cout << S << endl;
    }
}