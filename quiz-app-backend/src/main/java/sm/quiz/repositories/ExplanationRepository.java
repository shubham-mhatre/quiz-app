package sm.quiz.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import sm.quiz.entities.Explanation;

@Repository
public interface ExplanationRepository extends JpaRepository<Explanation, Long> {

	Explanation findByQuestionIdAndIsActiveTrue(Long questionId);
	
	void deleteByQuestionId(Long questionId);
}
