import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./year1/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'addition-chapter',
    loadComponent: () => import('./year1/addition-chapter.component').then(m => m.AdditionChapterComponent)
  },
  {
    path: 'making-ten-chapter',
    loadComponent: () => import('./year1/making-ten-chapter.component').then(m => m.MakingTenChapterComponent)
  }
];
