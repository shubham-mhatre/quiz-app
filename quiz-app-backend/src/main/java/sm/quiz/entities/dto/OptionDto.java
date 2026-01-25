package sm.quiz.entities.dto;

import lombok.Data;

@Data
public class OptionDto {

	private Long id;
    private String text;
    private Integer order;
}
