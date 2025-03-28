import vtk


# 1. STLリーダーを作成してファイルを読み込む
stl_file_path = r"C:\Users\mosuk\Documents\VTK_test_script\DRAGON.stl"  # STLファイルのパスを指定
reader = vtk.vtkSTLReader()
reader.SetFileName(stl_file_path)
reader.Update()

# 2. ポリゴンマッピング
mapper = vtk.vtkPolyDataMapper()
mapper.SetInputConnection(reader.GetOutputPort())

# 3. アクターの作成
actor = vtk.vtkActor()
actor.SetMapper(mapper)

# 4. 光源の設定（リアルな見た目にするため）
light = vtk.vtkLight()
light.SetPosition(1, 1, 1)  # 光源の位置
light.SetFocalPoint(0, 0, 0)  # 光の焦点

# 5. レンダラーの作成
renderer = vtk.vtkRenderer()
renderer.AddActor(actor)
renderer.AddLight(light)
renderer.SetBackground(0.2, 0.2, 0.2)  # 背景色（黒っぽく）

# 6. レンダリングウィンドウの作成
renderWindow = vtk.vtkRenderWindow()
renderWindow.AddRenderer(renderer)
renderWindow.SetSize(800, 800)  # ウィンドウサイズ指定

# 7. インタラクターの作成（マウス操作可能にする）
interactor = vtk.vtkRenderWindowInteractor()
interactor.SetRenderWindow(renderWindow)

# 8. 表示開始
renderWindow.Render()
interactor.Start()
