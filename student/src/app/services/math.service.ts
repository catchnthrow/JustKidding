import { Injectable } from '@angular/core';

export interface MathQuestion {
  firstNumber: number;
  secondNumber: number;
  correctAnswer: number;
  options: number[];
  operation: 'addition' | 'subtraction' | 'multiplication' | 'division';
}

export interface MathServiceConfig {
  maxDigits: number;
  difficultyLevel: 'easy' | 'medium' | 'hard';
  operation: 'addition' | 'subtraction' | 'multiplication' | 'division';
  includeZero: boolean;
  adaptiveDifficulty?: boolean; // Enable adaptive difficulty based on performance
}

export interface PerformanceTracker {
  totalAnswered: number;
  correctAnswers: number;
  consecutiveCorrect: number;
  currentDifficulty: 'easy' | 'medium' | 'hard';
}

@Injectable({
  providedIn: 'root'
})
export class MathService {
  
  private performanceTracker: PerformanceTracker = {
    totalAnswered: 0,
    correctAnswers: 0,
    consecutiveCorrect: 0,
    currentDifficulty: 'easy'
  };

  /**
   * Updates performance and adjusts difficulty based on user success rate
   */
  updatePerformance(isCorrect: boolean): void {
    this.performanceTracker.totalAnswered++;
    
    if (isCorrect) {
      this.performanceTracker.correctAnswers++;
      this.performanceTracker.consecutiveCorrect++;
    } else {
      this.performanceTracker.consecutiveCorrect = 0;
    }
    
    // Adjust difficulty based on performance
    this.adjustDifficulty();
  }

  /**
   * Adjusts difficulty based on recent performance
   */
  private adjustDifficulty(): void {
    const successRate = this.performanceTracker.correctAnswers / this.performanceTracker.totalAnswered;
    const consecutive = this.performanceTracker.consecutiveCorrect;
    
    // Need at least 5 questions to start adjusting
    if (this.performanceTracker.totalAnswered < 5) return;
    
    // Increase difficulty if doing very well
    if (consecutive >= 5 && successRate >= 0.8) {
      if (this.performanceTracker.currentDifficulty === 'easy') {
        this.performanceTracker.currentDifficulty = 'medium';
        this.performanceTracker.consecutiveCorrect = 0; // Reset counter
      } else if (this.performanceTracker.currentDifficulty === 'medium' && consecutive >= 7) {
        this.performanceTracker.currentDifficulty = 'hard';
        this.performanceTracker.consecutiveCorrect = 0;
      }
    }
    
    // Decrease difficulty if struggling
    if (successRate < 0.5 && this.performanceTracker.totalAnswered >= 8) {
      if (this.performanceTracker.currentDifficulty === 'hard') {
        this.performanceTracker.currentDifficulty = 'medium';
      } else if (this.performanceTracker.currentDifficulty === 'medium') {
        this.performanceTracker.currentDifficulty = 'easy';
      }
    }
  }

  /**
   * Gets current performance stats
   */
  getPerformanceStats(): PerformanceTracker {
    return { ...this.performanceTracker };
  }

  /**
   * Resets performance tracking (for new quiz session)
   */
  resetPerformance(): void {
    this.performanceTracker = {
      totalAnswered: 0,
      correctAnswers: 0,
      consecutiveCorrect: 0,
      currentDifficulty: 'easy'
    };
  }

  /**
   * Generates a random math question based on configuration
   */
  generateQuestion(config: MathServiceConfig): MathQuestion {
    // Use adaptive difficulty if enabled
    const actualConfig = { ...config };
    if (config.adaptiveDifficulty) {
      actualConfig.difficultyLevel = this.performanceTracker.currentDifficulty;
    }
    
    switch (actualConfig.operation) {
      case 'addition':
        return this.generateAdditionQuestion(actualConfig);
      case 'subtraction':
        return this.generateSubtractionQuestion(actualConfig);
      default:
        return this.generateAdditionQuestion(actualConfig);
    }
  }

