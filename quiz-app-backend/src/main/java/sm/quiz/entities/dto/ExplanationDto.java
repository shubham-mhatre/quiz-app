package sm.quiz.entities.dto;

import lombok.Data;

@Data
public class ExplanationDto {

	private Long questionId;
    private String explanationText;
}
