package sm.quiz.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import sm.quiz.entities.Explanation;

@Repository
public interface ExplanationRepository extends JpaRepository<Explanation, Long> {

	Optional<Explanation> findByQuestionIdAndIsActiveTrue(Long questionId);
}
