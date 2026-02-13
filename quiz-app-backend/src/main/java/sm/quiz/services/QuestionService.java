package sm.quiz.services;

import java.io.InputStreamReader;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.opencsv.CSVReader;

import lombok.RequiredArgsConstructor;
import sm.quiz.entities.Answer;
import sm.quiz.entities.Explanation;
import sm.quiz.entities.OptionMaster;
import sm.quiz.entities.Question;
import sm.quiz.entities.QuestionType;
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

		Question question = questionRepository.findById(questionId.longValue()).orElse(null);

		if (question == null) {
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
		Question question = new Question();
		question.setQuestionText(request.getQuestionText());
		question.setQuestionType(request.getQuestionType());
		question.setIsActive(true);
		question.setCreatedAt(LocalDateTime.now());

		Topic topic = topicRepository.findById(request.getTopicId().intValue())
				.orElseThrow(() -> new RuntimeException("Topic not found"));

		question.setTopic(topic);

		List<OptionMaster> optionsList = new ArrayList<>();
		List<OptionMaster> correctOptionsList = new ArrayList<>();
		Integer optionOrder = 1;
		for (OptionDto optionDto : request.getOptions()) {
			OptionMaster option = new OptionMaster();

			option.setOptionText(optionDto.getText());
			option.setIsActive(true);
			option.setOptionOrder(optionOrder);
			option.setCreatedAt(LocalDateTime.now());
			option.setQuestion(question);

			optionsList.add(option);

			if (optionDto.isCorrect()) {
				correctOptionsList.add(option);
			}

			optionOrder++;
		}
		question.setOptions(optionsList);

		questionRepository.save(question);

		List<Answer> answersList = new ArrayList<>();
		for (OptionMaster correctAns : correctOptionsList) {
			Answer answer = new Answer();
			answer.setQuestion(question);
			answer.setCreatedAt(LocalDateTime.now());
			answer.setOption(correctAns);
			answersList.add(answer);
		}

		answerRepository.saveAll(answersList);

		Explanation explanation = new Explanation();
		explanation.setCreatedAt(LocalDateTime.now());
		explanation.setExplanationText(request.getExplanation());
		explanation.setIsActive(true);
		explanation.setQuestion(question);
		explanationRepository.save(explanation);

		request.setId(question.getId());
		return request;
	}

	public void bulkUploadQuestions(MultipartFile file) throws Exception {
		// Parse the CSV
		try (CSVReader reader = new CSVReader(new InputStreamReader(file.getInputStream()))) {
			List<String[]> rows = reader.readAll();
			for (String[] row : rows) {
				// Assume each row has: questionText, questionType, explanation, options,
				// topicId, correctOptionIndexes
				String questionText = row[0];
				String questionType = row[1];
				String explanation = row[2];
				String[] options = row[3].split(";"); // Assuming options are semicolon-separated
				Long topicId = Long.parseLong(row[4]);
				String[] correctOptionIndexes = row[5].split(";"); // Assuming correct options indexes are
				// semicolon-separated

				// Create Question entity
				Topic topic = topicRepository.findById(topicId.intValue()).orElseThrow(() -> new Exception("Topic not found"));
				Question question = new Question();
				question.setQuestionText(questionText);
				question.setQuestionType(QuestionType.valueOf(questionType)); // Assuming enum QuestionType is present
//				question.setExplanation(explanation);
				question.setTopic(topic);
				question.setIsActive(true);
				question.setCreatedAt(LocalDateTime.now());

				// Save question
				question = questionRepository.save(question);

				// Create and save options for the question
				List<OptionMaster> optionsList = new ArrayList<>();
				for (String optionText : options) {
					OptionMaster option = new OptionMaster();
					option.setOptionText(optionText);
					option.setOptionOrder(optionsList.size() + 1); // Option order starts from 1
					option.setIsActive(true);
					option.setCreatedAt(LocalDateTime.now());
					option.setQuestion(question);
					optionsList.add(option);
				}
				optionRepository.saveAll(optionsList);

				// Create and save answers (correct options)
				List<Answer> answersList = new ArrayList<>();
				for (String correctOptionIndex : correctOptionIndexes) {
					int index = Integer.parseInt(correctOptionIndex);
					OptionMaster correctOption = optionsList.get(index); // Get correct option by index
					Answer answer = new Answer();
					answer.setQuestion(question);
					answer.setCreatedAt(LocalDateTime.now());
					answer.setOption(correctOption);
					answersList.add(answer);
				}
				answerRepository.saveAll(answersList);

				// Create explanation for the question
				Explanation explanationEntity = new Explanation();
				explanationEntity.setCreatedAt(LocalDateTime.now());
				explanationEntity.setExplanationText(explanation);
				explanationEntity.setIsActive(true);
				explanationEntity.setQuestion(question);
				explanationRepository.save(explanationEntity);
			}
		}
	}
}
