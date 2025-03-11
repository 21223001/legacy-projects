import numpy as np
import vtk
from vtk.util import numpy_support
import time

# 反応拡散方程式のパラメータ
diffusion_rate_u = 0.3  # 成分uの拡散率
diffusion_rate_v = 0.05  # 成分vの拡散率
feed_rate = 0.05  # 成分uの供給率
kill_rate = 0.04  # 成分vの消失率

# グリッドサイズ
grid_size = 100
steps = 1000  # 時間ステップ数

# 初期条件
u = np.ones((grid_size, grid_size))
v = np.zeros((grid_size, grid_size))
center = grid_size // 2
u[center-5:center+5, center-5:center+5] = 0.50
v[center-5:center+5, center-5:center+5] = 0.25

# 反応拡散方程式
def reaction_diffusion_step(u, v, diffusion_rate_u, diffusion_rate_v, feed_rate, kill_rate):
    du = diffusion_rate_u * (np.roll(u, 1, axis=0) + np.roll(u, -1, axis=0) + np.roll(u, 1, axis=1) + np.roll(u, -1, axis=1) - 4 * u)
    dv = diffusion_rate_v * (np.roll(v, 1, axis=0) + np.roll(v, -1, axis=0) + np.roll(v, 1, axis=1) + np.roll(v, -1, axis=1) - 4 * v)
    
    reaction_term = u * v * v
    u += du - reaction_term + feed_rate * (1 - u)
    v += dv + reaction_term - (kill_rate + feed_rate) * v
    return u, v

# VTKで可視化する関数
def create_vtk_grid(u):
    vtk_data = numpy_support.numpy_to_vtk(u.ravel(), deep=True, array_type=vtk.VTK_FLOAT)
    
    grid = vtk.vtkImageData()
    grid.SetDimensions(u.shape[1], u.shape[0], 1)
    grid.GetPointData().SetScalars(vtk_data)
    
    color_map = vtk.vtkColorTransferFunction()
    color_map.AddRGBPoint(0.0, 0.0, 0.0, 1.0)  # 青
    color_map.AddRGBPoint(1.0, 1.0, 0.0, 0.0)  # 赤
    
    mapper = vtk.vtkDataSetMapper()
    mapper.SetInputData(grid)
    mapper.SetColorModeToMapScalars()
    mapper.SetLookupTable(color_map)
    
    actor = vtk.vtkActor()
    actor.SetMapper(mapper)
    
    renderer = vtk.vtkRenderer()
    renderer.AddActor(actor)
    renderer.SetBackground(1.0, 1.0, 1.0)  # 白背景
    
    render_window = vtk.vtkRenderWindow()
    render_window.AddRenderer(renderer)
    
    render_interactor = vtk.vtkRenderWindowInteractor()
    render_interactor.SetRenderWindow(render_window)
    
    return render_window, render_interactor, grid

# アニメーションの表示（10秒間）
def run_animation(steps, duration=10):
    global u, v
    
    render_window_u, render_interactor_u, grid_u = create_vtk_grid(u)
    render_window_u.Render()
    
    # タイマーイベントの設定
    def update_frame(obj, event):
        nonlocal start_time
        global u, v  # ここでu, vをグローバル変数として明示的に指定する
        current_time = time.time()
        if current_time - start_time > duration:
            render_interactor_u.GetRenderWindow().Finalize()
            render_interactor_u.TerminateApp()
            return
        
        u, v = reaction_diffusion_step(u, v, diffusion_rate_u, diffusion_rate_v, feed_rate, kill_rate)
        vtk_data = numpy_support.numpy_to_vtk(u.ravel(), deep=True, array_type=vtk.VTK_FLOAT)
        grid_u.GetPointData().SetScalars(vtk_data)
        render_window_u.Render()

    start_time = time.time()
    render_interactor_u.AddObserver("TimerEvent", update_frame)
    render_interactor_u.CreateRepeatingTimer(100)  # 100msごとに更新
    render_interactor_u.Start()

# 実行
run_animation(steps)
