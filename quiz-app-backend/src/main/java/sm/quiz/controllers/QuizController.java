package sm.quiz.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import sm.quiz.entities.dto.QuestionDto;
import sm.quiz.services.QuizService;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/quiz")
public class QuizController {
	
	private final QuizService quizService;
	
	@GetMapping("/questions")
	public List<QuestionDto> getQuizQuestions(
            @RequestParam Long topicId,
            @RequestParam(defaultValue = "10") int limit) {
		
		List<QuestionDto> questionDto= quizService.getQuizQuestions(topicId,limit);
		return questionDto;
	}

}
