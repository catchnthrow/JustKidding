import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class HomeComponent {
  chapters = [
    {
      id: 1,
      title: 'Addition Practice',
      description: 'Practice adding numbers from 1 to 9',
      route: '/addition-chapter',
      icon: '➕'
    },
    {
      id: 2,
      title: 'Making 10',
      description: 'Learn to make sums that equal 10',
      route: '/making-ten-chapter',
      icon: '🔟'
    },
    {
      id: 3,
      title: 'Number Pairs to 10',
      description: 'Discover all pairs that make 10 with fun activities!',
      route: '/number-pairs-chapter',
      icon: '👫'
    }
  ];
}
