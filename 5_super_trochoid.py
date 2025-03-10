import vtk
import math

def create_trochoid():
    points = vtk.vtkPoints()
    num_points = 500
    a, b, h = 5.0, 2.0, 1.0

    for i in range(num_points):
        t = i * 2.0 * math.pi / num_points
        x = (a + b) * math.cos(t) - h * math.cos((a + b) * t / b)
        y = (a + b) * math.sin(t) - h * math.sin((a + b) * t / b)
        z = math.sin(3 * t)  # 3Dの変化を加える
        points.InsertNextPoint(x, y, z)

    polyline = vtk.vtkPolyLine()
    polyline.GetPointIds().SetNumberOfIds(num_points)
    for i in range(num_points):
        polyline.GetPointIds().SetId(i, i)

    cells = vtk.vtkCellArray()
    cells.InsertNextCell(polyline)

    polyData = vtk.vtkPolyData()
    polyData.SetPoints(points)
    polyData.SetLines(cells)

    mapper = vtk.vtkPolyDataMapper()
    mapper.SetInputData(polyData)

    actor = vtk.vtkActor()
    actor.SetMapper(mapper)

    return actor

def main():
    renderer = vtk.vtkRenderer()
    renderer.AddActor(create_trochoid())
    renderer.SetBackground(0.2, 0.2, 0.3)

    renderWindow = vtk.vtkRenderWindow()
    renderWindow.AddRenderer(renderer)
    renderWindow.SetSize(800, 600)

    renderWindowInteractor = vtk.vtkRenderWindowInteractor()
    renderWindowInteractor.SetRenderWindow(renderWindow)

    renderWindow.Render()
    renderWindowInteractor.Start()

if __name__ == "__main__":
    main()
