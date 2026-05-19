const questionBank = [
  {
    type: "single",
    question: "Which language is used for styling web pages?",
    hint: "It is used to design and color websites.", // FIXED: Missing comma
    options: ["HTML", "CSS", "Python", "C++"],
    answer: [1]
  },
  {
    type: "single",
    question: "Which company developed JavaScript?",
    hint: "This company created JavaScript in the 1990s browser era.",
    options: ["Google", "Netscape", "Microsoft", "Apple"],
    answer: [1]
  },
  {
    type: "multi",
    question: "Select all programming languages.",
    hint: "Two options are real programming languages.",
    options: ["Python", "HTML", "Java", "CSS"],
    answer: [0, 2]
  },
  {
    type: "fill",
    question: "HTML stands for HyperText _____ Language.",
    hint: "It starts with letter M.",
    answerText: "Markup"
  },
  {
    type: "single",
    question: "Which keyword declares a variable in JavaScript?",
    hint: "Older JavaScript versions commonly used this keyword.",
    options: ["var", "define", "make", "create"],
    answer: [0]
  }
];

let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let correct = 0;
let attempts = 0;
let timeLeft = 180;
let timer;
let selectedAnswers = [];

const questionText = document.getElementById("questionText");
const optionsContainer = document.getElementById("optionsContainer");
const fillBlankBox = document.getElementById("fillBlankBox");
const fillInput = document.getElementById("fillInput");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const timerDisplay = document.getElementById("timer");
const scoreDisplay = document.getElementById("score");
const correctDisplay = document.getElementById("correctCount");
const rightSideCorrect = document.getElementById("rightSideCorrect");
const attemptsDisplay = document.getElementById("attempts");
const currentQuestionText = document.getElementById("currentQuestion");
const totalQuestions = document.getElementById("totalQuestions");
const questionNumber = document.getElementById("questionNumber");
const questionType = document.getElementById("questionType");
const resultModal = document.getElementById("resultModal");
const finalScore = document.getElementById("finalScore");
const finalCorrect = document.getElementById("finalCorrect");
const finalWrong = document.getElementById("finalWrong");
const accuracy = document.getElementById("accuracy");
const restartBtn = document.getElementById("restartBtn");
const hintBtn = document.getElementById("hintBtn");
const hintBox = document.getElementById("hintBox");
const hintText = document.getElementById("hintText");

function shuffleArray(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function initQuiz() {
  questions = shuffleArray(questionBank);
  currentQuestionIndex = 0;
  score = 0;
  correct = 0;
  attempts = 0;
  timeLeft = 180;
  selectedAnswers = [];

  updateStats();
  loadQuestion();
  startTimer();
}

function startTimer() {
  clearInterval(timer);

  timerDisplay.textContent = "03:00";

  timer = setInterval(() => {
    timeLeft--;

    let mins = Math.floor(timeLeft / 60);
    let secs = timeLeft % 60;

    mins = mins < 10 ? "0" + mins : mins;
    secs = secs < 10 ? "0" + secs : secs;

    timerDisplay.textContent = `${mins}:${secs}`;

    if (timeLeft <= 0) {
      clearInterval(timer);
      finishQuiz();
    }
  }, 1000);
}

function loadQuestion() {
  hintBox.classList.add("hidden");

  const q = questions[currentQuestionIndex];

  currentQuestionText.textContent = currentQuestionIndex + 1;
  totalQuestions.textContent = questions.length;
  questionNumber.textContent = `${currentQuestionIndex + 1} / ${questions.length}`;

  questionText.textContent = q.question;
  optionsContainer.innerHTML = "";
  fillInput.value = "";
  fillBlankBox.classList.add("hidden");
  selectedAnswers = [];

  if (q.type === "single") {
    questionType.textContent = "Single Select";

    q.options.forEach((option, index) => {
      const optionDiv = document.createElement("div");
      optionDiv.className = "option";
      optionDiv.innerHTML = `<strong>${String.fromCharCode(65 + index)}.</strong> ${option}`;

      optionDiv.onclick = () => {
        document.querySelectorAll(".option").forEach(opt => {
          opt.classList.remove("selected");
        });

        optionDiv.classList.add("selected");
        selectedAnswers = [index];
      };

      optionsContainer.appendChild(optionDiv);
    });
  }

  else if (q.type === "multi") {
    questionType.textContent = "Multi Select";

    q.options.forEach((option, index) => {
      const optionDiv = document.createElement("div");
      optionDiv.className = "option";
      optionDiv.innerHTML = `<strong>${String.fromCharCode(65 + index)}.</strong> ${option}`;

      optionDiv.onclick = () => {
        optionDiv.classList.toggle("selected");

        if (selectedAnswers.includes(index)) {
          selectedAnswers = selectedAnswers.filter(i => i !== index);
        } else {
          selectedAnswers.push(index);
        }
      };

      optionsContainer.appendChild(optionDiv);
    });
  }

  else if (q.type === "fill") {
    questionType.textContent = "Fill in the Blank";
    fillBlankBox.classList.remove("hidden");
  }
}

function checkAnswer() {
  const q = questions[currentQuestionIndex];
  attempts++;

  let isCorrect = false;

  if (q.type === "fill") {
    const userAnswer = fillInput.value.trim().toLowerCase();
    isCorrect = userAnswer === q.answerText.toLowerCase();
  } else {
    const sortedUser = [...selectedAnswers].sort();
    const sortedAnswer = [...q.answer].sort();

    isCorrect = JSON.stringify(sortedUser) === JSON.stringify(sortedAnswer);
  }

  if (isCorrect) {
    score += 100;
    correct++;
  }

  updateStats();
}

function updateStats() {
  scoreDisplay.textContent = `${score} pts`;
  correctDisplay.textContent = correct;
  rightSideCorrect.textContent = correct;
  attemptsDisplay.textContent = attempts;
}

nextBtn.onclick = () => {
  checkAnswer();

  if (currentQuestionIndex < questions.length - 1) {
    currentQuestionIndex++;
    loadQuestion();
  } else {
    finishQuiz();
  }
};

prevBtn.onclick = () => {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    loadQuestion();
  }
};

function finishQuiz() {
  clearInterval(timer);

  resultModal.classList.remove("hidden");

  finalScore.textContent = score;
  finalCorrect.textContent = correct;
  finalWrong.textContent = questions.length - correct;

  const percent = Math.round((correct / questions.length) * 100);
  accuracy.textContent = percent + "%";
}

hintBtn.onclick = () => {
  const q = questions[currentQuestionIndex];
  hintBox.classList.remove("hidden");
  hintText.textContent = q.hint || "No hint available for this question.";
};

restartBtn.onclick = () => {
  resultModal.classList.add("hidden");
  initQuiz();
};

// FIXED: Prevent duplicate scoring when clicking Previous and Next repeatedly
let answeredQuestions = new Set();

nextBtn.onclick = () => {
  if (!answeredQuestions.has(currentQuestionIndex)) {
    checkAnswer();
    answeredQuestions.add(currentQuestionIndex);
  }

  if (currentQuestionIndex < questions.length - 1) {
    currentQuestionIndex++;
    loadQuestion();
  } else {
    finishQuiz();
  }
};

restartBtn.onclick = () => {
  answeredQuestions.clear();
  resultModal.classList.add("hidden");
  initQuiz();
};

// FIXED: Safe initialization after page loads
window.onload = () => {
  initQuiz();
};