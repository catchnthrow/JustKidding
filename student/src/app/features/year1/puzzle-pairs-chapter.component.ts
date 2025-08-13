import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface PuzzleTile {
  number: number;
  colorPattern: string; // Color pattern for visual identification
}

interface QuestionTile extends PuzzleTile {
  correctAnswer: number;
  correctColorPattern: string;
}

interface AnswerOption extends PuzzleTile {
  isCorrect: boolean;
  willFit: boolean;
}

interface PuzzleQuestion {
  id: number;
  questionTile: QuestionTile;
  answerOptions: AnswerOption[];
  selectedOption?: AnswerOption;
  isAnswered: boolean;
  isCorrect: boolean;
}

@Component({
  selector: 'app-puzzle-pairs-chapter',
  templateUrl: './puzzle-pairs-chapter.component.html',
  styleUrls: ['./puzzle-pairs-chapter.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class PuzzlePairsChapterComponent implements OnInit {
  Math = Math; // Expose Math for template use
  currentQuestion: PuzzleQuestion | null = null;
  questionIndex: number = 0;
  totalQuestions: number = 5;
  score: number = 0;
  showResult: boolean = false;
  showCelebration: boolean = false;
  selectedTile: AnswerOption | null = null;
  attemptingFit: boolean = false;
  fitResult: 'success' | 'fail' | null = null;
  processingAnswer: boolean = false; // Flag to disable interactions during feedback
  answered: boolean = false; // Flag to show feedback animations

  // All possible pairs that make 10
  private numberPairs = [
    [1, 9], [2, 8], [3, 7], [4, 6], [5, 5],
    [9, 1], [8, 2], [7, 3], [6, 4]
  ];

  ngOnInit() {
    this.startGame();
  }

  startGame() {
    this.questionIndex = 0;
    this.score = 0;
    this.showResult = false;
    this.showCelebration = false;
    this.generateQuestion();
  }

  generateQuestion() {
    if (this.questionIndex >= this.totalQuestions) {
      this.endGame();
      return;
    }

    // Pick a random pair
    const randomPair = this.numberPairs[Math.floor(Math.random() * this.numberPairs.length)];
    const questionNumber = randomPair[0];
    const correctAnswer = randomPair[1];

    // Create the question tile with color pattern
    const questionColorPattern = this.getColorPattern(questionNumber);
    const correctColorPattern = this.getColorPattern(correctAnswer);

    const questionTile: QuestionTile = {
      number: questionNumber,
      colorPattern: questionColorPattern,
      correctAnswer: correctAnswer,
      correctColorPattern: correctColorPattern
    };

    // Generate answer options (one correct, three incorrect)
    const answerOptions: AnswerOption[] = [];
    
    // Add the correct answer
    answerOptions.push({
      number: correctAnswer,
      colorPattern: correctColorPattern,
      isCorrect: true,
      willFit: true
    });

    // Add three incorrect options
    const usedNumbers = new Set([questionNumber, correctAnswer]);
    while (answerOptions.length < 4) {
      const randomNumber = Math.floor(Math.random() * 9) + 1;
      if (!usedNumbers.has(randomNumber)) {
        answerOptions.push({
          number: randomNumber,
          colorPattern: this.getColorPattern(randomNumber),
          isCorrect: false,
          willFit: this.canPairByColor(questionNumber, randomNumber)
        });
        usedNumbers.add(randomNumber);
      }
    }

    // Shuffle the answer options
    this.shuffleArray(answerOptions);

    this.currentQuestion = {
      id: this.questionIndex + 1,
      questionTile,
      answerOptions,
      isAnswered: false,
      isCorrect: false
    };

    this.selectedTile = null;
    this.fitResult = null;
  }

  getColorPattern(number: number): string {
    // Color-based pairing logic for numbers that make 10
    const colorMap: { [key: number]: string } = {
      1: 'red',    // pairs with 9
      2: 'orange', // pairs with 8  
      3: 'yellow', // pairs with 7
      4: 'green',  // pairs with 6
      5: 'blue',   // pairs with 5
      6: 'green',  // pairs with 4
      7: 'yellow', // pairs with 3
      8: 'orange', // pairs with 2
      9: 'red'     // pairs with 1
    };
    
    return colorMap[number] || 'gray';
  }

  canPairByColor(num1: number, num2: number): boolean {
    // Numbers can pair if they have the same color AND add up to 10
    return this.getColorPattern(num1) === this.getColorPattern(num2) && 
           (num1 + num2 === 10);
  }

  selectAnswerTile(option: AnswerOption) {
    if (this.answered || this.processingAnswer) return;
    
    this.selectedTile = option;
    this.answered = true;
    this.processingAnswer = true;
    
    const isCorrect = option.willFit;
    
    if (isCorrect) {
      this.score++;
      this.handleCorrectAnswer();
    } else {
      this.handleIncorrectAnswer();
    }
  }

  // Remove tryFitTiles method as we don't need the button anymore
  
  isCorrectAnswer(option: AnswerOption): boolean {
    return !!(this.answered && this.selectedTile === option && option.willFit);
  }

  isWrongAnswer(option: AnswerOption): boolean {
    return !!(this.answered && this.selectedTile === option && !option.willFit);
  }

  handleCorrectAnswer() {
    if (!this.currentQuestion || !this.selectedTile) return;

    this.currentQuestion.isAnswered = true;
    this.currentQuestion.isCorrect = true;
    this.currentQuestion.selectedOption = this.selectedTile;
    this.fitResult = 'success';

    this.playSuccessSound();
    
    // Automatically move to next question after 1.5 seconds (same as addition component)
    setTimeout(() => {
      this.nextQuestion();
    }, 1500);
  }

  handleIncorrectAnswer() {
    if (!this.currentQuestion) return;

    this.fitResult = 'fail';
    this.playErrorSound();
    
    // Reset selection after showing the failure animation (same as addition component)
    setTimeout(() => {
      this.selectedTile = null;
      this.fitResult = null;
      this.processingAnswer = false;
      this.answered = false;
    }, 1500);
  }

  nextQuestion() {
    this.questionIndex++;
    this.answered = false;
    this.processingAnswer = false;
    this.fitResult = null;
    this.generateQuestion();
  }

  endGame() {
    this.showResult = true;
    if (this.score === this.totalQuestions) {
      this.showCelebration = true;
      this.playVictorySound();
    }
  }

  shuffleArray<T>(array: T[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  playSuccessSound() {
    this.playTone([523.25, 659.25], 0.3, 0.5); // C5, E5
  }

  playErrorSound() {
    this.playTone([220], 0.3, 0.3); // A3
  }

  playVictorySound() {
    this.playTone([523.25, 659.25, 783.99, 1046.5], 0.4, 1.0); // C5, E5, G5, C6
  }

  private playTone(frequencies: number[], volume: number, duration: number) {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      frequencies.forEach((freq, index) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(freq, audioContext.currentTime + index * 0.1);
        gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
        
        oscillator.start(audioContext.currentTime + index * 0.1);
        oscillator.stop(audioContext.currentTime + duration);
      });
    } catch (error) {
      console.log('Audio not supported');
    }
  }

  resetGame() {
    this.startGame();
  }

  getTileClasses(tile: PuzzleTile | AnswerOption): string {
    let classes = `puzzle-tile`;
    
    // Add color pattern data attribute for CSS styling
    if ('isCorrect' in tile) {
      const answerTile = tile as AnswerOption;
      if (this.selectedTile === answerTile) {
        classes += ' selected';
      }
      if (!answerTile.willFit && this.selectedTile === answerTile && this.fitResult === 'fail') {
        classes += ' rejected';
      }
    }
    
    return classes;
  }

  getQuestionTileClasses(): string {
    let classes = 'puzzle-tile question-tile';
    
    if (this.attemptingFit) {
      classes += ' attempting-fit';
    }
    
    if (this.fitResult === 'success') {
      classes += ' fit-success';
    }
    
    return classes;
  }

  getProgressPercentage(): number {
    return (this.questionIndex / this.totalQuestions) * 100;
  }
}
