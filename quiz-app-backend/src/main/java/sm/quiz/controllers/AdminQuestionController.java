package sm.quiz.controllers;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
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
	
	@GetMapping("/{questionId}")
	public QuestionDto getQuestionDetailsById(@PathVariable Integer questionId) throws Exception {
	    return questionService.getQuestionDetailsById(questionId);
	}

	@PostMapping
	public ResponseEntity<QuestionDto> create(@RequestBody QuestionDto request) {
		try {
			QuestionDto response= questionService.createQuestion(request);
			response.setMessage("Question details added successfully.");
			response.setStatus(1);
			return ResponseEntity.ok(response);
		}catch(Exception e) {
			QuestionDto response=new QuestionDto();
			response.setMessage("Issue occure while saving question details. "+e.getMessage().substring(0, 255));
			response.setStatus(0);
			return ResponseEntity.ok(response);
		}
	}
//
//	@PutMapping("/{id}")
//	public QuestionDto update(@PathVariable Integer id, @RequestBody QuestionRequest request) {
//		return questionService.update(id, request);
//	}
}
