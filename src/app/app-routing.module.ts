import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CrearUsuarioComponent } from './usuario/crear-usuario/crear-usuario.component';
import { EditarUsuarioComponent } from './usuario/editar-usuario/editar-usuario.component';
import { DetallesUsuarioComponent } from './usuario/detalles-usuario/detalles-usuario.component';
import { CrearParcelaComponent } from './parcela/crear-parcela/crear-parcela.component';
import { HomeComponent } from './home/home.component';
import { authGuard } from './auth/auth.guard';
import { CrearFincaComponent } from './finca/crear-finca/crear-finca.component';
import { AddUsuarioComponent } from './finca/añadir-usuario/add-usuario.component';

const routes: Routes = [
  { path:'', redirectTo:'/login', pathMatch:'full'},
  { path:'login', component: AuthComponent }, 
  { path:'dashboard', component: DashboardComponent, canActivate: [authGuard],
    children: [
      {
        path: 'home', component: HomeComponent
      },
      {
        path: 'registrar-usuario', component: CrearUsuarioComponent
      },
      {
        path: 'editar-perfil/:id', component: EditarUsuarioComponent
      },
      {
        path: 'ver-perfil/:id', component: DetallesUsuarioComponent
      },
      {
        path: 'crear-finca', component: CrearFincaComponent
      },
      {
        path: 'añadir-usuario', component: AddUsuarioComponent
      },
      {
        path: 'crear-parcela', component: CrearParcelaComponent
      }
    ]
  },
  { path: '**', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
