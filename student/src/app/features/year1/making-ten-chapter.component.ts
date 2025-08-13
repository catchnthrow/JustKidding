import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface MakingTenProblem {
  firstNumber: number;
  missingNumber: number; // The answer the kids need to find
  showFirst: boolean; // true = "5 + _ = 10", false = "_ + 5 = 10"
}

@Component({
  selector: 'app-making-ten-chapter',
  templateUrl: './making-ten-chapter.component.html',
  styleUrls: ['./making-ten-chapter.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class MakingTenChapterComponent implements OnInit {
  problems: MakingTenProblem[] = [];
  currentProblemIndex: number = 0;
  correctCount: number = 0;
  totalProblems: number = 0;
  selectedOption: number | null = null;
  answered: boolean = false;
  options: number[] = [];
  showSummary: boolean = false;
  celebrationHtml: string = '';
  currentProblem: MakingTenProblem | null = null;
  showQuestion: boolean = false;
  questionsPerChapter: number = 25;
  
  // Timer functionality
  startTime: Date | null = null;
  timeSpent: string = '';

  ngOnInit(): void {
    this.resetQuiz();
  }

  resetQuiz(): void {
    // Start the timer
    this.startTime = new Date();
    this.timeSpent = '';
    
    this.problems = this.generateMakingTenProblems();
    this.shuffleProblems();
    this.currentProblemIndex = 0;
    this.correctCount = 0;
    this.totalProblems = 0;
    this.showSummary = false;
    this.startFirstProblem();
  }

  startFirstProblem(): void {
    this.currentProblemIndex = 0;
    this.showNextProblem();
  }

  generateMakingTenProblems(): MakingTenProblem[] {
    const problems: MakingTenProblem[] = [];
    
    // Generate all combinations that make 10
    for (let first = 1; first <= 9; first++) {
      const missing = 10 - first;
      if (missing >= 1 && missing <= 9) {
        // Add "first + _ = 10" format
        problems.push({ 
          firstNumber: first, 
          missingNumber: missing, 
          showFirst: true 
        });
        
        // Add "_ + first = 10" format (if different numbers)
        if (first !== missing) {
          problems.push({ 
            firstNumber: first, 
            missingNumber: missing, 
            showFirst: false 
          });
        }
      }
    }
    
    // Duplicate the problems to have enough for 25 questions
    const extendedProblems: MakingTenProblem[] = [];
    while (extendedProblems.length < this.questionsPerChapter) {
      extendedProblems.push(...problems);
    }
    
    return extendedProblems.slice(0, this.questionsPerChapter);
  }

  shuffleProblems(): void {
    // Simple shuffle for making 10 problems
    for (let i = this.problems.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.problems[i], this.problems[j]] = [this.problems[j], this.problems[i]];
    }
  }

  showNextProblem(): void {
    if (this.currentProblemIndex >= this.questionsPerChapter) {
      this.showCompletion();
      return;
    }

    // Reset state for new problem
    this.selectedOption = null;
    this.answered = false;
    this.showQuestion = true;

    // Set current problem
    this.currentProblem = this.problems[this.currentProblemIndex];

    // Generate 4 answer options
    this.generateOptions();
  }

  generateOptions(): void {
    if (!this.currentProblem) return;
    
    const correct = this.currentProblem.missingNumber; // The missing number is the correct answer
    const options: number[] = [correct];
    
    // Generate 3 incorrect options (other single-digit numbers)
    const possibleWrong = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(n => n !== correct);
    
    // Shuffle and pick 3 wrong answers
    for (let i = possibleWrong.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [possibleWrong[i], possibleWrong[j]] = [possibleWrong[j], possibleWrong[i]];
    }
    
    // Take first 3 as wrong answers
    options.push(...possibleWrong.slice(0, 3));
    
    // Shuffle all options
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }
    
    this.options = options;
  }

  selectOption(opt: number): void {
    if (this.answered) return;
    this.selectedOption = opt;
    this.answered = true;
    this.totalProblems++;
    if (this.currentProblem && opt === this.currentProblem.missingNumber) {
      this.correctCount++;
    }
    
    // Automatically advance to next question after 1.5 seconds
    setTimeout(() => {
      this.next();
    }, 1500);
  }

  next(): void {
    if (!this.showQuestion) {
      this.showNextProblem();
      return;
    }

    if (!this.answered) return;

    this.currentProblemIndex++;
    this.showNextProblem();
  }

  isCorrectAnswer(option: number): boolean {
    return !!(this.answered && this.currentProblem && option === this.currentProblem.missingNumber);
  }

  isWrongAnswer(option: number): boolean {
    return !!(this.answered && this.selectedOption === option && this.currentProblem && option !== this.currentProblem.missingNumber);
  }

  showCompletion(): void {
    this.showSummary = true;
    
    // Calculate time spent
    if (this.startTime) {
      this.timeSpent = this.calculateTimeSpent();
    }
    
    const percent = Math.round((this.correctCount / this.totalProblems) * 100);
    if (percent >= 90 && percent < 100) {
      this.celebrationHtml = '<div style="font-size:2em;color:#4caf50;">🌟 Amazing! You did great! 🌈</div>';
    } else if (percent === 100) {
      let icons = '';
      const rainbow = [
        '#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3'
      ];
      for (let i = 0; i < 50; i++) {
        const icon = ['⭐', '❤️', '🎆'][Math.floor(Math.random() * 3)];
        const color = rainbow[Math.floor(Math.random() * rainbow.length)];
        const size = Math.floor(Math.random() * 40) + 30;
        const left = Math.random() * 90;
        const top = Math.random() * 60;
        icons += `<span style="position:absolute;left:${left}vw;top:${top}vh;font-size:${size}px;color:${color};pointer-events:none;">${icon}</span>`;
      }
      this.celebrationHtml = `<div style="position:fixed;left:0;top:0;width:100vw;height:100vh;z-index:9999;pointer-events:none;">${icons}</div><div style="font-size:2em;color:#FF00FF;position:relative;z-index:10000;">🌟 Perfect! All correct! 🌈</div>`;
    } else {
      this.celebrationHtml = '';
    }
  }

  /**
   * Calculates time spent in minutes and seconds
   */
  private calculateTimeSpent(): string {
    if (!this.startTime) return '';
    
    const endTime = new Date();
    const diffMs = endTime.getTime() - this.startTime.getTime();
    const totalSeconds = Math.floor(diffMs / 1000);
    
    if (totalSeconds < 60) {
      // Less than 1 minute - show seconds
      return `${totalSeconds} seconds`;
    } else {
      // 1 minute or more - use ceiling to round up to whole minutes
      const minutes = Math.ceil(totalSeconds / 60);
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`;
    }
  }
}
