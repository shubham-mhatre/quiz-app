# Quiz App

This is a **Quiz App** built using **Angular**, **Spring Boot**, and **MySQL**. It supports two types of logins: **Admin** and **User**. The admin panel provides features for onboarding users, managing quiz topics, and creating or uploading quiz questions. The user panel includes functionality to attempt quizzes, view results, review past attempts, and study topics.

## Features

### Admin Features
- **User Onboarding**: Admin can onboard new users with relevant details.
- **Topic Onboarding**: Admin can manage quiz topics.
- **Question Onboarding**:
  - **Upload Mode**: Admin can upload questions in bulk via a file upload.
  - **Manual Creation Mode**: Admin can create questions manually, categorized by topics.
- **View Question Details**: Admin can view the details of all quiz questions, including the questions and their corresponding answers.

### User Features
- **Dashboard**:
  - Displays all available quiz topics.
  - Allows the user to select a topic, specify the number of questions, and start a quiz.
- **Quiz Attempts**:
  - After completing a quiz, users receive a result summary.
  - Users can review their quiz details and see individual question-wise results.
- **Quiz History**:
  - Users can view their past quiz attempts.
  - Users can review their previous quiz attempts in detail.
- **Study Component**:
  - Users can prepare for quizzes by studying topic-wise questions.

## Technologies Used
- **Frontend**: Angular (20.3.11)
- **Backend**: Spring Boot(3.5.10), Java (21.0.6)
- **Database**: MySQL (5.7)
- **Additional Tools**: 
  - JPA for ORM
  - Swagger API
  - Angular Material for UI components

## Setup Instructions

### Prerequisites
- Java 21 or higher
- Node.js (24.11.1)
- MySQL Database (5.7)

### Backend Setup (Spring Boot)
1. Clone this repository:
    ```bash
    git clone https://github.com/shubham-mhatre/quiz-app.git
    cd quiz-app
    ```
2. Navigate to the `backend` folder:
    ```bash
    cd backend
    ```
3. Create a `application.properties` or `application.yml` file and configure your database connection:
    ```properties
    spring.datasource.url=jdbc:mysql://localhost:3306/quizapp
    spring.datasource.username=root
    spring.datasource.password=password
    spring.jpa.hibernate.ddl-auto=update
    ```
4. Build the Spring Boot application:
    ```bash
    ./mvnw clean install
    ```
5. Start the Spring Boot application:
    ```bash
    ./mvnw spring-boot:run
    ```

### Frontend Setup (Angular)
1. Navigate to the `frontend` folder:
    ```bash
    cd frontend
    ```
2. Install the necessary packages:
    ```bash
    npm install
    ```
3. Start the Angular development server:
    ```bash
    ng serve
    ```
4. The application will be running at `http://localhost:4200`.

## Database Schema

### Tables:
- **app_user**: Stores user details (username, password_hash, role, etc.)
- **topic**: Stores available quiz topics (topic_name, description etc).
- **Questions**: Stores quiz questions linked to topics (question_text, question_type, topic_id etc).
- **Answers**: Stores multiple answers for each question. (question_id, option_id etc)
- **option_master**: Stores all related options of each questions (option_text,question_id)
- **explanation**: Stores explanation for related answer of question (question_id, explanation)

## API Endpoints

### User API
- `POST /api/auth/login`: User login endpoint.
- `GET /api/quiz/questions?topicId=1&limit=10`: Start quiz for a particular topic by providing no of question count.
- `POST /api/quiz/submit`: Submit quiz and get results.
- `GET /api/quiz/history`: Get past quiz attempts.
- `GET /api/quiz/review?attemptId=1`: Review quiz details.

### Admin API
- `POST /api/admin/users`: Onboard new user.
- `GET /api/admin/users`: get onboarded users list.
- `POST /api/topic`: Add new topic.
- `POST /api/admin/question`: Add new question (manual mode).
- `POST /api/admin/question/bulk-upload`: Upload questions in bulk (upload mode).
- `GET /api/admin/questions`: View all questions.

## User Stories
1. **As an Admin**: I can onboard users, manage topics, and add or upload quiz questions.
2. **As a User**: I can view quiz topics, attempt quizzes, review my quiz results, and study topic-wise questions.

## Screenshots

Few screenshots of the app in action:

1. **Admin Dashboard**
    


3. **User Dashboard**
4. **Quiz Result Page**

## Known Issues
- Issue with uploading large files for questions in bulk (workaround: use smaller files).
- Some UI issues with mobile responsiveness

## Contributing

Feel free to fork this repository, make your changes, and submit a pull request. Before submitting, please ensure that:
- All tests pass.
- The code follows the established style guide.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
