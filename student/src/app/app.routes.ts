import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/year1/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'addition-chapter',
    loadComponent: () => import('./features/year1/addition-chapter.component').then(m => m.AdditionChapterComponent)
  },
  {
    path: 'making-ten-chapter',
    loadComponent: () => import('./features/year1/making-ten-chapter.component').then(m => m.MakingTenChapterComponent)
  },
  {
    path: 'number-pairs-chapter',
    loadComponent: () => import('./features/year1/number-pairs-chapter.component').then(m => m.NumberPairsChapterComponent)
  },
  {
    path: 'puzzle-pairs-chapter',
    loadComponent: () => import('./features/year1/puzzle-pairs-chapter.component').then(m => m.PuzzlePairsChapterComponent)
  }
];
