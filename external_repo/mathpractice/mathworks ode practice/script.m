% ODE practice
k1 = 0.1;
k2 = 3;
k3 = 2;

sim('ex_hb1ode')
figure;
plot(tout,yout);
xlabel('Time');
ylabel('Concentration');
title('Robertson Reactions Modeled with ODEs')


