import { Component } from '@angular/core';
import { Topic } from '../../../models/topic';
import { Question } from '../../../models/question';
import { Questionservice } from '../../../services/questionservice';
import { Topicservice } from '../../../services/topicservice';

@Component({
  selector: 'app-studyquestioncomponent',
  standalone: false,
  templateUrl: './studyquestioncomponent.html',
  styleUrl: './studyquestioncomponent.scss',
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
      .getByTopicWithPagination(this.selectedTopicId, 0, 100, 'ASC')
      .subscribe(res => {

        this.questions = res.content;
        this.totalQuestions = this.questions.length;

        this.currentIndex = 0;

        this.loadQuestion();

        this.loading = false;

      });

  }

  loadQuestion() {

    const questionId = this.questions[this.currentIndex].id;

    this.questionService.getQuestionById(questionId)
      .subscribe(res => {

        this.question = res;

        this.selectedOptionId = null;
        this.selectedOptionIds = [];
        this.checkedAnswer = false;

      });

  }

  nextQuestion() {

    if (this.currentIndex < this.totalQuestions - 1) {

      this.currentIndex++;
      this.loadQuestion();

    }

  }

  previousQuestion() {

    if (this.currentIndex > 0) {

      this.currentIndex--;
      this.loadQuestion();

    }

  }

  toggleOption(optionId: number) {

    if (this.question.questionType === 'MULTIPLE') {

      if (this.selectedOptionIds.includes(optionId)) {

        this.selectedOptionIds =
          this.selectedOptionIds.filter(id => id !== optionId);

      } else {

        this.selectedOptionIds.push(optionId);

      }

    }

  }

  checkAnswer() {
    this.checkedAnswer = true;
  }

  isCorrect(option: any) {
    return this.checkedAnswer && option.correct;
  }

  isWrong(option: any) {

    if (!this.checkedAnswer) return false;

    if (this.question.questionType === 'MULTIPLE') {
      return this.selectedOptionIds.includes(option.id) && !option.correct;
    }

    return this.selectedOptionId === option.id && !option.correct;
  }

  isAnswerCorrect(): boolean {

    if (this.question.questionType === 'SINGLE') {

      const correct = this.question.options.find(o => o.correct);
      return correct?.id === this.selectedOptionId;

    }

    const correctIds =
      this.question.options
        .filter(o => o.correct)
        .map(o => o.id)
        .sort();

    const selected =
      [...this.selectedOptionIds].sort();

    return JSON.stringify(correctIds) === JSON.stringify(selected);

  }
}
