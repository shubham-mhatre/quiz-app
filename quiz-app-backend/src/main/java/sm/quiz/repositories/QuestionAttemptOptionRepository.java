package sm.quiz.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import sm.quiz.entities.QuestionAttemptOption;

@Repository
public interface QuestionAttemptOptionRepository extends JpaRepository<QuestionAttemptOption, Long> {
}
