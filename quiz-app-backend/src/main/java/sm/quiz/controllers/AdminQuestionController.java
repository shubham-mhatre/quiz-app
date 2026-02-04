package sm.quiz.controllers;

import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import sm.quiz.entities.dto.QuestionDto;
import sm.quiz.services.QuestionService;

@RestController
@RequestMapping("/api/admin/questions")
@RequiredArgsConstructor
public class AdminQuestionController {

	private final QuestionService questionService;

	@GetMapping("/{topicId}/bytopic")
	public Page<QuestionDto> getByTopic(@PathVariable Integer topicId, 
	                                     @RequestParam int page, 
	                                     @RequestParam int size) {
	    return questionService.getByTopicPaginated(topicId, page, size);
	}

//	@PostMapping
//	public QuestionDto create(@RequestBody QuestionRequest request) {
//		return questionService.create(request);
//	}
//
//	@PutMapping("/{id}")
//	public QuestionDto update(@PathVariable Integer id, @RequestBody QuestionRequest request) {
//		return questionService.update(id, request);
//	}
}
