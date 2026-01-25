package sm.quiz.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import sm.quiz.entities.OptionMaster;

@Repository
public interface OptionMasterRepository extends JpaRepository<OptionMaster, Long> {

	List<OptionMaster> findByQuestionIdAndIsActiveTrueOrderByOptionOrder(Long questionId);

    @Query("""
        SELECT o FROM OptionMaster o
        WHERE o.question.id IN :questionIds
        AND o.isActive = true
        ORDER BY o.question.id, o.optionOrder
    """)
    List<OptionMaster> findOptionsForQuestions(
            @Param("questionIds") List<Long> questionIds
    );
}
