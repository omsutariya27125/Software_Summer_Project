# Software Requirements Specification
This section contains the thorough documentation of the entire project.

### AI-Powered JEE Mathematics Practice Portal
---------------------------------------
## Project Aim
To provide a structured and personalized practice environment for JEE Main Mathematics through question solving, performance tracking, and AI-driven recommendations.
____________________________
## Stakeholders
There are total of three stakeholders in this system.

### 1. Students (Primary Stakeholders)
Students are the primary users of the system. They use the platform to practice JEE Main Mathematics questions, track their performance, and receive personalized recommendations to improve their preparation.

#### Responsibilities/Interests
* Register and log in to the platform
* Attempt practice questions
* View solutions and feedback
* Monitor learning progress

### 2. Administrator
The administrator is responsible for managing the platform, handling question uploads, and maintaining the database to ensure smooth operation.

#### Responsibilities/Interests
* Manage user accounts
* Monitor system functionality
* Maintain platform integrity
* Queue and upload questions
* Manage the question database

### 3. Smart Question Repository Management

Smart question repository management is handled by the administrator. There is no separate tutor or subject expert role in the system.

#### Responsibilities/Interests
* Create and update question banks
* Verify question accuracy
* Categorize questions by topic and difficulty
* Maintain solution explanations
____________________________________

## Requirements Elicitation Techniques

### 1. Observation

Existing online learning and practice platforms were studied to understand current workflows and identify potential improvements.

#### Purpose
* Analyze existing solutions
* Identify strengths and limitations
* Gather ideas for system features

### 2. Questionnaires and Surveys

Feedback was collected from students regarding their preferred learning and practice methods.

#### Purpose
* Collect user opinions
* Identify commonly desired features
* Understand user expectations

### 3. Brainstorming Sessions

Brainstorming sessions were conducted among the project team members to generate ideas, discuss possible features, and identify practical solutions for the platform.

#### Purpose
* Generate innovative feature ideas
* Identify potential system functionalities
* Refine project scope and sprint planning
* Prioritize requirements based on project objectives
_____________________________________

## Requirements
The requirements extracted from the elicitation techniques are divided into functional and non-functional requirements.

### Functional Requirements (FR)
FR-1: User Registration.
	The system shall allow a new user to create an account by providing the required details.
  
FR-2: User Login and Authentication.
	The system shall allow registered users to log in using their credentials and verify them in order for only valid users to log in.

FR-3: User Logout.
	The system shall allow authenticated users to securely log out of the system.

FR-4: Mathematics Syllabus Navigation.
       The system shall provide access to the JEE Main Mathematics syllabus through an organized chapter-wise structure.
       
FR-5: Chapter-wise Practice.
       The system shall enable students to practice questions from selected Mathematics chapters.
       
FR-6: Question Repository Management.
	The system shall maintain a centralized repository of JEE Main Mathematics questions organized by chapter, topic, and other relevant attributes to support efficient storage, retrieval, and management of learning content.

FR-7. Question Evaluation
       The system shall evaluate student responses and provide immediate feedback on correctness.

FR-8: Difficulty-wise Question Handling.
	      The system shall categorize questions into different difficulty levels (Easy, Medium, and Hard) and allow users to access questions based on their preferred or assigned difficulty level.

FR-9: Solution Support.
       The system shall display correct answers and explanations to help students understand their mistakes.

FR-10: Progress Monitoring.
       The system shall track student activity and display basic performance statistics.
       
FR-11: Question Repository.
       The system shall maintain a repository of JEE Main Mathematics questions categorized by chapter and difficulty level.

### Non Functional Requirements (NFR)

NFR-1: Security.
	User passwords shall be stored securely using encryption or hashing mechanisms.

NFR-2: Content Availability.
	The system shall ensure that all approved learning content, including chapters, questions, and solutions, remains consistently accessible to users whenever required during normal system operation.

NFR-3: User-Friendly Interface.
	The system shall provide a simple, intuitive, and visually organized interface that enables users to navigate, access content, and perform tasks with minimal effort and learning time.

NFR-4: Browser Access.
       The system shall be available to users through the website with their web browsers.
___________________________________

## Use Cases 
Following are the use cases and their description.

### UC-1: User Registration

