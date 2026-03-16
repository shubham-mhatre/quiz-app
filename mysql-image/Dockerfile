FROM mysql:8.0

# Environment variables
ENV MYSQL_ROOT_PASSWORD=root
ENV MYSQL_DATABASE=quiz_db

# Copy your SQL file so that DB is initialized with it
COPY quiz-app_db.sql /docker-entrypoint-initdb.d/