package sm.quiz.entities.dto;

import java.util.Set;

import lombok.Data;

@Data
public class AnswerResult {

	private Long questionId;
    private boolean correct;
    private Integer score;
    private Set<Integer> correctOptionIds;
}
