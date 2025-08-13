import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MathService, MathQuestion, MathServiceConfig, PerformanceTracker } from '../../shared/services/math.service';

@Component({
  selector: 'app-addition-chapter',
  templateUrl: './addition-chapter.component.html',
  styleUrls: ['./addition-chapter.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule],
  providers: [MathService]
})
export class AdditionChapterComponent implements OnInit {
  questions: MathQuestion[] = [];
  currentQuestionIndex: number = 0;
  correctCount: number = 0;
  totalProblems: number = 0;
  selectedOption: number | null = null;
  answered: boolean = false;
  showSummary: boolean = false;
  celebrationHtml: string = '';
  currentQuestion: MathQuestion | null = null;
  showQuestion: boolean = false;
  questionsPerChapter: number = 25;
  performanceStats: PerformanceTracker | null = null;
  showDifficultyIndicator: boolean = true;
  
  // Timer functionality
  startTime: Date | null = null;
  timeSpent: string = '';

  private mathConfig: MathServiceConfig = {
    maxDigits: 1, // Single digit numbers for Year 1
    difficultyLevel: 'easy', // Starting difficulty (will be adaptive)
    operation: 'addition',
    includeZero: false, // No zero for addition practice
    adaptiveDifficulty: true // Enable adaptive difficulty based on performance
  };

  constructor(private mathService: MathService) {}

  ngOnInit(): void {
    this.resetQuiz();
  }

  resetQuiz(): void {
    // Reset performance tracking for new session
    this.mathService.resetPerformance();
    
    // Start the timer
    this.startTime = new Date();
    this.timeSpent = '';
    
    // Generate fresh random questions using the service
    this.questions = this.mathService.generateQuestionBatch(
      this.mathConfig, 
      this.questionsPerChapter
    );
    
    this.currentQuestionIndex = 0;
    this.correctCount = 0;
    this.totalProblems = 0;
    this.showSummary = false;
    this.performanceStats = null;
    this.startFirstProblem();
  }

  startFirstProblem(): void {
    this.currentQuestionIndex = 0;
    this.showNextProblem();
  }

  showNextProblem(): void {
    // If finished all questions, show completion
    if (this.currentQuestionIndex >= this.questionsPerChapter) {
      this.showCompletion();
      return;
    }

    // Generate a new question using current adaptive difficulty
    this.currentQuestion = this.mathService.generateQuestion(this.mathConfig);
    
    // Reset state for new problem
    this.selectedOption = null;
    this.answered = false;
    this.showQuestion = true;
    
    // Update performance stats display
    this.performanceStats = this.mathService.getPerformanceStats();
  }

  selectOption(opt: number): void {
    if (this.answered) return;
    this.selectedOption = opt;
    this.answered = true;
    this.totalProblems++;
    
    const isCorrect = this.currentQuestion && opt === this.currentQuestion.correctAnswer;
    
    if (isCorrect) {
      this.correctCount++;
    }
    
    // Update performance tracking for adaptive difficulty
    this.mathService.updatePerformance(!!isCorrect);
    this.performanceStats = this.mathService.getPerformanceStats();
    
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

    this.currentQuestionIndex++;
    this.showNextProblem();
  }

  isCorrectAnswer(option: number): boolean {
    return !!(this.answered && this.currentQuestion && option === this.currentQuestion.correctAnswer);
  }

  isWrongAnswer(option: number): boolean {
    return !!(this.answered && this.selectedOption === option && this.currentQuestion && option !== this.currentQuestion.correctAnswer);
  }

  showCompletion(): void {
    this.showSummary = true;
    
    // Calculate time spent in a kid-friendly format
    if (this.startTime) {
      this.timeSpent = this.calculateTimeSpent();
    }
    
    const percent = Math.round((this.correctCount / this.totalProblems) * 100);
    const finalStats = this.mathService.getPerformanceStats();
    
    if (percent >= 90 && percent < 100) {
      const difficultyMessage = finalStats.currentDifficulty !== 'easy' 
        ? ` You've advanced to ${finalStats.currentDifficulty} level! 🚀` 
        : '';
      this.celebrationHtml = `<div style="font-size:2em;color:#4caf50;">🌟 Amazing! You did great! 🌈${difficultyMessage}</div>`;
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
      const difficultyMessage = finalStats.currentDifficulty !== 'easy' 
        ? ` You're now at ${finalStats.currentDifficulty} level! 🚀` 
        : '';
      this.celebrationHtml = `<div style="position:fixed;left:0;top:0;width:100vw;height:100vh;z-index:9999;pointer-events:none;">${icons}</div><div style="font-size:2em;color:#FF00FF;position:relative;z-index:10000;">🌟 Perfect! All correct! 🌈${difficultyMessage}</div>`;
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

  /**
   * Gets difficulty level display name
   */
  getDifficultyDisplayName(): string {
    if (!this.performanceStats) return 'Easy';
    
    switch (this.performanceStats.currentDifficulty) {
      case 'easy': return 'Beginner 🌱';
      case 'medium': return 'Explorer 🌟';
      case 'hard': return 'Champion 🏆';
      default: return 'Easy';
    }
  }

  /**
   * Gets encouraging message based on performance
   */
  getEncouragementMessage(): string {
    if (!this.performanceStats || this.performanceStats.totalAnswered < 3) return '';
    
    const successRate = this.performanceStats.correctAnswers / this.performanceStats.totalAnswered;
    const consecutive = this.performanceStats.consecutiveCorrect;
    
    if (consecutive >= 3) {
      return `🔥 ${consecutive} in a row! You're on fire!`;
    } else if (successRate >= 0.8) {
      return `⭐ Great job! You're doing amazing!`;
    } else if (successRate >= 0.6) {
      return `💪 Keep trying! You're learning!`;
    } else {
      return `🌈 Every answer helps you learn!`;
    }
  }
}
