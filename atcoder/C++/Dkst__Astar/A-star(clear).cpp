
#include <bits/stdc++.h>


// ヒューリスティック距離を求める(マンハッタン距離)(H(n))
int solve_distance(int xs, int ys, int xf, int yf) {
    int temp_ans;
    temp_ans = abs(xs - xf) + abs(ys - yf);
    return temp_ans;
}

int main() {
    // 標準入力からmatrixを作成
    int M, N;
    cin >> M >> N;
    vector<vector<char>> matrix(N, vector<char>(M));

    int x_start, y_start, x_finish, y_finish;

    // e.x. 左上から右下
    x_start = 0;
    y_start = 0;
    x_finish = N - 1;  
    y_finish = M - 1;

    for (int i=0;i<N;i++) {
        for (int j=0;j<M;j++) {
            cin >> matrix[i][j];

            
            /* 始点と終点が入力与えられる
            if (matrix[i][j] == 's') {
                x_start = i;
                y_start = j;
            } else if (matrix[i][j] == 'g') {
                x_finish = i;
                y_finish = j;
            }
            */
        }
    }




    // 移動用vectorの作成
    vector<pair<int, int>> movement_houkou;
    movement_houkou.push_back({-1, 0}); // 左
    movement_houkou.push_back({1, 0});  // 右
    movement_houkou.push_back({0, -1}); // 上
    movement_houkou.push_back({0, 1});  // 下
    

    // 優先度キューの作成
    priority_queue< pair<int, pair<int, pair<int, int >>>, vector< pair< int, pair< int, pair< int, int >>>>, greater< pair< int, pair< int, pair< int, int >>>>> prior_que;
    vector<vector<int>> matrix_mincost(N, vector<int>(M, max_values));

    prior_que.push(make_pair(solve_distance(x_start, y_start, x_finish, y_finish), make_pair(0, make_pair(x_start, y_start))));
    matrix_mincost[x_start][y_start] = 0;


    // A-star の実装
    //必要な変数を用意する．
    int ans_distance, move_size, cost_temp, cost_now, xpoint, ypoint, x_nextpoint, y_nextpoint, cost_new;

    ans_distance = -10;  
    move_size = movement_houkou.size();
    cost_temp = 0;
    cost_now  = 0;
    cost_new  = 0;
    xpoint    = 0;
    ypoint    = 0;
    x_nextpoint = 0;
    y_nextpoint = 0;


    while (prior_que.empty() == false ) {
    
        cost_temp = prior_que.top().first;
        cost_now = prior_que.top().second.first;
        xpoint = prior_que.top().second.second.first;
        ypoint = prior_que.top().second.second.second;

        prior_que.pop();


        
        if (xpoint == x_finish && ypoint == y_finish) {

            ans_distance = cost_now;

            break;
        }



        for (int t=0;t<move_size;t++) {

            x_nextpoint = xpoint + movement_houkou[t].first;
            y_nextpoint = ypoint + movement_houkou[t].second;

            if (x_nextpoint < 0 || N <= x_nextpoint || y_nextpoint < 0 || y_nextpoint >= M || matrix[x_nextpoint][y_nextpoint] == '1' ) {
                // なんもしない


            } else {
                
                cost_new = cost_now + 1;

                // 最小コストを更新した時，
                if (matrix_mincost[x_nextpoint][y_nextpoint] > cost_new) {
                    matrix_mincost[x_nextpoint][y_nextpoint] = cost_new;
                    prior_que.push(make_pair(cost_new + solve_distance(x_nextpoint, y_nextpoint, x_finish, y_finish), make_pair(cost_new, make_pair(x_nextpoint, y_nextpoint))));

                }
            }
        }

    }

    // 結果の出力，道がない or minを出力
    if (ans_distance == -10) {
        cout << "経路なし" << endl;
    } else {
        cout << ans_distance << endl;
    }

}
