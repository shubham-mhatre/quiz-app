package sm.quiz.services;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.json.JSONObject;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import sm.quiz.entities.Explanation;
import sm.quiz.entities.OptionMaster;
import sm.quiz.entities.Question;
import sm.quiz.entities.QuestionAttempt;
import sm.quiz.entities.QuestionAttemptOption;
import sm.quiz.entities.QuizAttempt;
import sm.quiz.entities.dto.AnswerResult;
import sm.quiz.entities.dto.ExplanationDto;
import sm.quiz.entities.dto.OptionDto;
import sm.quiz.entities.dto.QuestionDto;
import sm.quiz.entities.dto.QuizResultResponse;
import sm.quiz.entities.dto.QuizReviewDto;
import sm.quiz.entities.dto.QuizSubmissionRequest;
import sm.quiz.entities.dto.UserQuizHistoryDto;
import sm.quiz.repositories.AnswerRepository;
import sm.quiz.repositories.ExplanationRepository;
import sm.quiz.repositories.OptionMasterRepository;
import sm.quiz.repositories.QuestionRepository;

@RequiredArgsConstructor
@Service
public class QuizService {

    private final AnswerRepository answerRepository;

	private final QuestionRepository questionRepository;
	private final OptionMasterRepository optionRepository;
	private final ExplanationRepository explanationRepository;
	private final QuizAttemptService attemptService;

	private final AnswerEvaluationService answerEvaluationService;



	public List<QuestionDto> getQuizQuestions(Long topicId, int limit) {
		List<Question> questions = questionRepository.findRandomQuestionsByTopic(topicId, PageRequest.of(0, limit));

		List<Long> questionIds = questions.stream().map(Question::getId).toList();

		Map<Long, List<OptionDto>> optionsMap = optionRepository.findOptionsForQuestions(questionIds).stream()
				.map(o -> {
					OptionDto dto = new OptionDto();
					dto.setId(o.getId());
					dto.setText(o.getOptionText());
					dto.setOrder(o.getOptionOrder());
					return Map.entry(o.getQuestion().getId(), dto);
				}).collect(Collectors.groupingBy(Map.Entry::getKey,
						Collectors.mapping(Map.Entry::getValue, Collectors.toList())));

		return questions.stream().map(q -> {
			QuestionDto dto = new QuestionDto();
			dto.setId(q.getId());
			dto.setQuestionText(q.getQuestionText());
			dto.setQuestionType(q.getQuestionType());
			dto.setOptions(optionsMap.getOrDefault(q.getId(), List.of()));
			return dto;
		}).toList();
	}

	public QuizResultResponse submitQuiz(QuizSubmissionRequest request) {
		List<AnswerResult> results = request.getAnswers().stream().map(answerEvaluationService::evaluate).toList();
		
		QuizAttempt quizAttempt=attemptService.saveAttempt(
	            request.getUserId(),
	            request.getTopicId(),
	            request.getAnswers(),
	            results
	        );
		
		long correctCount = results.stream().filter(AnswerResult::isCorrect).count();

		QuizResultResponse response = new QuizResultResponse();
		response.setTotalQuestions(results.size());
		response.setCorrectAnswers((int) correctCount);
		response.setResults(results);
		response.setAttemptId(quizAttempt.getAttemptId());

		return response;

	}

	public ExplanationDto getExplanation(Long questionId) {
		Explanation explanation = explanationRepository
				.findByQuestionIdAndIsActiveTrue(questionId);
		
		ExplanationDto dto = new ExplanationDto();
        dto.setQuestionId(questionId);
        dto.setExplanationText(explanation.getExplanationText());

        return dto;
	}
	
	public List<UserQuizHistoryDto> getUserQuizHistory(Long userId) {
		return attemptService.getUserHistory(userId);
	}

	public List<QuizReviewDto> reviewQuiz(Long attemptId) {
	    //JSONObject jsonObject = new JSONObject();
	    QuizAttempt attempt = attemptService.getAttemptDetails(attemptId);
	    Set<QuestionAttempt> questionsAttempted = attempt.getQuestionAttempts();
	
	    // Create a list to hold all question review DTOs
	    List<QuizReviewDto> reviewList = new ArrayList<>();
	
	    questionsAttempted.forEach(questionAttempt -> {
	        // Fetch the question details
	        Question question = questionAttempt.getQuestion();
	        String questionText = question.getQuestionText();
	        String questionType = question.getQuestionType().name();
	        
	        // Fetch the options for the question
	        List<OptionMaster> options = question.getOptions();
	        List<OptionDto> optionDtos = new ArrayList<>();
	        options.forEach(option -> {
	            OptionDto optionDto = new OptionDto();
	            optionDto.setId(option.getId());
	            optionDto.setText(option.getOptionText());
	            optionDtos.add(optionDto);
	        });
	
	        // Get the selected options
	        Set<QuestionAttemptOption> selectedOptions = questionAttempt.getSelectedOptions();
	        Set<OptionDto> selectedOptionDtos = new HashSet<>();
	        selectedOptions.forEach(selectedOption -> {
	            OptionDto selectedOptionDto = new OptionDto();
	            selectedOptionDto.setId(selectedOption.getOption().getId());
	            selectedOptionDto.setText(selectedOption.getOption().getOptionText());
	            selectedOptionDtos.add(selectedOptionDto);
	        });
	
	        // Determine the correct option(s)
	        List<OptionDto> correctOptionDtos = new ArrayList<>();
	        Set<Integer>correctOptionId= answerRepository.findCorrectOptionIds(question.getId());
	        options.forEach(option -> {
	        	if (correctOptionId.contains(option.getId())) {
	                OptionDto correctOptionDto = new OptionDto();
	                correctOptionDto.setId(option.getId());
	                correctOptionDto.setText(option.getOptionText());
	                correctOptionDtos.add(correctOptionDto);
	        	}

	        });
	
	        // Fetch the explanation for the question
	        Explanation explanation = explanationRepository
					.findByQuestionIdAndIsActiveTrue(question.getId());
	        String explanationText = explanation.getExplanationText();
	
	        // Create the review DTO for this question
	        QuizReviewDto reviewDto = new QuizReviewDto();
	        reviewDto.setQuestionText(questionText);
	        reviewDto.setQuestionType(questionType);
	        reviewDto.setOptions(optionDtos);
	        reviewDto.setSelectedOptions(selectedOptionDtos);
	        reviewDto.setCorrectOptions(correctOptionDtos); // Set the correct options
	        reviewDto.setExplanation(explanationText);
	
	        // Add the reviewDto to the reviewList
	        reviewList.add(reviewDto);
	    });
	
	    // Return the final review data
		    return reviewList;
	
	}

}
