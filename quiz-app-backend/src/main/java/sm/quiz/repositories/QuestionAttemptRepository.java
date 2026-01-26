package sm.quiz.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import sm.quiz.entities.QuestionAttempt;

@Repository
public interface QuestionAttemptRepository extends JpaRepository<QuestionAttempt, Long> {
	
}
