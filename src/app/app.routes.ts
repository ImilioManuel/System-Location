import { Routes } from '@angular/router';
import { ChurchFormComponent } from './components/church-form/church-form.component';
import { ChurchMapComponent } from './components/church-map/church-map.component';
import { ChurchSearchComponent } from './components/church-search/church-search.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { AdminComponent } from './components/admin/admin.component';
import { authGuard } from './services/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'cadastro', component: ChurchFormComponent },
  { path: 'mapa', component: ChurchMapComponent },
  { path: 'busca', component: ChurchSearchComponent },
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: AdminComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];
