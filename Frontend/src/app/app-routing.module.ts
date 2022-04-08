import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { RegisterComponent } from './register/register.component';
import { SalesOrderComponent } from './sales-order/sales-order.component';
import { UserAuthGuardService } from './services/auth/user-auth-guard.service';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'sales', component: SalesOrderComponent, canActivate: [UserAuthGuardService] },
  { path: 'register', component: RegisterComponent },
  { path: 'employee', loadChildren: () => import('./employee/employee.module').then(m => m.EmployeeModule) },
  { path: '',   redirectTo: '/login', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
