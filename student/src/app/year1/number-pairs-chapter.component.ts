import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface NumberPair {
  first: number;
  second: number;
  discovered: boolean;
}

@Component({
  selector: 'app-number-pairs-chapter',
  templateUrl: './number-pairs-chapter.component.html',
  styleUrls: ['./number-pairs-chapter.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class NumberPairsChapterComponent implements OnInit {
  // Visual display arrays for the 10 unicorns (just for display)
  topNumbers: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  bottomNumbers: number[] = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
  
  // Current problem state
  currentFirst: number = 0;
  currentSecond: number = 0;
  userAnswer: number = 0;
  showFeedback: boolean = false;
  isCorrect: boolean = false;
  
  // Answer options - only 4 choices
  answerOptions: number[] = [];
  
  // Highlighted states for visual feedback (how many unicorns to highlight)
  highlightedCount: number = 0; // How many unicorns to highlight from the left
  
  // Discovered pairs tracking
  discoveredPairs: NumberPair[] = [];
  
  // Feedback and encouragement
  feedbackMessage: string = '';
  physicalActivity: string = '';
  showPhysicalActivity: boolean = false;
  
  // Animation states
  showAnimation: boolean = false;
  animatingPair: NumberPair | null = null;
  
  // Social-emotional prompts
  socialPrompts: string[] = [
    "🌟 Great job! Remember to share your excitement with others!",
    "💪 You're being so brave by trying new problems!",
    "🤝 Learning together is always more fun - ask someone to watch you!",
    "❤️ Be proud of yourself for working so hard!",
    "🌈 Every mistake helps you learn something new!",
    "⭐ You're becoming a math star! Keep shining!"
  ];
  
  // Physical activities for kinesthetic learning
  physicalActivities: string[] = [
    "Clap {first} times and then {second} more to make 10!",
    "Jump {first} times, then hop {second} times!",
    "Touch {first} things around you, then {second} more!",
    "Count to {first} on your fingers, then add {second} more!",
    "Take {first} big steps, then {second} tiny steps!",
    "Wiggle {first} fingers, then {second} toes!"
  ];

  ngOnInit(): void {
    this.generateNewProblem();
  }

    /**
   * Generates a new addition problem with numbers that sum to 10
   */
  generateNewProblem(): void {
    // Pick a random first number (1-9, not 10 since 10+0=10 is too easy)
    this.currentFirst = Math.floor(Math.random() * 9) + 1;
    this.currentSecond = 10 - this.currentFirst;
    this.userAnswer = 0;
    this.showFeedback = false;
    
    // Generate 4 answer options
    this.generateAnswerOptions();
    
    // Show visual representation
    this.showVisualPairs();
    
    // Clear any previous feedback
    this.isCorrect = false;
  }

  /**
   * Generates 4 answer options including the correct answer
   */
  generateAnswerOptions(): void {
    const correct = this.currentSecond;
    const options = new Set<number>();
    options.add(correct);
    
    // Generate 3 wrong answers (1-9, excluding correct)
    while (options.size < 4) {
      const wrongAnswer = Math.floor(Math.random() * 9) + 1;
      if (wrongAnswer !== correct) {
        options.add(wrongAnswer);
      }
    }
    
    // Convert to array and shuffle
    this.answerOptions = Array.from(options);
    for (let i = this.answerOptions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.answerOptions[i], this.answerOptions[j]] = [this.answerOptions[j], this.answerOptions[i]];
    }
  }

  /**
   * Handles number selection from the visual display
   */
  selectNumber(number: number): void {
    this.userAnswer = number;
    this.checkAnswer();
  }

  /**
   * Checks if the user's answer is correct and provides feedback
   */
  checkAnswer(): void {
    this.isCorrect = this.userAnswer === this.currentSecond;
    this.showFeedback = true;
    
    if (this.isCorrect) {
      this.handleCorrectAnswer();
      
      // Auto-advance to next question after 2 seconds
      setTimeout(() => {
        if (this.discoveredPairs.length >= 9) {
          // All pairs discovered!
          this.showAllPairsCompleted();
        } else {
          this.generateNewProblem();
        }
      }, 2000);
    } else {
      this.handleIncorrectAnswer();
      
      // Show new question after 1.5 seconds (don't count wrong answers)
      setTimeout(() => {
        this.generateNewProblem();
      }, 1500);
    }
  }

  /**
   * Handles correct answer with celebration and pair discovery
   */
  private handleCorrectAnswer(): void {
    // Add to discovered pairs if not already found
    const pairExists = this.discoveredPairs.some(
      pair => (pair.first === this.currentFirst && pair.second === this.currentSecond) ||
              (pair.first === this.currentSecond && pair.second === this.currentFirst)
    );
    
    if (!pairExists) {
      this.discoveredPairs.push({
        first: this.currentFirst,
        second: this.currentSecond,
        discovered: true
      });
    }
    
    // Show success feedback
    this.feedbackMessage = this.getSuccessFeedback();
    
    // Animate the connection between pairs
    this.animatePairConnection();
    
    // Show social-emotional prompt occasionally
    if (Math.random() < 0.4) { // 40% chance
      setTimeout(() => {
        this.showSocialPrompt();
      }, 2000);
    }
  }

  /**
   * Handles incorrect answer with gentle encouragement
   */
  private handleIncorrectAnswer(): void {
    this.feedbackMessage = "Try again! �";
  }

  /**
   * Shows completion celebration when all pairs are discovered
   */
  private showAllPairsCompleted(): void {
    // This will be shown in the template when discoveredPairs.length === 9
    this.feedbackMessage = "🎊 Amazing! You found ALL the pairs! 🎊";
  }

  /**
   * Shows visual representation of the number pairs with highlighting
   */
  private showVisualPairs(): void {
    // Set how many unicorns should be highlighted from the left
    // For example, if currentFirst is 3, highlight first 3 unicorns
    this.highlightedCount = this.currentFirst;
  }

  /**
   * Checks if a specific unicorn should be highlighted
   */
  isHighlighted(index: number): boolean {
    return index < this.highlightedCount;
  }

  /**
   * Animates the connection between discovered pairs
   */
  private animatePairConnection(): void {
    this.showAnimation = true;
    this.animatingPair = {
      first: this.currentFirst,
      second: this.currentSecond,
      discovered: true
    };
    
    // Stop animation after 2 seconds
    setTimeout(() => {
      this.showAnimation = false;
      this.animatingPair = null;
    }, 2000);
  }

  /**
   * Shows a physical activity prompt for kinesthetic learning
   */
  private showPhysicalActivityPrompt(): void {
    const activity = this.physicalActivities[Math.floor(Math.random() * this.physicalActivities.length)];
    this.physicalActivity = activity
      .replace('{first}', this.currentFirst.toString())
      .replace('{second}', this.currentSecond.toString());
    this.showPhysicalActivity = true;
  }

  /**
   * Shows a social-emotional prompt
   */
  private showSocialPrompt(): void {
    const prompt = this.socialPrompts[Math.floor(Math.random() * this.socialPrompts.length)];
    this.feedbackMessage = prompt;
  }

  /**
   * Gets a random success feedback message
   */
  private getSuccessFeedback(): string {
    const celebrations = [
      `🎉 Fantastic! ${this.currentFirst} + ${this.currentSecond} = 10! You're amazing!`,
      `⭐ Perfect! You found the pair! ${this.currentFirst} and ${this.currentSecond} make 10!`,
      `🌟 Brilliant! You're getting so good at making 10!`,
      `🎈 Wonderful! ${this.currentFirst} + ${this.currentSecond} = 10! Keep going!`,
      `🦋 Beautiful work! You discovered another pair that makes 10!`,
      `🌈 Excellent! You're becoming a number detective!`,
      `💫 Outstanding! Say it out loud: '${this.currentFirst} plus ${this.currentSecond} equals 10!'`
    ];
    
    return celebrations[Math.floor(Math.random() * celebrations.length)];
  }

  /**
   * Resets the game to start fresh
   */
  resetGame(): void {
    this.discoveredPairs = [];
    this.showFeedback = false;
    this.showPhysicalActivity = false;
    this.highlightedCount = 0;
    this.generateNewProblem();
  }

  /**
   * Checks if a specific pair has been discovered
   */
  isPairDiscovered(first: number, second: number): boolean {
    return this.discoveredPairs.some(
      pair => (pair.first === first && pair.second === second) ||
              (pair.first === second && pair.second === first)
    );
  }

  /**
   * Gets the completion percentage
   */
  getCompletionPercentage(): number {
    return Math.round((this.discoveredPairs.length / 9) * 100); // 9 possible pairs (1+9, 2+8, ..., 9+1)
  }

  /**
   * Dismisses the physical activity prompt
   */
  dismissPhysicalActivity(): void {
    this.showPhysicalActivity = false;
  }
}
