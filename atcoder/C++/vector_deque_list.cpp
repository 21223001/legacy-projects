
// vector

    // 1次元
    vector<int> vecc = {1, 2, 3};
    vector<vector<int>> vecc(i, vector<int>(j));

    vecc[1] -> 2

    // 2次元
    vector<vector<int>> vecc(i, vector<int>(j));
    vecc = {{1, 4}, {2, 5}};
    
    std::cout << vecc[0][1] << std::endl;


    // vectorの中身を出力
    copy(vectemp.begin(), vectemp.end(), ostream_iterator<int>(cout, " "));



// main 

    // define
    std::deque<int> dq;
    std::deque<std::string> dq;

    // add last
    dq.push_back("a");

    // add first
    dq.push_front("a");

    // delete last
    dq.pop_front();

    // delete first
    dq.pop_back();


    // 先頭を取り出す
    std::deque<int> dq;

    // deque内をcout
    for (int i : dq) {
        std::cout << i << " ";
    }
    std::cout << std::endl;

    // sort
    sort(dq.begin(), dq.end());
    
    for (int i : dq) {
        std::cout << i << " ";
    }
    std::cout << std::endl;