import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-addition-chapter',
  templateUrl: './addition-chapter.component.html',
  styleUrls: ['./addition-chapter.component.scss']
})
export class AdditionChapterComponent implements OnInit {
  ngOnInit() {
    // Move the MathPractice logic here
    class MathPractice {
      problems: any[];
      currentProblemIndex = 0;
      correctCount = 0;
      totalProblems = 0;
      currentLevel = 1;
      showingHint = false;
      problemDisplay!: HTMLElement;
      answerInput!: HTMLInputElement;
      feedback!: HTMLElement;
      checkBtn!: HTMLElement;
      nextBtn!: HTMLElement;
      hintBtn!: HTMLElement;
      hintDisplay!: HTMLElement;
      celebration!: HTMLElement;
      correctCountEl!: HTMLElement;
      totalProblemsEl!: HTMLElement;
      currentLevelEl!: HTMLElement;
      progressText!: HTMLElement;
      progressFill!: HTMLElement;

      constructor() {
        this.problems = this.generateAllProblems();
        this.currentProblemIndex = 0;
        this.correctCount = 0;
        this.totalProblems = 0;
        this.currentLevel = 1;
        this.showingHint = false;

        this.initializeElements();
        this.setupEventListeners();
        this.shuffleProblems();
        this.showNextProblem();
      }

      generateAllProblems() {
        const problems = [];
        for (let sum = 0; sum <= 18; sum++) {
          for (let a = 0; a <= 9; a++) {
            for (let b = 0; b <= 9; b++) {
              if (a + b === sum) {
                problems.push({ a, b, answer: sum });
                if (a !== b) {
                  problems.push({ a: b, b: a, answer: sum });
                }
              }
            }
          }
        }
        return problems;
      }

      shuffleProblems() {
        this.problems.sort((a, b) => {
          const diffA = a.a + a.b;
          const diffB = b.a + b.b;
          if (diffA !== diffB) return diffA - diffB;
          return Math.random() - 0.5;
        });
      }

      initializeElements() {
        this.problemDisplay = document.getElementById('problem-display')!;
        this.answerInput = document.getElementById('answer-input') as HTMLInputElement;
        this.feedback = document.getElementById('feedback')!;
        this.checkBtn = document.getElementById('check-btn')!;
        this.nextBtn = document.getElementById('next-btn')!;
        this.hintBtn = document.getElementById('hint-btn')!;
        this.hintDisplay = document.getElementById('hint-display')!;
        this.celebration = document.getElementById('celebration')!;
        this.correctCountEl = document.getElementById('correct-count')!;
        this.totalProblemsEl = document.getElementById('total-problems')!;
        this.currentLevelEl = document.getElementById('current-level')!;
        this.progressText = document.getElementById('progress-text')!;
        this.progressFill = document.getElementById('progress-fill')!;
      }

      setupEventListeners() {
        this.checkBtn.addEventListener('click', () => this.checkAnswer());
        this.nextBtn.addEventListener('click', () => this.showNextProblem());
        this.hintBtn.addEventListener('click', () => this.showHint());

        this.answerInput.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') {
            this.checkAnswer();
          }
        });

        this.answerInput.addEventListener('input', () => {
          this.feedback.textContent = '';
          this.hideHint();
        });
      }

      showNextProblem() {
        if (this.currentProblemIndex >= this.problems.length) {
          this.showCompletion();
          return;
        }

        const problem = this.problems[this.currentProblemIndex];
        this.problemDisplay.textContent = `${problem.a} + ${problem.b} = ?`;
        this.answerInput.value = '';
        this.answerInput.focus();
        this.feedback.textContent = '';
        this.hideHint();

        const sum = problem.a + problem.b;
        this.currentLevel = Math.floor(sum / 3) + 1;
        this.updateStats();
      }

      checkAnswer() {
        const userAnswer = parseInt(this.answerInput.value);
        const problem = this.problems[this.currentProblemIndex];

        if (isNaN(userAnswer)) {
          this.feedback.textContent = 'Please enter a number!';
          this.feedback.className = 'feedback incorrect';
          return;
        }

        this.totalProblems++;

        if (userAnswer === problem.answer) {
          this.correctCount++;
          this.feedback.textContent = '🌟 Excellent! That\'s correct! 🌟';
          this.feedback.className = 'feedback correct';
          this.problemDisplay.classList.add('bounce');

          setTimeout(() => {
            this.problemDisplay.classList.remove('bounce');
          }, 1000);

          if (this.correctCount % 10 === 0) {
            this.showCelebration();
          }
        } else {
          this.feedback.textContent = `Not quite right. The answer is ${problem.answer}. Let's try the next one!`;
          this.feedback.className = 'feedback incorrect';
        }

        this.currentProblemIndex++;
        this.updateStats();

        setTimeout(() => {
          this.showNextProblem();
        }, 2000);
      }

      showHint() {
        const problem = this.problems[this.currentProblemIndex];
        const a = problem.a;
        const b = problem.b;

        let hintText = `Let's count together: `;

        if (a <= 5 && b <= 5) {
          hintText += '🟡'.repeat(a) + ' + ' + '🔵'.repeat(b) + ` = ${a + b}`;
        } else {
          hintText += `Start with ${a}, then count up ${b} more: `;
          for (let i = 1; i <= b; i++) {
            hintText += `${a + i}${i < b ? ', ' : ''}`;
          }
        }

        this.hintDisplay.textContent = hintText;
        this.hintDisplay.style.display = 'block';
        this.showingHint = true;
      }

      hideHint() {
        this.hintDisplay.style.display = 'none';
        this.showingHint = false;
      }

      showCelebration() {
        this.celebration.style.display = 'block';
        setTimeout(() => {
          this.celebration.style.display = 'none';
        }, 3000);
      }

      updateStats() {
        this.correctCountEl.textContent = this.correctCount.toString();
        this.totalProblemsEl.textContent = this.totalProblems.toString();
        this.currentLevelEl.textContent = this.currentLevel.toString();

        const progress = Math.min((this.currentProblemIndex / this.problems.length) * 100, 100);
        this.progressText.textContent = `${this.currentProblemIndex}/${this.problems.length}`;
        (this.progressFill as HTMLElement).style.width = `${progress}%`;
      }

      showCompletion() {
        this.problemDisplay.innerHTML = `
          🎉 Congratulations! 🎉<br>
          You've completed all addition problems!<br>
          <small>You got ${this.correctCount} out of ${this.totalProblems} correct!</small>
        `;
        this.answerInput.style.display = 'none';
        this.checkBtn.style.display = 'none';
        this.nextBtn.textContent = 'Start Over';
        this.nextBtn.onclick = () => location.reload();
      }
    }

    new MathPractice();
  }
}
