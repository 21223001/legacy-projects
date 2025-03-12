import vtk

# レンダラー、レンダリングウィンドウ、インタラクタの作成
renderer = vtk.vtkRenderer()
render_window = vtk.vtkRenderWindow()
render_window.AddRenderer(renderer)
render_interactor = vtk.vtkRenderWindowInteractor()
render_interactor.SetRenderWindow(render_window)

# 球を作成（顔）
face = vtk.vtkSphereSource()
face.SetCenter(0, 0, 0)
face.SetRadius(5)

face_mapper = vtk.vtkPolyDataMapper()
face_mapper.SetInputConnection(face.GetOutputPort())
face_actor = vtk.vtkActor()
face_actor.SetMapper(face_mapper)
face_actor.GetProperty().SetColor(0.6, 0.4, 0.2)  # 茶色

# 耳（球）
left_ear = vtk.vtkSphereSource()
left_ear.SetCenter(-3.5, 5, 0)
left_ear.SetRadius(2.2)

left_ear_mapper = vtk.vtkPolyDataMapper()
left_ear_mapper.SetInputConnection(left_ear.GetOutputPort())
left_ear_actor = vtk.vtkActor()
left_ear_actor.SetMapper(left_ear_mapper)
left_ear_actor.GetProperty().SetColor(0.6, 0.4, 0.2)  # 茶色

right_ear = vtk.vtkSphereSource()
right_ear.SetCenter(3.5, 5, 0)
right_ear.SetRadius(2.2)

right_ear_mapper = vtk.vtkPolyDataMapper()
right_ear_mapper.SetInputConnection(right_ear.GetOutputPort())
right_ear_actor = vtk.vtkActor()
right_ear_actor.SetMapper(right_ear_mapper)
right_ear_actor.GetProperty().SetColor(0.6, 0.4, 0.2)  # 茶色

# 鼻（球）
nose = vtk.vtkSphereSource()
nose.SetCenter(0, -1.5, 4)
nose.SetRadius(1)

nose_mapper = vtk.vtkPolyDataMapper()
nose_mapper.SetInputConnection(nose.GetOutputPort())
nose_actor = vtk.vtkActor()
nose_actor.SetMapper(nose_mapper)
nose_actor.GetProperty().SetColor(0, 0, 0)  # 黒色

# 目（球）
left_eye = vtk.vtkSphereSource()
left_eye.SetCenter(-2, 2, 4.5)
left_eye.SetRadius(0.6)

left_eye_mapper = vtk.vtkPolyDataMapper()
left_eye_mapper.SetInputConnection(left_eye.GetOutputPort())
left_eye_actor = vtk.vtkActor()
left_eye_actor.SetMapper(left_eye_mapper)
left_eye_actor.GetProperty().SetColor(0, 0, 0)  # 黒色

right_eye = vtk.vtkSphereSource()
right_eye.SetCenter(2, 2, 4.5)
right_eye.SetRadius(0.6)

right_eye_mapper = vtk.vtkPolyDataMapper()
right_eye_mapper.SetInputConnection(right_eye.GetOutputPort())
right_eye_actor = vtk.vtkActor()
right_eye_actor.SetMapper(right_eye_mapper)
right_eye_actor.GetProperty().SetColor(0, 0, 0)  # 黒色

# すべてのオブジェクトをシーンに追加
renderer.AddActor(face_actor)
renderer.AddActor(left_ear_actor)
renderer.AddActor(right_ear_actor)
renderer.AddActor(nose_actor)
renderer.AddActor(left_eye_actor)
renderer.AddActor(right_eye_actor)

# 背景とカメラ設定
renderer.SetBackground(0.9, 0.9, 0.9)  # 背景をグレー
camera = renderer.GetActiveCamera()
camera.SetPosition(0, 0, 20)
camera.SetFocalPoint(0, 0, 0)

# レンダリング開始
render_window.Render()
render_interactor.Start()
