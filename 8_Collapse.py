import vtk
import numpy as np
import random

class BridgeCollapseAnimation2D:
    def __init__(self,
                 Nx=10, Ny=5,
                 gravity=-0.02,     
                 friction=0.02,     
                 spring_k=0.1,      
                 rest_length_x=1.0, 
                 rest_length_y=0.5, 
                 time_step=0.1,
                 salt_scale=0.001): 
        """
        Nx, Ny: ブロックを並べるグリッドのサイズ（x方向Nx個, y方向Ny個）
        gravity: 重力加速度
        friction: 摩擦(速度を減衰させる係数)
        spring_k: 隣接ブロック間のばね定数
        rest_length_x, rest_length_y: x, y 隣接ブロック間の自然長
        time_step: シミュレーションのタイムステップ
        salt_scale: 毎フレームごとに加わるランダム微小力の大きさ
        """
        self.Nx = Nx
        self.Ny = Ny
        self.num_pieces = Nx * Ny
        
        self.gravity = gravity
        self.friction = friction
        self.spring_k = spring_k
        self.rest_length_x = rest_length_x
        self.rest_length_y = rest_length_y
        self.time_step = time_step
        self.salt_scale = salt_scale
        

        self.positions = []
        for j in range(Ny):
            for i in range(Nx):
                base_x = i * rest_length_x + (random.uniform(-0.1, 0.1))
                base_y = j * rest_length_y + (random.uniform(-0.1, 0.1))
                self.positions.append([base_x, base_y, 0.0])
        self.positions = np.array(self.positions, dtype=float)
        self.velocities = np.zeros((self.num_pieces, 3))
        
        self.fixed_blocks = set()
        for j in range(Ny):
            left_index  = j * Nx + 0      
            right_index = j * Nx + (Nx-1) 
            self.fixed_blocks.add(left_index)
            self.fixed_blocks.add(right_index)
    
        self.total_time = 0.0
        self.frame = 0
        
        self.init_vtk()

    def init_vtk(self):
        self.renderer = vtk.vtkRenderer()
        self.renderWindow = vtk.vtkRenderWindow()
        self.renderWindow.AddRenderer(self.renderer)
        self.renderWindow.SetSize(800, 600)
        self.interactor = vtk.vtkRenderWindowInteractor()
        self.interactor.SetRenderWindow(self.renderWindow)
        
        self.actors = []
        for idx in range(self.num_pieces):
            cube = vtk.vtkCubeSource()
            cube.SetXLength(0.9) 
            cube.SetYLength(0.2)  
            cube.SetZLength(0.5)  
            
            cube.Update()
            mapper = vtk.vtkPolyDataMapper()
            mapper.SetInputConnection(cube.GetOutputPort())
            
            actor = vtk.vtkActor()
            actor.SetMapper(mapper)
            actor.SetPosition(*self.positions[idx])
            
            self.renderer.AddActor(actor)
            self.actors.append(actor)
        
        self.renderer.SetBackground(0.1, 0.1, 0.1)
        self.interactor.AddObserver("TimerEvent", self.update_scene)
        self.timerId = self.interactor.CreateRepeatingTimer(100)

    def index(self, i, j):
        """(i, j) から 1 次元インデックスへ変換するヘルパー"""
        return j * self.Nx + i

    def neighbors(self, i, j):
        """(i, j) に隣接する (i', j') を返す。上下左右のみ。"""
        nb = []
        if i > 0:        nb.append((i-1, j))
        if i < self.Nx-1: nb.append((i+1, j))
        if j > 0:        nb.append((i, j-1))
        if j < self.Ny-1: nb.append((i, j+1))
        return nb
    
    def update_scene(self, obj, event):
        # 30秒を超えたらアニメーション停止
        if self.total_time >= 30.0:
            self.interactor.DestroyTimer(self.timerId)
            return
        
        forces = np.zeros((self.num_pieces, 3))
        
        for idx in range(self.num_pieces):
            if idx not in self.fixed_blocks:
                forces[idx][1] += self.gravity
        
        for j in range(self.Ny):
            for i in range(self.Nx):
                idx = self.index(i, j)
                if idx in self.fixed_blocks:
                    continue
                pos_i = self.positions[idx]
                
                for (ni, nj) in self.neighbors(i, j):
                    nidx = self.index(ni, nj)
                    pos_n = self.positions[nidx]
                    
                    diff = pos_n - pos_i
                    dist = np.linalg.norm(diff)
                    if dist < 1e-8:
                        continue

                    if ni != i:
                        rest = self.rest_length_x
                    else:
                        rest = self.rest_length_y
                    
                    delta = dist - rest
                    force_dir = diff / dist
                    force_vec = self.spring_k * delta * force_dir
                    forces[idx] += force_vec
        
        random_forces = (np.random.rand(self.num_pieces, 3) - 0.5) * 2.0 * self.salt_scale
        forces += random_forces
        
        for idx in range(self.num_pieces):
            if idx in self.fixed_blocks:
                self.velocities[idx] = 0
                continue
            

            self.velocities[idx] += forces[idx] * self.time_step
            self.velocities[idx] *= (1 - self.friction)
            self.positions[idx] += self.velocities[idx] * self.time_step
            self.actors[idx].SetPosition(*self.positions[idx])
        
        self.total_time += self.time_step
        self.frame += 1
        self.renderWindow.Render()

    def start(self):
        self.renderWindow.Render()
        self.interactor.Initialize()
        self.interactor.CreateRepeatingTimer(100)
        self.interactor.Start()

if __name__ == "__main__":
    animation = BridgeCollapseAnimation2D(
        Nx=10,          # x軸方向のブロック数
        Ny=5,           # y軸方向のブロック数
        gravity=-0.02,  # 重力の大きさ
        friction=0.02,  # 摩擦係数
        spring_k=0.1,   # ばね定数
        rest_length_x=1.0,
        rest_length_y=0.5,
        time_step=0.1,
        salt_scale=0.001
    )
    animation.start()
