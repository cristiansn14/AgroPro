import { CanActivateFn, Router } from '@angular/router';
import { FincaService } from '../service/finca.service';
import { inject } from '@angular/core';
import { catchError, of, Subscription, switchMap } from 'rxjs';
import { TokenService } from '../service/token.service';
import { UsuarioFinca } from '../model/usuario-finca';

export const superAccessGuard: CanActivateFn = (route, state) => {
  const fincaService = inject(FincaService);
  const tokenService = inject(TokenService);
  const router = inject(Router);
  const idUsuario = tokenService.getUserId();

  return fincaService.selectedFinca$.pipe(
    switchMap((fincaId) => {
      if (idUsuario != null && fincaId != null) {
        return fincaService.getUsuarioFincaByUsuarioIdAndFincaId(idUsuario, fincaId).pipe(
          switchMap((usuarioFinca: UsuarioFinca | null) => {
            const rol = usuarioFinca?.rol;
            if (rol === 'SUPERUSUARIO' || rol === 'ADMINISTRADOR') {
              return of(true);
            } else {
              tokenService.logOut();
              router.navigate(['/login']);
              return of(false);
            }
          }),
          catchError(() => {
            tokenService.logOut();
            router.navigate(['/login']);
            return of(false); // En caso de error, no permitir el acceso
          })
        );
      } else {
        tokenService.logOut();
        router.navigate(['/login']);
        return of(false); // Si no hay finca seleccionada o usuario, no permitir el acceso
      }
    }),
    catchError(() => {
      tokenService.logOut();
      router.navigate(['/login']);
      return of(false); // En caso de error, no permitir el acceso
    })
  );
};
