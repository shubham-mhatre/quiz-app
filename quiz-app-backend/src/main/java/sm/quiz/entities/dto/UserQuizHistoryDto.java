package sm.quiz.entities.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UserQuizHistoryDto {

    private Long attemptId;
    private String topicName;
    private Integer totalQuestions;
    private Integer correctCount;
    private Integer score;
    private LocalDateTime startedAt;
    private LocalDateTime submittedAt;
}
