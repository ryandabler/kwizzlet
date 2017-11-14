function renderQuestion(question) {
  // Write question to DOM
  $("#question").html(`Give the translation of: '${question.question}'`);
  
  // Write answers to DOM
  for (let i = 0; i < question.answers.length; i++) {
    let answer = question.answers[i];
    $(`label[for=answer-${i}`).text(answer);
  }
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
  console.log(checkedRadio, quizStateObj.currentQuestionInfo.correctAnswerIdx);
  if (checkedRadio === quizStateObj.currentQuestionInfo.correctAnswerIdx) {
    quizStateObj.correctAnswers++;
    console.log("abc")
    markAnswerCorrect(checkedRadio);
  } else {
    markAnswerWrong(checkedRadio, quizStateObj.currentQuestionInfo.correctAnswerIdx);
  }
}

function implementEventListeners(quizStateObj) {
  $("#begin-btn").click(function() { renderQuiz(quizStateObj); });
  $("nav").on("click", function(event) { loadQuestion(quizStateObj); });
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