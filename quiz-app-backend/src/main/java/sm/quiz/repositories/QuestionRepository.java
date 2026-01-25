package sm.quiz.repositories;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import sm.quiz.entities.Question;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {

	@Query("""
	        SELECT q FROM Question q
	        WHERE q.topic.id = :topicId
	        AND q.isActive = true
	    """)
	    List<Question> findActiveByTopic(@Param("topicId") Long topicId);

	    @Query("""
	        SELECT q FROM Question q
	        WHERE q.topic.id = :topicId
	        AND q.isActive = true
	        ORDER BY function('RAND')
	    """)
	    List<Question> findRandomQuestionsByTopic(
	            @Param("topicId") Long topicId,
	            Pageable pageable
	    );
}
