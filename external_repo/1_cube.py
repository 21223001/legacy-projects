import vtk

def create_cube():
    cube = vtk.vtkCubeSource()
    cube.SetXLength(5.0)
    cube.SetYLength(5.0)
    cube.SetZLength(5.0)

    mapper = vtk.vtkPolyDataMapper()
    mapper.SetInputConnection(cube.GetOutputPort())

    actor = vtk.vtkActor()
    actor.SetMapper(mapper)

    return actor

def main():
    renderer = vtk.vtkRenderer()
    renderer.AddActor(create_cube())
    renderer.SetBackground(0.2, 0.2, 0.2)

    renderWindow = vtk.vtkRenderWindow()
    renderWindow.AddRenderer(renderer)
    renderWindow.SetSize(800, 600)

    renderWindowInteractor = vtk.vtkRenderWindowInteractor()
    renderWindowInteractor.SetRenderWindow(renderWindow)

    renderWindow.Render()
    renderWindowInteractor.Start()

if __name__ == "__main__":
    main()
