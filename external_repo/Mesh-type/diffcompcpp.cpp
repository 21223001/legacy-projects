#include <pybind11/pybind11.h>
#include <pybind11/numpy.h>
#include <vector>
#include <cmath>

namespace py = pybind11;

// 関数プロトタイプ
void update_diffusion(
    py::array_t<double> wusr, py::array_t<double> wusp, py::array_t<double> clvr, 
    py::array_t<double> clvp, py::array_t<double> erfL, py::array_t<double> erfR, 
    py::array_t<double> ham, py::array_t<double> mask, 
    py::array_t<double> wusr0, py::array_t<double> wusp0, py::array_t<double> clvr0, 
    py::array_t<double> clvp0, py::array_t<double> erfL0, py::array_t<double> erfR0, 
    py::array_t<double> ham0, double dt, double dx, double dy, 
    double k_Wr, double k_WL, double K_WL, double n_WL, 
    double k_WC, double K_WC, double n_WC, double ki_W, double K_WW, 
    double n_WW, double b_Wr, double k_Wp, double b_Ww, double D_Ww, 
    double k_Cr, double K_CL, double n_CL, double a_Cc, 
    double K_CW, double n_CW, double K_CH, double n_CH, 
    double b_Cr, double k_Cp, double D_Cc, double k_Ll, double b_Ll, 
    double D_Ll, double k_pp, double b_pp) 
{
    auto wusr_buf = wusr.mutable_unchecked<2>();
    auto wusp_buf = wusp.mutable_unchecked<2>();
    auto clvr_buf = clvr.mutable_unchecked<2>();
    auto clvp_buf = clvp.mutable_unchecked<2>();
    auto erfL_buf = erfL.mutable_unchecked<2>();
    auto erfR_buf = erfR.mutable_unchecked<2>();
    auto ham_buf = ham.mutable_unchecked<2>();
    auto mask_buf = mask.unchecked<2>();

    auto wusr0_buf = wusr0.unchecked<2>();
    auto wusp0_buf = wusp0.unchecked<2>();
    auto clvr0_buf = clvr0.unchecked<2>();
    auto clvp0_buf = clvp0.unchecked<2>();
    auto erfL0_buf = erfL0.unchecked<2>();
    auto erfR0_buf = erfR0.unchecked<2>();
    auto ham0_buf = ham0.unchecked<2>();

    int rows = wusr_buf.shape(0);
    int cols = wusr_buf.shape(1);

    for (int i = 1; i < rows - 1; ++i) {
        for (int j = 1; j < cols - 1; ++j) {
            if (mask_buf(j, i) == 1) {
                wusr_buf(i, j) = wusr0_buf(i, j) + dt * (
                    k_Wr * ((k_WL / (1 + pow((erfL0_buf(i, j) + erfR0_buf(i, j)) / K_WL, n_WL))) +
                    (k_WC / (1 + pow(clvp0_buf(i, j) / K_WC, n_WC)))) *
                    (ki_W + (pow(wusp0_buf(i, j) / K_WW, n_WW) / (1 + pow(wusp0_buf(i, j) / K_WW, n_WW)))) - b_Wr * wusr0_buf(i, j));

                wusp_buf(i, j) = wusp0_buf(i, j) + dt * (
                    k_Wp * wusr0_buf(i, j) - b_Ww * wusp0_buf(i, j) +
                    D_Ww * ((wusp0_buf(i + 1, j) - 2 * wusp0_buf(i, j) + wusp0_buf(i - 1, j)) / (dx * dx)) +
                    D_Ww * ((wusp0_buf(i, j + 1) - 2 * wusp0_buf(i, j) + wusp0_buf(i, j - 1)) / (dy * dy)));

                clvr_buf(i, j) = clvr0_buf(i, j) + dt * (
                    (k_Cr / (1 + pow((erfL0_buf(i, j) + erfR0_buf(i, j)) / K_CL, n_CL))) *
                    (a_Cc + (pow(wusp0_buf(i, j) / K_CW, n_CW) / (1 + pow(wusp0_buf(i, j) / K_CW, n_CW)))) *
                    (1 / (1 + pow(ham0_buf(i, j) / K_CH, n_CH))) - b_Cr * clvr0_buf(i, j));

                clvp_buf(i, j) = clvp0_buf(i, j) + dt * (
                    k_Cp * clvr0_buf(i, j) - b_Cr * clvp0_buf(i, j) +
                    D_Cc * ((clvp0_buf(i + 1, j) - 2 * clvp0_buf(i, j) + clvp0_buf(i - 1, j)) / (dx * dx)) +
                    D_Cc * ((clvp0_buf(i, j + 1) - 2 * clvp0_buf(i, j) + clvp0_buf(i, j - 1)) / (dy * dy)));

                erfL_buf(i, j) = erfL0_buf(i, j) + dt * (
                    k_Ll - b_Ll * erfL0_buf(i, j) +
                    D_Ll * ((erfL0_buf(i + 1, j) - 2 * erfL0_buf(i, j) + erfL0_buf(i - 1, j)) / (dx * dx)) +
                    D_Ll * ((erfL0_buf(i, j + 1) - 2 * erfL0_buf(i, j) + erfL0_buf(i, j - 1)) / (dy * dy)));

                erfR_buf(i, j) = erfR0_buf(i, j) + dt * (
                    k_Ll - b_Ll * erfR0_buf(i, j) +
                    D_Ll * ((erfR0_buf(i + 1, j) - 2 * erfR0_buf(i, j) + erfR0_buf(i - 1, j)) / (dx * dx)) +
                    D_Ll * ((erfR0_buf(i, j + 1) - 2 * erfR0_buf(i, j) + erfR0_buf(i, j - 1)) / (dy * dy)));

                ham_buf(i, j) = ham0_buf(i, j) + dt * (k_pp - b_pp * ham0_buf(i, j));
            } else {
                wusr_buf(i, j) = 0;
                wusp_buf(i, j) = 0;
                clvr_buf(i, j) = 0;
                clvp_buf(i, j) = 0;
                erfL_buf(i, j) = 0;
                erfR_buf(i, j) = 0;
                ham_buf(i, j) = 0;
            }
        }
    }
}



PYBIND11_MODULE(diffcompcpp, m) {
    m.def("update_diffusion", &update_diffusion, "Update diffusion variables based on provided parameters");
}