# 0のあるインデックスを求めてリストzに格納
z = []
for i,i_v in enumerate(square):
    for j,j_v in enumerate(i_v):
        if j_v == 0:
            z.append((i,j))