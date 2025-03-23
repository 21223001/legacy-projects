

vector<int> accumulate_function(vector<int> vecv){
    int temp = 0;

    vector<int> vectemp = {0};
    for (int i : vecv) {
        
        temp = temp + i;
        vectemp.push_back(temp);
    }
    //copy(vectemp.begin(), vectemp.end(), ostream_iterator<int>(cout, " "));

    return vectemp;
}




int main(void){
    vector<int> vec_ans;
    vector<int> arr = {1, 2, 3};

    vec_ans = accumulate_function(arr);
    copy(vec_ans.begin(), vec_ans.end(), ostream_iterator<int>(cout, " "));
}


