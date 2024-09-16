#include <bits/stdc++.h>


vector<int> func_name(vector<int> vecv){
    int temp = 0;

    vector<int> vectemp = {0};
    for (int i : vecv) {
        
        temp = temp + i;
        vectemp.push_back(temp);
    }
    //copy(vectemp.begin(), vectemp.end(), ostream_iterator<int>(cout, " "));

    return vectemp;
}