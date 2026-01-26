package sm.quiz.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import sm.quiz.entities.QuizAttempt;
import sm.quiz.entities.dto.UserQuizHistoryDto;

@Repository
public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> { 
	
	@Query("""
	        select new sm.quiz.entities.dto.UserQuizHistoryDto(
	            qa.attemptId,
	            t.name,
	            qa.totalQuestions,
	            qa.correctCount,
	            qa.score,
	            qa.startedAt,
	            qa.submittedAt
	        )
	        from QuizAttempt qa
	        join qa.topic t
	        where qa.userId = :userId
	        order by qa.submittedAt desc
	    """)
	    List<UserQuizHistoryDto> findUserHistory(@Param("userId") Long userId);
}
