import { Component } from '@angular/core';
import { Topic } from '../../../models/topic';
import { Question } from '../../../models/question';
import { Questionservice } from '../../../services/questionservice';
import { Topicservice } from '../../../services/topicservice';

@Component({
  selector: 'app-studyquestioncomponent',
  standalone: false,
  templateUrl: './studyquestioncomponent.html',
  styleUrls: ['./studyquestioncomponent.scss'],
})
export class Studyquestioncomponent {

  topics: Topic[] = [];
  selectedTopicId!: number;

  questions: any[] = [];
  question!: Question;

  currentIndex = 0;
  totalQuestions = 0;

  loading = false;

  selectedOptionId: number | null = null;
  selectedOptionIds: number[] = [];
  checkedAnswer = false;

  // Separate arrays for selections and status
  answers: ({ selectedOptionId: number | null, selectedOptionIds: number[] } | null)[] = [];
  answerStatuses: boolean[] = []; // true=correct, false=wrong, undefined=unanswered

  navigatorPage = 0;
  navigatorPageSize = 20;

  constructor(
    private questionService: Questionservice,
    private topicService: Topicservice
  ) { }

  ngOnInit() {
    this.fetchTopics();
  }

  fetchTopics() {
    this.topicService.getTopics().subscribe(res => {
      this.topics = res;
    });
  }

  onTopicChange() {
    if (!this.selectedTopicId) return;

    this.loading = true;

    this.questionService
      .getByTopicWithPagination(this.selectedTopicId, 0, 500, 'ASC')
      .subscribe(res => {
        this.questions = res.content || [];
        this.totalQuestions = this.questions.length;

        // Initialize both arrays properly
        this.answers = new Array(this.totalQuestions).fill(null);
        this.answerStatuses = new Array(this.totalQuestions).fill(undefined);

        this.currentIndex = 0;

        if (this.totalQuestions > 0) {
          this.loadQuestion();
        } else {
          this.question = null as any;
        }

        this.loading = false;
      });
  }

  loadQuestion() {
    if (!this.questions || this.questions.length === 0) {
      return;
    }

    const questionId = this.questions[this.currentIndex].id;
    this.questionService.getQuestionById(questionId)
      .subscribe(res => {
        this.question = res;

        // Restore previous selections if the question was answered before
        const storedAnswer = this.answers[this.currentIndex];
        if (storedAnswer !== null && storedAnswer !== undefined) {
          if (this.question.questionType === 'SINGLE') {
            this.selectedOptionId = storedAnswer.selectedOptionId;
          } else if (this.question.questionType === 'MULTIPLE') {
            this.selectedOptionIds = [...storedAnswer.selectedOptionIds];
          }
          this.checkedAnswer = true;
        } else {
          // Reset for unanswered questions
          this.selectedOptionId = null;
          this.selectedOptionIds = [];
          this.checkedAnswer = false;
        }
      });
  }

  nextQuestion() {
    if (this.currentIndex < this.totalQuestions - 1) {
      this.currentIndex++;
      this.loadQuestion();
      this.updateNavigatorPage();
    }
  }

  previousQuestion() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.loadQuestion();
      this.updateNavigatorPage();
    }
  }

  toggleOption(optionId: number) {
    if (this.question.questionType === 'MULTIPLE') {
      const index = this.selectedOptionIds.indexOf(optionId);
      if (index > -1) {
        this.selectedOptionIds.splice(index, 1);
      } else {
        this.selectedOptionIds.push(optionId);
      }
    }
  }

  isCorrect(option: any) {
    return this.checkedAnswer && option.correct;
  }

  isWrong(option: any) {
    if (!this.checkedAnswer) return false;

    if (this.question.questionType === 'MULTIPLE') {
      return this.selectedOptionIds.includes(option.id!) && !option.correct;
    }

    return this.selectedOptionId === option.id && !option.correct;
  }

  isAnswerCorrect(): boolean {
    if (this.question.questionType === 'SINGLE') {
      const correctOption = this.question.options.find((o: any) => o.correct);
      return correctOption?.id === this.selectedOptionId;
    }

    const correctIds = this.question.options
      .filter((o: any) => o.correct)
      .map((o: any) => o.id)
      .sort();

    const selectedIds = [...this.selectedOptionIds].sort();

    return JSON.stringify(correctIds) === JSON.stringify(selectedIds);
  }

  checkAnswer() {
    this.checkedAnswer = true;

    // Store the current selection FIRST (preserve object structure)
    if (this.question.questionType === 'SINGLE') {
      this.answers[this.currentIndex] = {
        selectedOptionId: this.selectedOptionId,
        selectedOptionIds: []
      };
    } else {
      this.answers[this.currentIndex] = {
        selectedOptionId: null,
        selectedOptionIds: [...this.selectedOptionIds]
      };
    }

    // Store correct/incorrect status SEPARATELY
    this.answerStatuses[this.currentIndex] = this.isAnswerCorrect();
  }

  getNavigatorClass(index: number): string {
    if (index === this.currentIndex) {
      return 'nav-current'; // Current question - blue
    }

    const answerStatus = this.answerStatuses[index];
    if (answerStatus === true) {
      return 'nav-correct'; // Correct answer - green
    } else if (answerStatus === false) {
      return 'nav-wrong'; // Wrong answer - red
    }

    return 'nav-unanswered'; // Unanswered - gray
  }

  goToQuestion(index: number) {
    const realIndex = this.navigatorPage * this.navigatorPageSize + index;
    if (realIndex >= 0 && realIndex < this.totalQuestions) {
      this.currentIndex = realIndex;
      this.loadQuestion();
      this.updateNavigatorPage();
    }
  }

  get visibleNavigatorQuestions() {
    const start = this.navigatorPage * this.navigatorPageSize;
    const end = Math.min(start + this.navigatorPageSize, this.totalQuestions);
    return this.questions.slice(start, end);
  }

  nextNavigatorPage() {
    const maxPage = Math.ceil(this.totalQuestions / this.navigatorPageSize) - 1;
    if (this.navigatorPage < maxPage) {
      this.navigatorPage++;
      this.updateCurrentIndex();
      this.loadQuestion();
    }
  }

  previousNavigatorPage() {
    if (this.navigatorPage > 0) {
      this.navigatorPage--;
      this.updateCurrentIndex();
      this.loadQuestion();
    }
  }

  getNavigatorEnd(): number {
    const end = (this.navigatorPage + 1) * this.navigatorPageSize;
    return Math.min(end, this.totalQuestions);
  }

  updateNavigatorPage() {
    const pageIndex = Math.floor(this.currentIndex / this.navigatorPageSize);
    if (this.navigatorPage !== pageIndex) {
      this.navigatorPage = pageIndex;
    }
  }

  updateCurrentIndex() {
    this.currentIndex = this.navigatorPage * this.navigatorPageSize;
    if (this.currentIndex >= this.totalQuestions) {
      this.currentIndex = this.totalQuestions - 1;
    }
  }
}
