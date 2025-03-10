import vtk
import numpy as np

def lorenz_attractor():
    dt = 0.01
    num_steps = 5000
    sigma, beta, rho = 10, 8/3, 28
    x, y, z = 0.0, 1.0, 1.05

    points = vtk.vtkPoints()
    for _ in range(num_steps):
        dx = sigma * (y - x) * dt
        dy = (x * (rho - z) - y) * dt
        dz = (x * y - beta * z) * dt
        x += dx
        y += dy
        z += dz
        points.InsertNextPoint(x, y, z)

    polyline = vtk.vtkPolyLine()
    polyline.GetPointIds().SetNumberOfIds(num_steps)
    for i in range(num_steps):
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
    renderer.AddActor(lorenz_attractor())
    renderer.SetBackground(0, 0, 0)

    renderWindow = vtk.vtkRenderWindow()
    renderWindow.AddRenderer(renderer)
    renderWindow.SetSize(800, 600)

    renderWindowInteractor = vtk.vtkRenderWindowInteractor()
    renderWindowInteractor.SetRenderWindow(renderWindow)

    renderWindow.Render()
    renderWindowInteractor.Start()

if __name__ == "__main__":
    main()