  /**
   * Generates a random addition question with finger-counting friendly numbers
   * Always keeps one number single-digit for finger counting
   */
  private generateAdditionQuestion(config: MathServiceConfig): MathQuestion {
    const { firstNumber, secondNumber } = this.generateFingerFriendlyNumbers(config);
    const correctAnswer = firstNumber + secondNumber;
    
    const options = this.generateOptions(
      firstNumber, 
      secondNumber, 
      correctAnswer, 
      'addition'
    );

    return {
      firstNumber,
      secondNumber,
      correctAnswer,
      options,
      operation: 'addition'
    };
  }

  /**
   * Generates a random subtraction question
   */
  private generateSubtractionQuestion(config: MathServiceConfig): MathQuestion {
    let { firstNumber, secondNumber } = this.generateRandomNumbers(config);
    
    // Ensure first number is larger for positive results
    if (firstNumber < secondNumber) {
      [firstNumber, secondNumber] = [secondNumber, firstNumber];
    }
    
    const correctAnswer = firstNumber - secondNumber;
    
    const options = this.generateOptions(
      firstNumber, 
      secondNumber, 
      correctAnswer, 
      'subtraction'
    );

    return {
      firstNumber,
      secondNumber,
      correctAnswer,
      options,
      operation: 'subtraction'
    };
  }

  /**
   * Generates finger-counting friendly numbers for addition
   * Always ensures one number is single-digit (1-9) for finger counting
   */
  private generateFingerFriendlyNumbers(config: MathServiceConfig): { firstNumber: number; secondNumber: number } {
    const minValue = config.includeZero ? 0 : 1;
    let firstNumber: number;
    let secondNumber: number;

    switch (config.difficultyLevel) {
      case 'easy':
        // Easy: Both numbers single digits (1-5), finger counting friendly
        firstNumber = this.getWeightedRandomNumber(1, 5, 'easy');
        secondNumber = this.getWeightedRandomNumber(1, 5, 'easy');
        break;
      
      case 'medium':
        // Medium: One single digit (1-9), one can be double digit (10-19)
        // But always keep one single digit for finger counting
        const singleDigit = this.getRandomNumber(1, 9);
        const otherNumber = Math.random() < 0.6 
          ? this.getRandomNumber(1, 9)  // 60% chance both single digit
          : this.getRandomNumber(10, 19); // 40% chance one is teens
          
        // Randomly assign which is which
        if (Math.random() < 0.5) {
          firstNumber = singleDigit;
          secondNumber = otherNumber;
        } else {
          firstNumber = otherNumber;
          secondNumber = singleDigit;
        }
        break;
      
      case 'hard':
        // Hard: One single digit (1-9), other can be larger (10-50)
        // Still keep one single digit for finger counting foundation
        const fingerCountDigit = this.getRandomNumber(1, 9);
        const largerNumber = this.getRandomNumber(10, 50);
        
        // Randomly assign which is which
        if (Math.random() < 0.5) {
          firstNumber = fingerCountDigit;
          secondNumber = largerNumber;
        } else {
          firstNumber = largerNumber;
          secondNumber = fingerCountDigit;
        }
        break;
      
      default:
        firstNumber = this.getRandomNumber(1, 5);
        secondNumber = this.getRandomNumber(1, 5);
    }

    return { firstNumber, secondNumber };
  }

  /**
   * Generates truly random numbers based on difficulty and constraints (for non-addition operations)
   */
  private generateRandomNumbers(config: MathServiceConfig): { firstNumber: number; secondNumber: number } {
    const maxValue = this.getMaxValueForDigits(config.maxDigits);
    const minValue = config.includeZero ? 0 : 1;
    
    let firstNumber: number;
    let secondNumber: number;

    switch (config.difficultyLevel) {
      case 'easy':
        // Easy: Single digits, smaller numbers more likely
        firstNumber = this.getWeightedRandomNumber(1, Math.min(5, maxValue), 'easy');
        secondNumber = this.getWeightedRandomNumber(1, Math.min(5, maxValue), 'easy');
        break;
      
      case 'medium':
        // Medium: Mix of single digits and teens
        firstNumber = this.getWeightedRandomNumber(1, Math.min(9, maxValue), 'medium');
        secondNumber = this.getWeightedRandomNumber(1, Math.min(9, maxValue), 'medium');
        break;
      
      case 'hard':
        // Hard: Full range up to max digits
        firstNumber = this.getRandomNumber(minValue, maxValue);
        secondNumber = this.getRandomNumber(minValue, maxValue);
        break;
      
      default:
        firstNumber = this.getRandomNumber(minValue, Math.min(9, maxValue));
        secondNumber = this.getRandomNumber(minValue, Math.min(9, maxValue));
    }

    return { firstNumber, secondNumber };
  }

