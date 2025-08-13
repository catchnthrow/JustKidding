import { Routes } from '@angular/router';

// Year 1 routes for lazy loading
export const year1Routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home.component').then(m => m.HomeComponent)
  },
  {
    path: 'addition-chapter',
    loadComponent: () => import('./addition-chapter.component').then(m => m.AdditionChapterComponent)
  },
  {
    path: 'making-ten-chapter',
    loadComponent: () => import('./making-ten-chapter.component').then(m => m.MakingTenChapterComponent)
  },
  {
    path: 'number-pairs-chapter',
    loadComponent: () => import('./number-pairs-chapter.component').then(m => m.NumberPairsChapterComponent)
  }
];
