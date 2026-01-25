package sm.quiz.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import sm.quiz.entities.Topic;

@Repository
public interface TopicRepository extends JpaRepository<Topic, Integer> {

	 List<Topic> findAllByIsActiveTrue();
}
