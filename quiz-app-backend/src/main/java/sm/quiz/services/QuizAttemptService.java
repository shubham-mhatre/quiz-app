package sm.quiz.services;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import sm.quiz.entities.OptionMaster;
import sm.quiz.entities.QuestionAttempt;
import sm.quiz.entities.QuestionAttemptOption;
import sm.quiz.entities.QuizAttempt;
import sm.quiz.entities.Topic;
import sm.quiz.entities.dto.AnswerResult;
import sm.quiz.entities.dto.AnswerSubmission;
import sm.quiz.entities.dto.UserQuizHistoryDto;
import sm.quiz.repositories.QuestionRepository;
import sm.quiz.repositories.QuizAttemptRepository;

@Service
@Transactional
public class QuizAttemptService {

    private final QuizAttemptRepository quizAttemptRepository;
    private final QuestionRepository questionRepository;

    public QuizAttemptService(
            QuizAttemptRepository quizAttemptRepository,
            QuestionRepository questionRepository) {
        this.quizAttemptRepository = quizAttemptRepository;
        this.questionRepository = questionRepository;
    }

    public QuizAttempt saveAttempt(
            Long userId,
            Long topicId,
            List<AnswerSubmission> submissions,
            List<AnswerResult> results) {

        QuizAttempt attempt = new QuizAttempt();
        attempt.setUserId(userId);
        attempt.setTopic(new Topic(topicId)); // attach topic
        attempt.setTotalQuestions(results.size());

        int correctCount = (int) results.stream()
                .filter(AnswerResult::isCorrect)
                .count();

        attempt.setCorrectCount(correctCount);
        attempt.setScore(correctCount); // 1 mark per correct
        attempt.setStartedAt(LocalDateTime.now());
        attempt.setSubmittedAt(LocalDateTime.now());

        for (int i = 0; i < submissions.size(); i++) {
            AnswerSubmission submission = submissions.get(i);
            AnswerResult result = results.get(i);

            QuestionAttempt qa = new QuestionAttempt();
            qa.setQuizAttempt(attempt);
            qa.setQuestion(
                questionRepository.getReferenceById(submission.getQuestionId())
            );
            qa.setIsCorrect(result.isCorrect());

            submission.getSelectedOptionIds().forEach(optionId -> {
                QuestionAttemptOption qao = new QuestionAttemptOption();
                qao.setQuestionAttempt(qa);
                qao.setOption(new OptionMaster(optionId));
                qa.getSelectedOptions().add(qao);
            });

            attempt.getQuestionAttempts().add(qa);
        }

        return quizAttemptRepository.save(attempt);
    }
    
    @Transactional(readOnly = true)
    public List<UserQuizHistoryDto> getUserHistory(Long userId) {
        return quizAttemptRepository.findUserHistory(userId);
    }
}
