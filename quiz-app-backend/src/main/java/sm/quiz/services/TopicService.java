package sm.quiz.services;

import java.util.List;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import sm.quiz.entities.Topic;
import sm.quiz.repositories.TopicRepository;

@RequiredArgsConstructor
@Service
public class TopicService {

	private final TopicRepository repository;

	public List<Topic> getAllTopicList() {
		return repository.findAllByIsActiveTrue();
	}
}
