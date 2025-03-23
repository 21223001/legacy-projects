
#include <bits/stdc++.h>


int main() {

    enum class NodeState { OPEN, CLOSE };

    struct Node {
        int id;
        double f;
        NodeState state;
        Node(int _id, double _f) : id(_id), f(_f), state(NodeState::OPEN) {}
    };

    std::unordered_map<int, Node*> node_map;
    std::priority_queue<Node*, std::vector<Node*>, 
        [](Node* a, Node* b) { return a->f > b->f; }> openList;

    void add_to_open(Node* node) {
        openList.push(node);
    }

    Node* pop_from_open() {
        while (!openList.empty()) {
            Node* node = openList.top();
            openList.pop();
            if (node->state == NodeState::OPEN) {
                node->state = NodeState::CLOSE;
                return node;
            }
        }
        return nullptr;
    }
}