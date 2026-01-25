package sm.quiz.services;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import sm.quiz.entities.Question;
import sm.quiz.entities.dto.OptionDto;
import sm.quiz.entities.dto.QuestionDto;
import sm.quiz.repositories.OptionMasterRepository;
import sm.quiz.repositories.QuestionRepository;

@RequiredArgsConstructor
@Service
public class QuizService {
	
	private final QuestionRepository questionRepository;
	private final OptionMasterRepository optionRepository; 

	public List<QuestionDto> getQuizQuestions(Long topicId, int limit) {
		List<Question> questions =
                questionRepository.findRandomQuestionsByTopic(
                        topicId,
                        PageRequest.of(0, limit)
                );
		
		List<Long> questionIds = questions.stream()
                .map(Question::getId)
                .toList();
		
		Map<Long, List<OptionDto>> optionsMap =
                optionRepository.findOptionsForQuestions(questionIds)
                        .stream()
                        .map(o -> {
                            OptionDto dto = new OptionDto();
                            dto.setId(o.getId());
                            dto.setText(o.getOptionText());
                            dto.setOrder(o.getOptionOrder());
                            return Map.entry(o.getQuestion().getId(), dto);
                        })
                        .collect(Collectors.groupingBy(
                                Map.Entry::getKey,
                                Collectors.mapping(Map.Entry::getValue, Collectors.toList())
                        ));
		
		return questions.stream().map(q -> {
            QuestionDto dto = new QuestionDto();
            dto.setId(q.getId());
            dto.setQuestionText(q.getQuestionText());
            dto.setQuestionType(q.getQuestionType());
            dto.setOptions(optionsMap.getOrDefault(q.getId(), List.of()));
            return dto;
        }).toList();
	}

}
