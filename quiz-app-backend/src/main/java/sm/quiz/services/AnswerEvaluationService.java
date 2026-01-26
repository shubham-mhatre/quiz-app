package sm.quiz.services;

import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import sm.quiz.entities.Question;
import sm.quiz.entities.QuestionType;
import sm.quiz.entities.dto.AnswerResult;
import sm.quiz.entities.dto.AnswerSubmission;
import sm.quiz.repositories.AnswerRepository;
import sm.quiz.repositories.QuestionRepository;

@Service
@Transactional(readOnly = true)
public class AnswerEvaluationService {

	private final QuestionRepository questionRepository;
    private final AnswerRepository answerRepository;

    public AnswerEvaluationService(
            QuestionRepository questionRepository,
            AnswerRepository answerRepository) {
        this.questionRepository = questionRepository;
        this.answerRepository = answerRepository;
    }

    public AnswerResult evaluate(AnswerSubmission submission) {

        Question question = questionRepository.findById(submission.getQuestionId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid question id"));

        Set<Integer> correctOptionIds =
                answerRepository.findCorrectOptionIds(question.getId());

        Set<Integer> selectedOptionIds =
                submission.getSelectedOptionIds() == null
                        ? Set.of()
                        : submission.getSelectedOptionIds();

        boolean isCorrect;

        if (question.getQuestionType() == QuestionType.SINGLE) {
            isCorrect = evaluateSingle(correctOptionIds, selectedOptionIds);
        } else {
            isCorrect = evaluateMultiple(correctOptionIds, selectedOptionIds);
        }

        AnswerResult result = new AnswerResult();
        result.setQuestionId(question.getId());
        result.setCorrect(isCorrect);
        result.setScore(isCorrect ? 1 : 0);
        result.setCorrectOptionIds(correctOptionIds);

        return result;
    }

    
    private boolean evaluateSingle(
            Set<Integer> correctOptionIds,
            Set<Integer> selectedOptionIds) {

        if (selectedOptionIds.size() != 1) {
            return false;
        }

        return correctOptionIds.equals(selectedOptionIds);
    }
    
    private boolean evaluateMultiple(
            Set<Integer> correctOptionIds,
            Set<Integer> selectedOptionIds) {

        if (selectedOptionIds == null || selectedOptionIds.isEmpty()) {
            return false;
        }

        // Exact match: no missing, no extra
        return correctOptionIds.equals(selectedOptionIds);
    }



}
