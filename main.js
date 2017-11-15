function renderQuestion(question) {
  // Clear correct/wrong classes
  $("#answers *").removeClass("answer-correct");
  $("#answers *").removeClass("answer-wrong");
  
  // Clear radio group and enable
  $("[name=answer]").attr("checked", false);
  $("fieldset").attr("disabled", false);
  
  // Toggle back to check answer button
  $("#check-answer").removeClass("hidden");
  $("#next-question").addClass("hidden");
  
  // Write question to DOM
  $("#question").html(`Give the translation of: '${question.question}'`);
  
  // Write answers to DOM
  for (let i = 0; i < question.answers.length; i++) {
    let answer = question.answers[i];
    $(`label[for=answer-${i}`).text(answer);
  }
}

function renderQuestionNumber(questionNumber, totalQuestions) {
  $("#question-num").text(`Question: ${questionNumber} / ${totalQuestions}`);
}

function renderScore(correctAnswers, totalQuestions) {
  $("#score").text(`Score: ${correctAnswers} / ${totalQuestions}`);
}

function loadQuestion(quizStateObj) {
  // Get question from 'questions' array and load information into 'quizStateObj':
  //    - Get current question
  //    - Randomly generate where the correct answer should be among the list of all possible answers
  //    - Put information regarding current question into quizStateObj
  //    - Put correct answer in whatever place was randomly generated
  let currentQuestion = questions[quizStateObj.questionNumber];
  let correctAnswerIdx = Math.floor(Math.random() * currentQuestion.a.length);
  
  quizStateObj.currentQuestionInfo.question = currentQuestion.q;
  quizStateObj.currentQuestionInfo.correctAnswerIdx = correctAnswerIdx;
  quizStateObj.currentQuestionInfo.answers = Array.from(currentQuestion.a);
  
  let correctAnswer = quizStateObj.currentQuestionInfo.answers.shift();
  quizStateObj.currentQuestionInfo.answers.splice(correctAnswerIdx, 0, correctAnswer);
  
  // Increment questionNumber for next time loadQuestion() is run
  quizStateObj.questionNumber++;
  
  // Render question to application
  renderQuestion(quizStateObj.currentQuestionInfo);
  
  // Render question number and score to application
  renderQuestionNumber(quizStateObj.questionNumber, questions.length);
  renderScore(quizStateObj.correctAnswers, questions.length)
}

function renderQuiz(quizStateObj) {
  // Load current question before displaying #questionpage
  loadQuestion(quizStateObj);
  
  // hide #startpage and show #questionpage, footer, and nav
  $("#startpage").toggleClass("hidden");
  $("#questionpage").toggleClass("hidden");
  $("footer").toggleClass("hidden");
  $("nav").toggleClass("hidden").toggleClass("table-cell");
}

function markAnswerCorrect(correctIdx) {
  $(`label[for=answer-${correctIdx}]`).addClass("answer-correct");
}

function markAnswerWrong(selectedIdx, correctIdx) {
  $(`label[for=answer-${selectedIdx}]`).addClass("answer-wrong");
  $(`label[for=answer-${correctIdx}]`).addClass("answer-correct");
}

function checkAnswer(event, quizStateObj) {
  event.preventDefault();
  
  // Get the checked radio button the index integer from the id tag.
  // Compare it to quizStateObj.currentQuestionInfo.correctAnswerIdx
  let checkedRadio = parseInt($("input[name=answer]:checked").attr("data-idx"));
  
  if (checkedRadio === quizStateObj.currentQuestionInfo.correctAnswerIdx) {
    quizStateObj.correctAnswers++;
    markAnswerCorrect(checkedRadio);
    renderScore(quizStateObj.correctAnswers, questions.length);
  } else {
    markAnswerWrong(checkedRadio, quizStateObj.currentQuestionInfo.correctAnswerIdx);
  }
  
  // Disable fieldset until next question is loaded
  $("fieldset").attr("disabled", true);
  
  // Hide check answer button and display next question button
  $("#check-answer").toggleClass("hidden");
  $("#next-question").toggleClass("hidden");
}

function implementEventListeners(quizStateObj) {
  $("#begin-btn").click(function() { renderQuiz(quizStateObj); });
  $("#next-question").on("click", function(event) { loadQuestion(quizStateObj); });
  $("#check-answer").click(function(event) { checkAnswer(event, quizStateObj); });
}

function quizAppInit() {
  // Create an object that will hold the state of the quiz
  const quizState = {
    questionNumber: 0,
    correctAnswers: 0,
    currentQuestionInfo: {
      question: null,
      answers: null,
      correctAnswerIdx: null
    }
  };
  
  // Set up the rest of the quiz
  implementEventListeners(quizState);
}

$(quizAppInit);