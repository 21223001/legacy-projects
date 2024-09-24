#include <bits/stdc++.h>


/* 1 hash function と hash table の実装 */




// i, j より，ハッシュ値を生成する関数(size_tが安全牌)
size_t Hash_maker(int i, int j) {

    // i と j を文字列に変換して結合
    string ij_string;
    ij_string = to_string(i) + to_string(j);

    // 
    size_t return_hash;
    return_hash = hash<string>{}(ij_string);

    return return_hash;
}


// OPEN or CLOSE について，列挙型を用いる
enum class enum_open_close {
    OP, CL
};


// hash関数の作成 (hash_function) 2次元matrix用

// unorderes_map< ... , Hash>  Hashは型？が不定形なので，structを用いる
struct each_matrix {

    // i, j, 
    int i_coord, j_coord;

    // Fn = Gn + Hn
    double F_n;

    // enumclass を呼び出し
    enum_open_close oc_tag;


    // コンストラクタの初期化  引数を渡せるようにする (コンストラクタの引数は _ を付けるのが一般的？)
    // ID, i, j, Fn, oc_tag
    hash_function( int _i_coord, int _j_coord, double _F_n) : i_coord(_i_coord), j_coord(_j_coord), F_n(_F_n), oc_tag(enum_open_close :: OP) {}

};



int main() {

    /* 0標準入力からmatrixを作成 */

    int M, N;
    cin >> M >> N;
    vector<vector<char>> matrix(N, vector<char>(M));

    int x_start, y_start, x_finish, y_finish;

    // e.x. 左上から右下
    x_start = 0;
    y_start = 0;
    x_finish = N - 1;  
    y_finish = M - 1;

    //始点と終点が入力与えられる
    for (int i=0;i<N;i++) {
        for (int j=0;j<M;j++) {
            cin >> matrix[i][j];

            if (matrix[i][j] == 'start') {
                x_start = i;
                y_start = j;
            } else if (matrix[i][j] == 'finish') {
                x_finish = i;
                y_finish = j;
            }
        }
    }
    
    // 0 ここまで
        





    /* hash-tableの作成 (2次元matrixのhash-table)*/
    // std::unordered_map<Key, T, Hash >  referenceより，使用例
    // std::unordered_map<std::string, int> um{ {"1st", 1}, {"2nd", 2}, {"3rd", 3}, };    
    
    // hash_table_matrix を作成 (hash_functionを使用)   

    unordered_map < pair < int, int >, int, each_matrix > hash_table_matrix;
    

    
    
}






// i, j より，ハッシュ値を生成する関数(size_tが安全牌)
size_t CoordinateHasher(int i, int j) {

    // i と j を文字列に変換して結合
    string ij_string;
    ij_string = to_string(i) + to_string(j);

    // 
    size_t return_hash;
    return_hash = hash<string>{}(ij_string);

    return return_hash;
}