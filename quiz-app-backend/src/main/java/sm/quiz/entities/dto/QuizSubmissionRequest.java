package sm.quiz.entities.dto;

import java.util.List;

import lombok.Data;

@Data
public class QuizSubmissionRequest {

	private List<AnswerSubmission> answers;
	private long userId;
	private Long topicId;
}
