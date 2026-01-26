package sm.quiz.entities.dto;

import java.util.Set;

import lombok.Data;

@Data
public class AnswerSubmission {

	private Long questionId;
    private Set<Integer> selectedOptionIds;

}
