package sm.quiz.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
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
}
