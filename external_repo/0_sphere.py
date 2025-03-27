import vtk

# 球のソースを作成
sphere = vtk.vtkSphereSource()
sphere.SetRadius(5.0)
sphere.SetThetaResolution(30)
sphere.SetPhiResolution(30)

# マッパーを作成
mapper = vtk.vtkPolyDataMapper()
mapper.SetInputConnection(sphere.GetOutputPort())

# アクターを作成
actor = vtk.vtkActor()
actor.SetMapper(mapper)

# レンダラーを作成
renderer = vtk.vtkRenderer()
renderer.AddActor(actor)
renderer.SetBackground(0.1, 0.1, 0.4)  # 背景色を設定

# レンダリングウィンドウとインタラクターを作成
renderWindow = vtk.vtkRenderWindow()
renderWindow.AddRenderer(renderer)
renderWindow.SetSize(800, 600)

renderWindowInteractor = vtk.vtkRenderWindowInteractor()
renderWindowInteractor.SetRenderWindow(renderWindow)

# 表示
renderWindow.Render()
renderWindowInteractor.Start()
