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
  // Get question from 'QUESTIONS' array and load information into 'quizStateObj':
  //    - Get current question
  //    - Randomly generate where the correct answer should be among the list of all possible answers
  //    - Put information regarding current question into quizStateObj
  //    - Put correct answer in whatever place was randomly generated
  let currentQuestion = QUESTIONS[quizStateObj.questionNumber];
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
  renderQuestionNumber(quizStateObj.questionNumber, QUESTIONS.length);
  renderScore(quizStateObj.correctAnswers, QUESTIONS.length);
}

function renderQuiz(quizStateObj) {
  // Load current question before displaying #questionpage
  loadQuestion(quizStateObj);
  
  // hide #startpage and show #questionpage and footer
  $("#startpage").addClass("hidden");
  $("#finalpage").addClass("hidden");
  $("#questionpage").removeClass("hidden");
  $("footer").removeClass("hidden");
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
  let correctIdx = quizStateObj.currentQuestionInfo.correctAnswerIdx;
  
  // Enter historical answer information into quizStateObj.history
  let historyObj = {
    correctAnswer: quizStateObj.currentQuestionInfo.answers[correctIdx],
    userAnswer: quizStateObj.currentQuestionInfo.answers[checkedRadio]
  };
  
  quizStateObj.history.push(historyObj);
  
  // Judge answer
  if (checkedRadio === correctIdx) {
    quizStateObj.correctAnswers++;
    markAnswerCorrect(checkedRadio);
    renderScore(quizStateObj.correctAnswers, QUESTIONS.length);
  } else {
    markAnswerWrong(checkedRadio, quizStateObj.currentQuestionInfo.correctAnswerIdx);
  }
  
  // Disable fieldset until next question is loaded
  $("fieldset").attr("disabled", true);
  
  // Hide check answer button and display next question button (or recap button)
  $("#check-answer").toggleClass("hidden");
  
  if (quizStateObj.questionNumber < 10) {
    $("#next-question").toggleClass("hidden");
  } else {
    $("#recap").toggleClass("hidden");
  }
}

function showResults(quizStateHistory) {
  // Generate list of results and append to #finalpage element
  for (let i = 0; i < quizStateHistory.length; i++) {
    let recapDiv = $("<div>", {"class": "question-recap"});
    let qDiv = $("<div>", {"class": "question"});
    let aDiv = $("<div>", {"class": "answer"});
    
    qDiv.text(`Question: ${QUESTIONS[i].q}`);
    aDiv.text(`Your Answer: ${quizStateHistory[i].userAnswer}`);
    recapDiv.append(qDiv, aDiv);
    
    // If user was wrong, add another div for what the correct answer should have been
    // Also, style recapDiv as .correct or .wrong
    if (quizStateHistory[i].userAnswer !== quizStateHistory[i].correctAnswer) {
      let cDiv = $("<div>", {"class": "answer"});
      cDiv.text(`Correct Answer: ${quizStateHistory[i].correctAnswer}`);
      recapDiv.append(cDiv);
      recapDiv.addClass("wrong");
    } else {
      recapDiv.addClass("correct");
    }
    
    $("#restartquiz").before(recapDiv);
  }
  
  // Display finalpage section
  $("#questionpage").toggleClass("hidden");
  $("#finalpage").toggleClass("hidden");
}

function restartQuiz(quizStateObj) {
  // Reset quizStateObj to initial values
  quizStateObj.questionNumber = 0;
  quizStateObj.correctAnswers = 0;
  quizStateObj.currentQuestionInfo = {
    question: null,
    answers: null,
    correctAnswerIdx: null
  };
  quizStateObj.history = [];
  
  // Restore DOM to original state
  $("#recap").addClass("hidden");
  $(".question-recap").remove();
  
  // Rerender the quiz
  renderQuiz(quizStateObj);
}

function implementEventListeners(quizStateObj) {
  $("#begin-btn").click(function() { renderQuiz(quizStateObj); });
  $("#next-question").click(function() { loadQuestion(quizStateObj); });
  $("#check-answer").click(function(event) { checkAnswer(event, quizStateObj); });
  $("#recap").click(function() { showResults(quizStateObj.history); });
  $("#restartquiz").click(function() { restartQuiz(quizStateObj); });
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