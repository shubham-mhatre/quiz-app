package sm.quiz.entities.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class OptionDto {

	

	

	public OptionDto(Integer id, String text, boolean correct) {
		super();
		this.id = id;
		this.text = text;
		this.correct = correct;
	}

	private Integer id;
    private String text;
    private Integer order;
    
    private boolean correct;
}
