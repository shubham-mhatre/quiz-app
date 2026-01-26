package sm.quiz.repositories;

import java.util.List;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import sm.quiz.entities.Answer;

@Repository
public interface AnswerRepository extends JpaRepository<Answer, Long> {

	@Query("""
	        SELECT a.option.id FROM Answer a
	        WHERE a.question.id = :questionId
	    """)
	    Set<Integer> findCorrectOptionIds(@Param("questionId") Long questionId);

	    @Query("""
	        SELECT a FROM Answer a
	        WHERE a.question.id IN :questionIds
	    """)
	    List<Answer> findAnswersForQuestions(
	            @Param("questionIds") List<Long> questionIds
	    );
}
