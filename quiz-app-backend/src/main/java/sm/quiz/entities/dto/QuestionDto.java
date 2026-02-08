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

    private String explanation;
    private Long topicId;
    
    //used for sending response
    private Integer status;
    private String message;
}