|**Field**|**Description**|
|---|---|
|Use Case ID|UC-1|
|Use Case Name|User Registration|
|Primary Actor|Student|
|Goal|Create a new account on the portal|
|Precondition|User is not already registered|
|Postcondition|User account is created and stored in the<br>database|
|Main Success Scenario|1. User selects Register.<br>2. System displays registration form.<br>3. User enters details.<br>4. System validates details.<br>5. System stores user information.<br>6. System confrms successful registration.|
|Alternative Flow|If email/username already exists, system displays<br>an error message.|



### UC-2: User Login and Authentication

|**Field**|**Description**|
|---|---|
|Use Case ID|UC-2|
|Use Case Name|User Login|
|Primary Actor|Student|
|Goal|Access the portal securely|
|Precondition|User account exists|
|Postcondition|User is authenticated and logged in|
|Main Success Scenario|1. User enters credentials.<br>2. System validates credentials.<br>3. System grants access.<br>4. Dashboard is displayed.|
|Alternative Flow|If credentials are invalid, access is denied.|



### UC-3: User Logout

|**Field**|**Description**|
|---|---|
|Use Case ID|UC-3|
|Use Case Name|User Logout|
|Primary Actor|Student|
|Goal|End the current session securely|
|Precondition|User is logged in|
|Postcondition|Session is terminated|
|Main Success Scenario|1. User selects Logout.<br>2. System terminates the session.<br>3. User is redirected to Login page.|





### UC-4: Browse Mathematics Syllabus

|**Field**|**Description**|
|---|---|
|Use Case ID|UC-4|
|Use Case Name|Mathematics Syllabus Navigation|
|Primary Actor|Student|
|Goal|View chapter-wise syllabus|
|Precondition|User is logged in|
|Postcondition|Selected chapter is displayed|
|Main Success Scenario|1. User opens syllabus.<br>2. System displays all chapters.<br>3. User selects a chapter.|




## **UC-5: Practice Questions** 

|**Field**|**Description**|
|---|---|
|Use Case ID|UC-5|
|Use Case Name|Chapter-wise Practice|
|Primary Actor|Student|
|Goal|Practice Mathematics questions|
|Precondition|User selected a chapter|
|Postcondition|Responses are recorded|
|Main Success Scenario|1. User selects a chapter.<br>2. System retrieves questions.<br>3. User answers questions.<br>4. System stores responses.|




### UC-6: Select Difficulty Level

|**Field**|**Description**|
|---|---|
|Use Case ID|UC-6|
|Use Case Name|Difculty-wise Question Selection|
|Primary Actor|Student|
|Goal|Practice questions based on difculty|
|Precondition|Chapter selected|
|Postcondition|Filtered questions are displayed|
|Main Success Scenario|1. User selects Easy, Medium, or Hard.<br>2. System flters repository.<br>3. System displays matching questions.|



### UC-7: Evaluate Responses

|**Field**|**Description**|
|---|---|
|Use Case ID|UC-7|
|Use Case Name|Question Evaluation|
|Primary Actor|Student|
|Goal|Check answer correctness|
|Precondition|User submitted an answer|
|Postcondition|Feedback is displayed|
|Main Success Scenario|1. System compares response with the correct answer.<br>2. System determines correctness.<br>3. System displays feedback.|


### UC-8: View Solutions

|**Field**|**Description**|
|---|---|
|Use Case ID|UC-8|
|Use Case Name|Solution Support|
|Primary Actor|Student|
|Goal|Learn from mistakes|
|Precondition|Evaluation completed|
|Postcondition|Explanation is displayed|
|Main Success Scenario|1. User requests solution.<br>2. System retrieves explanation.<br>3. System displays solution.|




### UC-9: Monitor Progress

|**Field**|**Description**|
|---|---|
|Use Case ID|UC-9|
|Use Case Name|Progress Monitoring|
|Primary Actor|Student|
|Goal|View performance statistics|
|Precondition|User has attempted questions|
|Postcondition|Statistics are displayed|
|Main Success Scenario|1. System retrieves activity data.<br>2. System calculates performance metrics.<br>3. Dashboard is displayed.|



### UC-10: AI-Based Recommendation Generation

|**Field**|**Description**|
|---|---|
|Use Case ID|UC-10|
|Use Case Name|AI Recommendation System|
|Primary Actor|Student|
|Secondary Actor|AI Engine|
|Goal|Provide personalized study recommendations|
|Precondition|Performance data exists|
|Postcondition|Recommendations are displayed|
|Main Success Scenario|1. System collects performance data.<br>2. AI analyzes weak areas.<br>3. AI identifes chapters/topics requiring improvement.<br>4. System recommends questions and difficultylevels.|
___________________________

