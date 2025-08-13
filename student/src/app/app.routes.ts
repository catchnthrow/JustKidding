import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/year1').then(m => m.year1Routes)
  },
  {
    path: 'year1',
    loadChildren: () => import('./features/year1').then(m => m.year1Routes)
  }
];
