package sm.quiz.services;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import sm.quiz.entities.Explanation;
import sm.quiz.entities.OptionMaster;
import sm.quiz.entities.Question;
import sm.quiz.entities.dto.OptionDto;
import sm.quiz.entities.dto.QuestionDto;
import sm.quiz.repositories.AnswerRepository;
import sm.quiz.repositories.ExplanationRepository;
import sm.quiz.repositories.OptionMasterRepository;
import sm.quiz.repositories.QuestionRepository;
import sm.quiz.repositories.TopicRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

@Service
@RequiredArgsConstructor
public class QuestionService {

	private final QuestionRepository questionRepository;
    private final OptionMasterRepository optionRepository;
    private final ExplanationRepository explanationRepository;
    private final TopicRepository topicRepository;
    private final AnswerRepository answerRepository;

    /* GET BY TOPIC */
    public Page<QuestionDto> getByTopicPaginated(Integer topicId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Question> questionsPage = questionRepository.findByTopicIdOrderByIdDesc(topicId.longValue(), pageable);
        
        return questionsPage.map(this::toGriDto);
        
    }

    /* MAP QUESTION ENTITY TO DTO */
//    private QuestionDto toDto(Question question) {
//        // Fetch all options for the question
//        List<OptionMaster> options = optionRepository.findOptionsForQuestions(List.of(question.getId()));
//        
//        // Fetch the correct options from the answer table
//        Set<Integer> correctOptionIds = answerRepository.findCorrectOptionIds(question.getId());
//
//        // Map options and mark the correct ones based on the answer table
//        List<OptionDto> optionDtos = options.stream()
//                .map(option -> {
//                    boolean isCorrect = correctOptionIds.contains(option.getId());
//                    return new OptionDto(option.getId(), option.getOptionText(), isCorrect);
//                })
//                .collect(Collectors.toList());
//        
//        Explanation explaination=explanationRepository.findByQuestionIdAndIsActiveTrue(question.getId());
//        String explainationText=explaination!=null ? explaination.getExplanationText() : "";
//
//        // Return the DTO
//        QuestionDto questionDto = new QuestionDto();
//        questionDto.setId(question.getId());
//        questionDto.setTopicId(question.getTopic().getId());
//        questionDto.setQuestionText(question.getQuestionText());
//        questionDto.setQuestionType(question.getQuestionType());
//        questionDto.setOptions(optionDtos);
//        questionDto.setExplanation(explainationText);
//
//        return questionDto;
//    }
    
    private QuestionDto toGriDto(Question question) {
    	
    	

        // Return the DTO
        QuestionDto questionDto = new QuestionDto();
        questionDto.setId(question.getId());
        questionDto.setTopicId(question.getTopic().getId());
        questionDto.setQuestionText(question.getQuestionText());
        questionDto.setQuestionType(question.getQuestionType());
        return questionDto;
    }
}
