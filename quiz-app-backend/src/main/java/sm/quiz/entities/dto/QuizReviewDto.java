package sm.quiz.entities.dto;

import java.util.List;
import java.util.Set;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class QuizReviewDto {

	private String questionText;
    private String questionType;
    private List<OptionDto> options;
    private List<OptionDto> correctOptions; // A list of correct options
    private Set<OptionDto> selectedOptions; // Selected options by the user
    private String explanation;

}
