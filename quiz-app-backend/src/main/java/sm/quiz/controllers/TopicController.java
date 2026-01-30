package sm.quiz.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import sm.quiz.entities.Topic;
import sm.quiz.services.TopicService;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/topics")
public class TopicController {
	
	private final TopicService topicService;

	@GetMapping
    public List<Topic> getActiveTopics() {
        return topicService.getAllTopicList();
    }
	
	@PatchMapping("/{id}/disable")
	public ResponseEntity<Topic> disableTopic(@PathVariable Long id) {
        Topic updated = topicService.disableTopic(id);
        return ResponseEntity.ok(updated);
    }
	
	
	
}
