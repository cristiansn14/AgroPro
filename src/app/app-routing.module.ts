import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { UserCreateComponent } from './user-create/user-create.component';
import { FincaCreateComponent } from './finca-create/finca-create.component';
import { ParcelaCreateComponent } from './parcela-create/parcela-create.component';

const routes: Routes = [
  { path:'', redirectTo:'/login', pathMatch:'full'},
  { path:'login', component: AuthComponent },
  { path:'dashboard', component: DashboardComponent,
    children: [
      {
        path: 'profile', component: ProfileComponent
      },
      {
        path: 'user-create', component: UserCreateComponent
      },
      {
        path: 'finca-create', component: FincaCreateComponent
      },
      {
        path: 'parcela-create', component: ParcelaCreateComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
