package sm.quiz.entities.dto;

import java.util.List;

import lombok.Data;

@Data
public class QuizResultResponse {

	private int totalQuestions;
	private int correctAnswers;
	private List<AnswerResult> results;
}
