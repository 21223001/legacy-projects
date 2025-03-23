#include <bits/stdc++.h>

using namespace std;

int main(){
    int H,W,N,x,y;
    cin >> H >> W >> N;
    
    vector<string> S(H);

    for (int i = 0; i < H; i++){
        cin >> S[i];
    }

    for (int i = 0; i < N; i++){
        cin >> y >> x;
        cout << S[y][x] << endl;
    }
}




#include <bits/stdc++.h>
using namespace std;

int main(void){

    int H, M, N, a, b;
    
    //std::cin >> H >> M >> N;
    
    string temp;
    
    std::vector<std::vector<string>> matrix;

    matrix  = {{"123", "234", "345"},{"345","456","567"}};

    H = 5;
    M = 4;
    N = 4;
    

    for (int i=0;i<M;i++) {
        temp = "#";
        
        
        
        for (int j=0;j<N;j++) {
            matrix[0].insert(matrix[0].begin() + j, "a");
            
        }
    }
    
    std::cout << matrix[0][1] << std::endl;
            
}



    if (std::all_of(temp.cbegin(), temp.cend(), isdigit))