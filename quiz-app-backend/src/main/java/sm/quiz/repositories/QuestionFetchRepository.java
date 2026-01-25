package sm.quiz.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import sm.quiz.entities.Question;

@Repository
public interface QuestionFetchRepository {

	@Query("""
	        SELECT DISTINCT q FROM Question q
	        LEFT JOIN FETCH q.options o
	        WHERE q.topic.id = :topicId
	        AND q.isActive = true
	        AND o.isActive = true
	    """)
	    List<Question> fetchQuestionsWithOptions(@Param("topicId") Long topicId);
}
