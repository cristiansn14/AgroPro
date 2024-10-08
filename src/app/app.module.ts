import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthComponent } from './auth/auth.component';
import {MatMenuModule} from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import {MatStepperModule} from '@angular/material/stepper';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { CrearUsuarioComponent } from './usuario/crear-usuario/crear-usuario.component';
import { EditarUsuarioComponent } from './usuario/editar-usuario/editar-usuario.component';
import { CrearFincaComponent } from './finca/crear-finca/crear-finca.component';
import { DetallesUsuarioComponent } from './usuario/detalles-usuario/detalles-usuario.component';
import { CrearParcelaComponent } from './parcela/crear-parcela/crear-parcela.component';
import { HomeComponent } from './home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { AddUsuarioComponent } from './finca/añadir-usuario/add-usuario.component';
import {MatSelectModule} from '@angular/material/select';
import { DetallesParcelaComponent } from './parcela/detalles-parcela/detalles-parcela.component';
import { CrearMovimientoComponent } from './movimientos/crear-movimiento/crear-movimiento.component';
import { ListarMovimientosComponent } from './movimientos/listar-movimientos/listar-movimientos.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { DetallesFincaComponent } from './finca/detalles-finca/detalles-finca.component';
import { EditarFincaComponent } from './finca/editar-finca/editar-finca.component';
import { CrearRepresentanteComponent } from './usuario/crear-representante/crear-representante.component';
import { EditarUsuarioFincaComponent } from './finca/editar-usuario-finca/editar-usuario-finca.component';
import { EditarRepresentanteComponent } from './usuario/editar-representante/editar-representante.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { EditarParcelaComponent } from './parcela/editar-parcela/editar-parcela.component';
import { EditarUsuarioParcelaComponent } from './parcela/editar-usuario-parcela/editar-usuario-parcela.component';
import { CrearUsuarioParcelaComponent } from './parcela/crear-usuario-parcela/crear-usuario-parcela.component';
import { ChangePasswordComponent } from './usuario/cambiar-contraseña/change-password.component';
import { GenerarLiquidacionComponent } from './liquidacion/generar-liquidacion/generar-liquidacion.component';
import { ListarLiquidacionesComponent } from './liquidacion/listar-liquidaciones/listar-liquidaciones.component';
import { DetallesLiquidacionComponent } from './liquidacion/detalles-liquidacion/detalles-liquidacion.component';
import { MatSortModule } from '@angular/material/sort';
import { ListarUsuariosComponent } from './usuario/listar-usuarios/listar-usuarios.component';
import { ListarArchivosComponent } from './finca/listar-archivos/listar-archivos.component';
import { ListarFincasComponent } from './finca/listar-fincas/listar-fincas.component';


@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    AuthComponent,
    CrearUsuarioComponent,
    EditarUsuarioComponent,
    CrearFincaComponent,
    DetallesUsuarioComponent,
    CrearParcelaComponent,
    HomeComponent,
    AddUsuarioComponent,
    DetallesParcelaComponent,
    CrearMovimientoComponent,
    ListarMovimientosComponent,
    DetallesFincaComponent,
    EditarFincaComponent,
    CrearRepresentanteComponent,
    EditarUsuarioFincaComponent,
    EditarRepresentanteComponent,
    EditarParcelaComponent,
    EditarUsuarioParcelaComponent,
    CrearUsuarioParcelaComponent,
    ChangePasswordComponent,
    GenerarLiquidacionComponent,
    ListarLiquidacionesComponent,
    DetallesLiquidacionComponent,
    ListarUsuariosComponent,
    ListarArchivosComponent,
    ListarFincasComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    HttpClientModule,
    NgbModule,
    CommonModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatDividerModule,
    MatButtonModule,
    MatSelectModule,
    MatMenuModule,
    FormsModule,
    MatStepperModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatTableModule,
    GoogleMapsModule,
    MatSortModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
