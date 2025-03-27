import vtk

def create_cone():
    cone = vtk.vtkConeSource()
    cone.SetHeight(7.0)
    cone.SetRadius(3.0)
    cone.SetResolution(50)

    mapper = vtk.vtkPolyDataMapper()
    mapper.SetInputConnection(cone.GetOutputPort())

    actor = vtk.vtkActor()
    actor.SetMapper(mapper)

    return actor

def main():
    renderer = vtk.vtkRenderer()
    renderer.AddActor(create_cone())
    renderer.SetBackground(0.3, 0.3, 0.3)

    renderWindow = vtk.vtkRenderWindow()
    renderWindow.AddRenderer(renderer)
    renderWindow.SetSize(800, 600)

    renderWindowInteractor = vtk.vtkRenderWindowInteractor()
    renderWindowInteractor.SetRenderWindow(renderWindow)

    renderWindow.Render()
    renderWindowInteractor.Start()

if __name__ == "__main__":
    main()
