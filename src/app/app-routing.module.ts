import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ActionsComponent } from './actions/actions.component';
import { ProfileComponent } from './profile/profile.component';
import { UserCreateComponent } from './user-create/user-create.component';

const routes: Routes = [
  { path:'', redirectTo:'/login', pathMatch:'full'},
  { path:'login', component: AuthComponent },
  { path:'dashboard', component: DashboardComponent,
    children: [
      {
        path: 'actions', component: ActionsComponent
      },
      {
        path: 'profile', component: ProfileComponent
      },
      {
        path: 'user-create', component: UserCreateComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
