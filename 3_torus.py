import vtk

def create_torus():
    torus = vtk.vtkParametricTorus()
    torus.SetRingRadius(5.0)
    torus.SetCrossSectionRadius(2.0)

    torus_source = vtk.vtkParametricFunctionSource()
    torus_source.SetParametricFunction(torus)
    torus_source.Update()

    mapper = vtk.vtkPolyDataMapper()
    mapper.SetInputConnection(torus_source.GetOutputPort())

    actor = vtk.vtkActor()
    actor.SetMapper(mapper)

    return actor

def main():
    renderer = vtk.vtkRenderer()
    renderer.AddActor(create_torus())
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
