
let currentQuestionIndex = 0;
let score = 0;
let questions = [];
let selectedCategory = "9";
let selectedDifficulty = "easy";
let numberOfQuestions = 10;

async function getCategories() {
  const response = await fetch("https://opentdb.com/api_category.php");
  const data = await response.json();
  const categorySelect = document.getElementById("categories");
  categorySelect.innerHTML = "";
  categorySelect.style.display = "flex";
  data.trivia_categories.forEach(category => {
    const categoryDiv = document.createElement("div");
    categoryDiv.classList.add("category");
    categoryDiv.id = category.id;
    categoryDiv.innerHTML = category.name;
    categoryDiv.addEventListener("click",(e)=>{
      document.querySelectorAll(".category").forEach((element)=>{
        element.classList.remove("selected");
      });
      e.target.classList.add("selected");
      selectedCategory = e.target.id;
    });
    categorySelect.appendChild(categoryDiv);
  });
}

function startQuiz() {
  document.querySelector(".quizContainer").style.display = "flex";
  document.querySelector(".controlContainer").style.display = "none";
  document.getElementById("categories").style.display = "none";
  document.querySelector(".scoreContainer").style.display = "none";
  document.querySelector(".question").innerHTML = "";
  currentQuestionIndex = 0;
  getTriviaQuestions();
}
function selectDifficulty() {
  const difficultySelect = document.getElementById("difficulty");
  selectedDifficulty = difficultySelect.value;
}
window.onload = getCategories;  

async function getTriviaQuestions() {
  const difficultyQuery = `&difficulty=${selectedDifficulty}`;
  const response = await fetch(`https://opentdb.com/api.php?amount=${numberOfQuestions}&category=${selectedCategory}${difficultyQuery}&type=multiple`);
  const data = await response.json();
  questions = data.results;
  displayQuestion();
}

function displayQuestion() {
  const questionContainer = document.getElementById("question");
  const optionsContainer = document.getElementById("options");
  const scoreElement = document.getElementById("score");
  const scoreContainer = document.querySelector(".scoreContainer");
  questionContainer.style.display = "flex";
  counter.innerHTML = currentQuestionIndex+1 + "/"+numberOfQuestions;
  if(currentQuestionIndex >= questions.length) {
    scoreContainer.style.display = "flex";
    questionContainer.style.display = "none";
    optionsContainer.innerHTML = "";
    counter.innerHTML = "";
    scoreElement.textContent = `Your score: ${score}/${questions.length}`;
    return;
  }
  const currentQuestion = questions[currentQuestionIndex];
  questionContainer.innerHTML = decodeHTML(currentQuestion.question);
  optionsContainer.innerHTML = "";
  const options = [...currentQuestion.incorrect_answers,currentQuestion.correct_answer];
  let optionCount = 0;
  shuffle(options).forEach(option=>{
    optionCount++;
    const li = document.createElement("li");
    li.textContent = optionCount+". "+decodeHTML(option);
    li.onclick=()=> {
      checkAnswer(option,li,currentQuestion.correct_answer);
    };
    optionsContainer.appendChild(li);
  });
}

function checkAnswer(selectedAnswer,selectedElement,correctAnswer) {
  const optionsContainer = document.getElementById("options");
  const options = optionsContainer.getElementsByTagName("li");
  for(let option of options) {
    if(option.textContent.slice(2).trim()=== decodeHTML(correctAnswer)){
      option.classList.add("correct");
    } 
    option.onclick = null;
  }
  if(selectedAnswer !== correctAnswer) {
    selectedElement.classList.add("incorrect");
  } else {
    score++;
  }
  setTimeout(nextQuestion,1000);
}

function decodeHTML(html) {
  const txt = document.createElement("textArea");
  txt.innerHTML = html;
  return txt.value;
}

function shuffle(array) {
  for(let i= array.length-1;i>0;i--) {
    const j = Math.floor(Math.random()*(i+1));
    [array[i],array[j]] = [array[j],array[i]];
  }
  return array;
}

function nextQuestion() {
  currentQuestionIndex++;
  counter.innerHTML = currentQuestionIndex+1+"/"+numberOfQuestions;
  displayQuestion();
}

function reset() {
  score = 0;
  questions = [];
  selectedCategory = "";
  selectedDifficulty = "easy";
  currentQuestionIndex = 0;
  document.querySelector(".quizContainer").style.display = "none";
  document.querySelector(".controlContainer").style.display = "flex";
  getCategories();
}




























