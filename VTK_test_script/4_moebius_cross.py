import vtk

def create_moebius_cross():
    mobius = vtk.vtkParametricBoy()

    mobius_source = vtk.vtkParametricFunctionSource()
    mobius_source.SetParametricFunction(mobius)
    mobius_source.Update()

    mapper = vtk.vtkPolyDataMapper()
    mapper.SetInputConnection(mobius_source.GetOutputPort())

    actor = vtk.vtkActor()
    actor.SetMapper(mapper)

    return actor

def main():
    renderer = vtk.vtkRenderer()
    renderer.AddActor(create_moebius_cross())
    renderer.SetBackground(0.0, 0.0, 0.0)

    renderWindow = vtk.vtkRenderWindow()
    renderWindow.AddRenderer(renderer)
    renderWindow.SetSize(800, 600)

    renderWindowInteractor = vtk.vtkRenderWindowInteractor()
    renderWindowInteractor.SetRenderWindow(renderWindow)

    renderWindow.Render()
    renderWindowInteractor.Start()

if __name__ == "__main__":
    main()
