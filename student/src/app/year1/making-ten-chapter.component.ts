import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-making-ten-chapter',
  templateUrl: './making-ten-chapter.component.html',
  styleUrls: ['./making-ten-chapter.component.scss'],
  standalone: true,
  imports: [CommonModule, DecimalPipe, RouterModule]
})
export class MakingTenChapterComponent implements OnInit {
  problems: { a: number; b: number; answer: number }[] = [];
  currentProblemIndex: number = 0;
  correctCount: number = 0;
  totalProblems: number = 0;
  selectedOption: number | null = null;
  answered: boolean = false;
  options: number[] = [];
  showSummary: boolean = false;
  celebrationHtml: string = '';
  currentProblem: { a: number; b: number; answer: number } | null = null;
  showQuestion: boolean = false;
  questionsPerChapter: number = 25;

  ngOnInit(): void {
    this.resetQuiz();
  }

  resetQuiz(): void {
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

  generateMakingTenProblems(): { a: number; b: number; answer: number }[] {
    const problems: { a: number; b: number; answer: number }[] = [];
    
    // Generate all combinations that make 10
    for (let a = 1; a <= 9; a++) {
      const b = 10 - a;
      if (b >= 1 && b <= 9) {
        // Add the problem
        problems.push({ a, b, answer: 10 });
        // Add swapped version if different
        if (a !== b) {
          problems.push({ a: b, b: a, answer: 10 });
        }
      }
    }
    
    // Duplicate the problems to have enough for 25 questions
    const extendedProblems: { a: number; b: number; answer: number }[] = [];
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
    
    const correct = 10; // Always 10 for this chapter
    const options: number[] = [correct];
    
    // Generate 3 incorrect options
    const wrongAnswers = [8, 9, 11, 12, 7, 13, 6, 14];
    while (options.length < 4) {
      const wrongAnswer = wrongAnswers[Math.floor(Math.random() * wrongAnswers.length)];
      if (!options.includes(wrongAnswer)) {
        options.push(wrongAnswer);
      }
    }
    
    // Shuffle options
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
    if (this.currentProblem && opt === this.currentProblem.answer) {
      this.correctCount++;
    }
    
    // Automatically advance to next question after 1 second
    setTimeout(() => {
      this.next();
    }, 1000);
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
    return !!(this.answered && this.currentProblem && option === this.currentProblem.answer);
  }

  isWrongAnswer(option: number): boolean {
    return !!(this.answered && this.selectedOption === option && this.currentProblem && option !== this.currentProblem.answer);
  }

  showCompletion(): void {
    this.showSummary = true;
    const percent = Math.round((this.correctCount / this.totalProblems) * 100);
    if (percent >= 90 && percent < 100) {
      this.celebrationHtml = '<div style="font-size:2em;color:#4caf50;">🌟 Amazing! You got over 90% correct! 🌈</div>';
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
      this.celebrationHtml = `<div style="position:fixed;left:0;top:0;width:100vw;height:100vh;z-index:9999;pointer-events:none;">${icons}</div><div style="font-size:2em;color:#FF00FF;position:relative;z-index:10000;">🌟 Perfect! 100% correct! 🌈</div>`;
    } else {
      this.celebrationHtml = '';
    }
  }
}
