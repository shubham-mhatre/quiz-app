package sm.quiz.entities.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class OptionDto {

	public OptionDto(Integer id2, String optionText, boolean isCorrect) {
		// TODO Auto-generated constructor stub
	}

	private Integer id;
    private String text;
    private Integer order;
    
    private boolean correct;
}
