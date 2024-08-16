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
import { DetallesParcelaComponent } from './parcela/detalles-parcela/detalles-parcela.component';
import { CrearMovimientoComponent } from './movimientos/crear-movimiento/crear-movimiento.component';
import { ListarMovimientosComponent } from './movimientos/listar-movimientos/listar-movimientos.component';
import { DetallesFincaComponent } from './finca/detalles-finca/detalles-finca.component';
import { EditarFincaComponent } from './finca/editar-finca/editar-finca.component';
import { CrearRepresentanteComponent } from './usuario/crear-representante/crear-representante.component';
import { EditarUsuarioFincaComponent } from './finca/editar-usuario-finca/editar-usuario-finca.component';
import { EditarRepresentanteComponent } from './usuario/editar-representante/editar-representante.component';
import { EditarParcelaComponent } from './parcela/editar-parcela/editar-parcela.component';
import { EditarUsuarioParcelaComponent } from './parcela/editar-usuario-parcela/editar-usuario-parcela.component';
import { CrearUsuarioParcelaComponent } from './parcela/crear-usuario-parcela/crear-usuario-parcela.component';

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
        path: 'añadir-representante/:id', component: CrearRepresentanteComponent
      },
      {
        path: 'editar-representante/:id', component: EditarRepresentanteComponent
      },
      {
        path: 'crear-finca', component: CrearFincaComponent
      },
      {
        path: 'detalles-finca', component: DetallesFincaComponent
      },
      {
        path: 'editar-finca', component: EditarFincaComponent
      },
      {
        path: 'añadir-usuario', component: AddUsuarioComponent
      },
      {
        path: 'editar-usuario-finca/:id', component: EditarUsuarioFincaComponent
      },
      {
        path: 'crear-parcela', component: CrearParcelaComponent
      },
      {
        path: 'crear-movimiento', component: CrearMovimientoComponent
      },
      {
        path: 'listar-movimientos', component: ListarMovimientosComponent
      },
      {
        path: 'detalles-parcela/:referenciaCatastral', component: DetallesParcelaComponent
      },
      {
        path: 'editar-parcela/:referenciaCatastral', component: EditarParcelaComponent
      },
      {
        path: 'crear-usuario-parcela/:referenciaCatastral', component: CrearUsuarioParcelaComponent
      },
      {
        path: 'editar-usuario-parcela/:id', component: EditarUsuarioParcelaComponent
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