## Use Case Modelling
<img width="759" height="588" alt="WhatsApp Image 2026-06-24 at 13 48 22" src="https://github.com/user-attachments/assets/416ca05a-0a34-4ae7-a073-5606ac3f467a" />

_______________________

## User Stories
These are the user stories generated from the requirements :-

### User Story 1: User Registration

#### As a student, I want to create an account so that I can securely access the JEE Mathematics practice portal.

->Back of the Card (Acceptance Criteria):

* The system shall provide a registration form.

* The student shall enter name, email, username, and password.

* The system shall validate mandatory fields.

* Duplicate email addresses shall not be allowed.

* The account shall be created successfully after validation.



### User Story 2: User Login

#### As a student, I want to log into my account so that I can access my practice sessions, performance data, and recommendations.

->Back of the Card (Acceptance Criteria):

* The student shall enter valid credentials.

* The system shall authenticate the user.

* Invalid credentials shall display an error message.

* Successful login shall redirect the student to the dashboard.



### User Story 3: User Logout

#### As a student, I want to securely log out of my account so that unauthorized users cannot access my information.

->Back of the Card (Acceptance Criteria):

* The student shall be able to click a Logout button.

* The system shall terminate the active session.

* The student shall be redirected to the Login page.



### User Story 4: Browse Mathematics Syllabus

#### As a student, I want to browse the JEE Main Mathematics syllabus chapter-wise so that I can choose topics to study and practice.

->Back of the Card (Acceptance Criteria):

* The system shall display all Mathematics chapters.

* Chapters shall be organized clearly.

* The student shall be able to select a chapter.



User Story 5: Practice Chapter-wise Questions

#### As a student, I want to practice questions from selected chapters so that I can improve my understanding of Mathematics concepts.

->Back of the Card (Acceptance Criteria)

* The student shall be able to choose a chapter.

* The system shall retrieve questions for that chapter.

* Questions shall be displayed one by one or as a set.

* Student responses shall be recorded.

* 

### User Story 6: Select Difficulty Level

#### As a student, I want to choose Easy, Medium, or Hard questions so that I can practice according to my preparation level.

->Back of the Card (Acceptance Criteria):

* The student shall be able to select a difficulty level.

* The system shall filter questions accordingly.

* Only relevant questions shall be displayed.



### User Story 7: Immediate Evaluation

#### As a student, I want my answers to be evaluated immediately so that I can know whether my answers are correct.

->Back of the Card (Acceptance Criteria);

* The student shall submit an answer.

* The system shall compare it with the correct answer.

* The result shall be displayed instantly.

* Correct and incorrect responses shall be indicated.



### User Story 8: View Solutions and Explanations

#### As a student, I want to view correct answers and explanations so that I can learn from my mistakes.

->Back of the Card (Acceptance Criteria):

* The student shall be able to request a solution.

* The system shall display the correct answer.

* The system shall display a detailed explanation.



### User Story 9: Track Progress

#### As a student, I want to monitor my performance statistics so that I can identify my strengths and weaknesses.

->Back of the Card (Acceptance Criteria):

* The system shall track attempted questions.

* The system shall calculate accuracy.

* The system shall display chapter-wise performance.

* The system shall highlight weak areas.



### User Story 10: Receive AI-Based Recommendations

#### As a student, I want personalized study recommendations based on my performance so that I can focus on topics that need improvement.

->Back of the Card (Acceptance Criteria):

* The system shall analyze performance data.

* Weak chapters shall be identified.

* Recommended chapters and difficulty levels shall be displayed.

* Recommendations shall update as performance changes.



### User Story 11: Manage Question Repository

#### As an administrator, I want to organize and maintain questions by chapter, topic, and difficulty level so that students receive structured practice material.

->Back of the Card (Acceptance Criteria):

* The administrator shall add new questions.

* The administrator shall update existing questions.

* The administrator shall delete incorrect questions.

* Questions shall be categorized by chapter and difficulty.



### User Story 12: Maintain Learning Content

#### As an administrator, I want to manage learning content so that students always have access to accurate and updated study material.

->Back of the Card (Acceptance Criteria):

* The administrator shall update chapters and solutions.

* The system shall make updated content available to students.

* Only approved content shall be published.


