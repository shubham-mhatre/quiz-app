import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Dashboardcomponent } from './components/dashboardcomponent/dashboardcomponent';
import { authguardGuard } from './guards/authguard-guard';
import { roleguardGuard } from './guards/roleguard-guard';
import { Unauthorized } from './components/unauthorized/unauthorized';

const routes: Routes = [
  { path: 'login', component: Login },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'dashboard', 
    component: Dashboardcomponent, 
    canActivate:[authguardGuard,roleguardGuard],
    data: { role: 'USER' } 
  },
  { path: 'unauthorized', component: Unauthorized },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
