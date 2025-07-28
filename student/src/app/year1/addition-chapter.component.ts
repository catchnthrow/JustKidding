import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-addition-chapter',
  templateUrl: './addition-chapter.component.html',
  styleUrls: ['./addition-chapter.component.scss'],
  standalone: true,
  imports: [CommonModule, DecimalPipe, RouterModule]
})
export class AdditionChapterComponent implements OnInit {
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
  maxQuestions: number = 25;
  chapterResults: { correct: number; total: number }[] = [];
  showFinalSummary: boolean = false;

  ngOnInit(): void {
    this.resetQuiz();
  }

  resetQuiz(): void {
    this.problems = this.generateAllProblems();
    this.shuffleProblems();
    this.currentProblemIndex = 0;
    this.correctCount = 0;
    this.totalProblems = 0;
    this.chapterResults = [];
    this.showSummary = false;
    this.showFinalSummary = false;
    this.startFirstProblem();
  }

  startFirstProblem(): void {
    this.currentProblemIndex = 0;
    this.showNextProblem();
  }

  generateAllProblems(): { a: number; b: number; answer: number }[] {
    const problems: { a: number; b: number; answer: number }[] = [];
    
    // Generate problems from easy (sum = 2) to hard (sum = 18), excluding zero
    for (let sum = 2; sum <= 18; sum++) {
      for (let a = 1; a <= 9; a++) {
        const b = sum - a;
        if (b >= 1 && b <= 9) {
          // Add the problem
          problems.push({ a, b, answer: sum });
          // Add swapped version if different (to show sequence doesn't matter)
          if (a !== b) {
            problems.push({ a: b, b: a, answer: sum });
          }
        }
      }
    }
    return problems;
  }

  shuffleProblems(): void {
    // Group problems by difficulty level (sum) to reduce repetition
    const problemGroups: { [key: number]: { a: number; b: number; answer: number }[] } = {};
    
    // Group problems by their sum
    this.problems.forEach(problem => {
      const sum = problem.a + problem.b;
      if (!problemGroups[sum]) {
        problemGroups[sum] = [];
      }
      problemGroups[sum].push(problem);
    });
    
    // Shuffle problems within each group
    Object.keys(problemGroups).forEach(sum => {
      const group = problemGroups[parseInt(sum)];
      for (let i = group.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [group[i], group[j]] = [group[j], group[i]];
      }
    });
    
    // Create the final shuffled array by interleaving different difficulty levels
    const shuffled: { a: number; b: number; answer: number }[] = [];
    const sums = Object.keys(problemGroups).map(Number).sort((a, b) => a - b);
    
    // Track how many problems we've taken from each group
    const groupIndices: { [key: number]: number } = {};
    sums.forEach(sum => groupIndices[sum] = 0);
    
    // Interleave problems from different groups to reduce repetition
    let currentSumIndex = 0;
    while (shuffled.length < this.problems.length) {
      const currentSum = sums[currentSumIndex];
      const group = problemGroups[currentSum];
      
      if (groupIndices[currentSum] < group.length) {
        shuffled.push(group[groupIndices[currentSum]]);
        groupIndices[currentSum]++;
      }
      
      // Move to next difficulty level, cycling back to start
      currentSumIndex = (currentSumIndex + 1) % sums.length;
      
      // If we've completed a full cycle, add some randomness
      if (currentSumIndex === 0 && shuffled.length < this.problems.length) {
        // Occasionally skip ahead to create more variety
        if (Math.random() < 0.3) {
          currentSumIndex = Math.floor(Math.random() * sums.length);
        }
      }
    }
    
    this.problems = shuffled;
  }

  showNextProblem(): void {
    // If finished all questions, show final summary
    if (this.currentProblemIndex >= this.questionsPerChapter) {
      this.showCompletion();
      return;
    }

    // Reset state for new problem
    this.selectedOption = null;
    this.answered = false;
    this.showQuestion = true;

    // Set current problem
    this.currentProblem = this.problems[this.currentProblemIndex % this.problems.length];

    // Generate 4 answer options
    this.generateOptions();
  }

  generateOptions(): void {
    if (!this.currentProblem) return;
    
    const correct = this.currentProblem.answer;
    const options: number[] = [correct];
    
    // Generate 3 incorrect options that are plausible wrong answers
    while (options.length < 4) {
      let opt: number;
      
      if (Math.random() < 0.6) {
        // Generate common mistakes: off by ±1, ±2, or ±3
        const offset = Math.floor(Math.random() * 6) + 1; // 1-6
        opt = correct + (Math.random() < 0.5 ? offset : -offset);
      } else if (Math.random() < 0.3) {
        // Generate "one number off" mistakes (e.g., for 3+4=7, show 6 or 8)
        const mistakes = [this.currentProblem.a, this.currentProblem.b];
        opt = mistakes[Math.floor(Math.random() * mistakes.length)];
      } else {
        // Random option in reasonable range
        opt = Math.floor(Math.random() * 17) + 2; // 2-18 (no zero)
      }
      
      // Ensure option is valid and unique
      if (opt >= 2 && opt <= 18 && !options.includes(opt)) {
        options.push(opt);
      }
    }
    
    // Shuffle options so correct answer isn't always in same position
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

  getTotalCorrect(): number {
    return this.chapterResults.reduce((acc, r) => acc + r.correct, 0);
  }
}
