package sm.quiz.entities.dto;

import java.util.List;

import lombok.Data;
import sm.quiz.entities.QuestionType;

@Data
public class QuestionDto {

	private Long id;
    private String questionText;
    private QuestionType questionType;
    private List<OptionDto> options;
}
