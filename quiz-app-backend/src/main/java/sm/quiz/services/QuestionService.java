package sm.quiz.services;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import sm.quiz.entities.Answer;
import sm.quiz.entities.Explanation;
import sm.quiz.entities.OptionMaster;
import sm.quiz.entities.Question;
import sm.quiz.entities.Topic;
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

	public QuestionDto getQuestionDetailsById(Integer questionId) throws Exception {
		
		Question question=questionRepository.findById(questionId.longValue())
				.orElse(null);
		
		if(question==null) {
			throw new Exception("No data found : invalid question id");
		}
		
		// Fetch all options for the question
		List<OptionMaster> options = optionRepository.findOptionsForQuestions(List.of(questionId.longValue()));

		// Fetch the correct options from the answer table
		Set<Integer> correctOptionIds = answerRepository.findCorrectOptionIds(questionId.longValue());

		// Map options and mark the correct ones based on the answer table
		List<OptionDto> optionDtos = options.stream().map(option -> {
			boolean isCorrect = correctOptionIds.contains(option.getId());
			return new OptionDto(option.getId(), option.getOptionText(), isCorrect);
		}).collect(Collectors.toList());

		Explanation explaination = explanationRepository.findByQuestionIdAndIsActiveTrue(questionId.longValue());
		String explainationText = explaination != null ? explaination.getExplanationText() : "";

		// Return the DTO
		QuestionDto questionDto = new QuestionDto();
		questionDto.setId(question.getId());
		questionDto.setTopicId(question.getTopic().getId());
		questionDto.setQuestionText(question.getQuestionText());
		questionDto.setQuestionType(question.getQuestionType());
		questionDto.setOptions(optionDtos);
		questionDto.setExplanation(explainationText);

		return questionDto;
	}

	private QuestionDto toGriDto(Question question) {

		// Return the DTO
		QuestionDto questionDto = new QuestionDto();
		questionDto.setId(question.getId());
		questionDto.setTopicId(question.getTopic().getId());
		questionDto.setQuestionText(question.getQuestionText());
		questionDto.setQuestionType(question.getQuestionType());
		return questionDto;
	}

	@Transactional
	public QuestionDto createQuestion(QuestionDto request) {
		Question question=new Question();
		question.setQuestionText(request.getQuestionText());
		question.setQuestionType(request.getQuestionType());
		question.setIsActive(true);
		question.setCreatedAt(LocalDateTime.now());
		
		Topic topic = topicRepository.findById(request.getTopicId().intValue())
                .orElseThrow(() -> new RuntimeException("Topic not found"));
		
		question.setTopic(topic);		
		
		List<OptionMaster> optionsList=new ArrayList<>();
		List<OptionMaster> correctOptionsList=new ArrayList<>();
		Integer optionOrder=1;
		for(OptionDto optionDto : request.getOptions()) {
			OptionMaster option=new OptionMaster();
			
			option.setOptionText(optionDto.getText());
			option.setIsActive(true);
			option.setOptionOrder(optionOrder);
			option.setCreatedAt(LocalDateTime.now());
			option.setQuestion(question);
			
			optionsList.add(option);
			
			if(optionDto.isCorrect()) {
				correctOptionsList.add(option);
			}
			
			optionOrder++;
		}
		question.setOptions(optionsList);
		
		
		questionRepository.save(question);
		
		List<Answer> answersList=new ArrayList<>();		
		for(OptionMaster correctAns:correctOptionsList) {
			Answer answer=new Answer();
			answer.setQuestion(question);		
			answer.setCreatedAt(LocalDateTime.now());
			answer.setOption(correctAns);
			answersList.add(answer);
		}		
		
		answerRepository.saveAll(answersList);
		
		Explanation explanation=new Explanation();
		explanation.setCreatedAt(LocalDateTime.now());
		explanation.setExplanationText(request.getExplanation());
		explanation.setIsActive(true);
		explanation.setQuestion(question);
		explanationRepository.save(explanation);
		
		request.setId(question.getId());
		return request;
	}
}