  /**
   * Gets weighted random number (easier numbers more likely for easier difficulties)
   */
  private getWeightedRandomNumber(min: number, max: number, difficulty: 'easy' | 'medium'): number {
    if (difficulty === 'easy') {
      // For easy, bias towards smaller numbers (1-3 more likely than 4-5)
      const weights = [3, 3, 2, 1, 1]; // weights for 1, 2, 3, 4, 5
      const randomWeight = Math.random() * weights.reduce((a, b) => a + b, 0);
      let cumulative = 0;
      for (let i = 0; i < weights.length && i + min <= max; i++) {
        cumulative += weights[i];
        if (randomWeight <= cumulative) {
          return min + i;
        }
      }
    }
    
    // For medium or if easy logic doesn't apply, use uniform distribution
    return this.getRandomNumber(min, max);
  }

  /**
   * Generates 4 answer options including common mistakes
   */
  private generateOptions(first: number, second: number, correct: number, operation: string): number[] {
    const options: number[] = [correct];
    
    while (options.length < 4) {
      let wrongOption: number;
      const randomType = Math.random();
      
      if (randomType < 0.25) {
        // Type 1: Concatenation error (e.g., 1+5 = 15, 2+3 = 23)
        wrongOption = parseInt(`${first}${second}`);
        
        // If concatenation results in a huge number, try reverse
        if (wrongOption > 100) {
          wrongOption = parseInt(`${second}${first}`);
        }
        
        // If still too big, skip this type
        if (wrongOption > 100) {
          continue;
        }
      } else if (randomType < 0.5) {
        // Type 2: Off by small amount (±1, ±2)
        const offset = Math.floor(Math.random() * 3) + 1; // 1, 2, or 3
        wrongOption = correct + (Math.random() < 0.5 ? offset : -offset);
      } else if (randomType < 0.75) {
        // Type 3: Using only one of the numbers (common kid mistake)
        wrongOption = Math.random() < 0.5 ? first : second;
      } else {
        // Type 4: Random plausible wrong answer
        const range = Math.max(10, correct + 5);
        wrongOption = Math.floor(Math.random() * range) + 1;
      }
      
      // Ensure option is valid and unique
      if (wrongOption > 0 && wrongOption <= 99 && !options.includes(wrongOption)) {
        options.push(wrongOption);
      }
    }
    
    // Shuffle options so correct answer position is random
    return this.shuffleArray(options);
  }

  /**
   * Calculates maximum value based on number of digits
   */
  private getMaxValueForDigits(digits: number): number {
    return Math.pow(10, digits) - 1;
  }

  /**
   * Generates random number between min and max (inclusive)
   */
  private getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Shuffles array using Fisher-Yates algorithm
   */
  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * Generates a batch of unique questions
   */
  generateQuestionBatch(config: MathServiceConfig, count: number): MathQuestion[] {
    const questions: MathQuestion[] = [];
    const usedCombinations = new Set<string>();
    
    let attempts = 0;
    const maxAttempts = count * 10; // Prevent infinite loops
    
    while (questions.length < count && attempts < maxAttempts) {
      const question = this.generateQuestion(config);
      const key = `${question.firstNumber}_${question.secondNumber}_${question.operation}`;
      
      // Ensure uniqueness (but allow different arrangements like 2+3 and 3+2)
      if (!usedCombinations.has(key)) {
        questions.push(question);
        usedCombinations.add(key);
      }
      
      attempts++;
    }
    
    return questions;
  }
}
