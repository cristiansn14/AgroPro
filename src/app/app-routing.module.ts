import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CrearUsuarioComponent } from './usuario/crear-usuario/crear-usuario.component';
import { EditarUsuarioComponent } from './usuario/editar-usuario/editar-usuario.component';
import { DetallesUsuarioComponent } from './usuario/detalles-usuario/detalles-usuario.component';
import { CrearParcelaComponent } from './parcela/crear-parcela/crear-parcela.component';
import { HomeComponent } from './home/home.component';
import { authGuard } from './guards/auth.guard';
import { adminAccessGuard } from './guards/admin-access.guard';
import { superAccessGuard } from './guards/super-access.guard';
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
import { ChangePasswordComponent } from './usuario/cambiar-contraseña/change-password.component';
import { GenerarLiquidacionComponent } from './liquidacion/generar-liquidacion/generar-liquidacion.component';
import { DetallesLiquidacionComponent } from './liquidacion/detalles-liquidacion/detalles-liquidacion.component';
import { ListarLiquidacionesComponent } from './liquidacion/listar-liquidaciones/listar-liquidaciones.component';
import { ListarUsuariosComponent } from './usuario/listar-usuarios/listar-usuarios.component';
import { ListarArchivosComponent } from './finca/listar-archivos/listar-archivos.component';
import { ListarFincasComponent } from './finca/listar-fincas/listar-fincas.component';

const routes: Routes = [
  { path:'', redirectTo:'/login', pathMatch:'full'},
  { path:'login', component: AuthComponent }, 
  { path:'dashboard', component: DashboardComponent, canActivate: [authGuard],
    children: [
      {
        path: 'home', component: HomeComponent
      },
      {
        path: 'registrar-usuario', component: CrearUsuarioComponent, canActivate: [adminAccessGuard],
      },
      {
        path: 'listar-usuarios', component: ListarUsuariosComponent, canActivate: [superAccessGuard],
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
        path: 'crear-finca', component: CrearFincaComponent, canActivate: [adminAccessGuard],
      },
      {
        path: 'detalles-finca', component: DetallesFincaComponent
      },
      {
        path: 'editar-finca', component: EditarFincaComponent, canActivate: [adminAccessGuard],
      },
      {
        path: 'listar-fincas', component: ListarFincasComponent
      },
      {
        path: 'añadir-usuario', component: AddUsuarioComponent, canActivate: [adminAccessGuard],
      },
      {
        path: 'editar-usuario-finca/:id', component: EditarUsuarioFincaComponent, canActivate: [adminAccessGuard],
      },
      {
        path: 'listar-archivos', component: ListarArchivosComponent
      },
      {
        path: 'change-password/:id', component: ChangePasswordComponent
      },
      {
        path: 'crear-parcela', component: CrearParcelaComponent, canActivate: [adminAccessGuard],
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
        path: 'editar-parcela/:referenciaCatastral', component: EditarParcelaComponent, canActivate: [adminAccessGuard],
      },
      {
        path: 'crear-usuario-parcela/:referenciaCatastral', component: CrearUsuarioParcelaComponent, canActivate: [adminAccessGuard],
      },
      {
        path: 'editar-usuario-parcela/:id', component: EditarUsuarioParcelaComponent
      },
      {
        path: 'generar-liquidacion', component: GenerarLiquidacionComponent, canActivate: [adminAccessGuard],
      },
      {
        path: 'listar-liquidaciones', component: ListarLiquidacionesComponent
      },
      {
        path: 'detalles-liquidacion/:id', component: DetallesLiquidacionComponent
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
