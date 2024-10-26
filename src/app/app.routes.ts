import { Routes } from '@angular/router';
import { FormComponent } from './form/form.component';
import { ListComponent } from './list/list.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { DetailComponent } from './detail/detail.component';
import { ReportsComponent } from './reports/reports.component';
import { roleGuard } from './guard';
import { LoginComponent } from './login/login.component';
import { AccessDeniedComponent } from './access-denied/access-denied.component';

export const routes: Routes = [
    {
        path: 'form',
        component: FormComponent,
        canActivate: [roleGuard],
        data: { role: 'EDITOR' }
    },
    {
        path: 'form/:id', component: FormComponent, canActivate: [roleGuard],
        data: { role: 'EDITOR' }
    },
    {
        path: 'detail/:id', component: DetailComponent
    },
    {
        path: 'access-denied', component: AccessDeniedComponent
    },
    {
        path: 'list', component: ListComponent
    },
    {
        path: 'reports', loadComponent: () => import('./reports/reports.component').then(r => r.ReportsComponent),
        data: { role: 'ADMIN' }
    },
    {
        path: 'login', component: LoginComponent
    },
    {
        path: '', component: ListComponent
    },
    {
        path: '**', component: NotFoundComponent
    },

];
