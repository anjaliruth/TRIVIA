let submitDiv;
let resetButton;
let data;
let correctAnswer;
let incorrectAnswers;
let currentQuestion = 0;
let score = 0;

// Fetch data from API
async function getData() {
  // Get user choices for category & difficulty
  let categoryChoice = document.querySelector("#category").value;
  let difficultyChoice = document.querySelector("#difficulty").value;
  let numOfQChoice = document.querySelector("#noQ").value;


  // Validate user choices
 

  // Fetch data from API
  //${numOfQChoice}
  let response = await fetch(`https://opentdb.com/api.php?amount=1&category=${categoryChoice}&difficulty=${difficultyChoice}&type=multiple`);
  await console.log(response)
  data = await response.json();
  console.log(incorrectAnswers);


  if (!data || data.results.length === 0) {
    alert("Please select a category and level of difficulty.");
    return;
  }
  // Extract answers and shuffle them
  correctAnswer = data.results[currentQuestion].correct_answer;
  incorrectAnswers = data.results[currentQuestion].incorrect_answers;
  let allAnswers = [correctAnswer].concat(incorrectAnswers);
  let shuffledAnswers = random(allAnswers);

  // Create question elements
  let questionNumber = document.createElement("p");
  questionNumber.setAttribute("class", "question-number");
  questionNumber.innerHTML = `Question ${currentQuestion + 1}/${ numOfQChoice}:`;

  let question = document.createElement("p");
  question.setAttribute("class", "question-display");
  question.innerHTML = data.results[currentQuestion].question;

  // Create answer options
  let radioContainer = document.createElement("div");
  radioContainer.setAttribute("class", "radio-container");

  // Create answer elements and append them to the container
  for (let i = 0; i < shuffledAnswers.length; i++) {
    let radio = document.createElement("input");
    radio.setAttribute("type", "radio");
    radio.setAttribute("value", shuffledAnswers[i]);
    radio.setAttribute("name", "question");
    radio.setAttribute("id", `choice${i + 1}`);

    let label = document.createElement("label");
    label.setAttribute("for", `choice${i + 1}`);
    label.textContent = shuffledAnswers[i];

    let miniRadioContainer = document.createElement("div");
    miniRadioContainer.setAttribute("class", `radio-container${i + 1}`);
    miniRadioContainer.appendChild(radio);
    miniRadioContainer.appendChild(label);

    radioContainer.appendChild(miniRadioContainer);
  }

  // Create content container and append question elements
  let contentDiv = document.createElement("div");
  contentDiv.setAttribute("class", "contentDiv");
  contentDiv.appendChild(questionNumber);
  contentDiv.appendChild(question);
  contentDiv.appendChild(radioContainer);

  // Append content container to the document
  document.body.appendChild(contentDiv);

  // Create submit button and append it to a separate div
  submitDiv = document.createElement("div");
  submitDiv.appendChild(submitButton);
  document.body.appendChild(submitDiv);

  // Hide start button and display reset button
  startButton.style.display = "none";
  resetButton.style.display = "block";
  console.log("works when i click the start button")
}

// Reset the game
// function resetGame() {
//   // Remove elements
//   document.querySelector(".contentDiv").remove();
//   document.querySelector("#show-answer").remove();

//   // Remove the next button and see score button
//   let nextButton = document.querySelector("#next-button");
//   if (nextButton) nextButton.remove();
//   let seeScoreButton = document.querySelector("#see-score");
//   if (seeScoreButton) seeScoreButton.remove();

//   // Reset global variables
//   currentQuestion = 0;
//   score = 0;

//   // Bring back the dropdown options and start button
//   document.querySelector(".options-container").style.display = "block";
//   document.querySelector("#clicker").style.display = "block";

//   // Remove the reset button
//   resetButton.style.display = "none"
//   submitDiv.style.display = "none"
// }

function resetGame() {
  // Remove elements if they exist
  let contentDiv = document.querySelector(".contentDiv");
  if (contentDiv) contentDiv.remove();
  
  let showAnswer = document.querySelector("#show-answer");
  if (showAnswer) showAnswer.remove();

  
  let nextButton = document.querySelector("#next-button");
  if (nextButton) nextButton.remove();

  let endGameMessage = document.querySelector("#end-game");
  if (endGameMessage) endGameMessage.remove();

  let finalScore = document.querySelector("#final-score");
  if (finalScore) finalScore.remove()

  let seeScoreButton = document.querySelector("#see-score");
  if (seeScoreButton) seeScoreButton.remove()
  // Reset global variables
  currentQuestion = 0;
  score = 0;

  // Bring back the dropdown options and start button
  document.querySelector(".options-container").style.display = "block";

  document.querySelector("#clicker").style.display = "block";
  // Hide the reset button and submitDiv
  resetButton.style.display = "none";
  submitDiv.style.display = "none";


}


// Randomize array
function random(array) {
  let currentIndex = array.length;
  let temporaryValue, randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

// Add event listeners
resetButton = document.querySelector("#reset");
resetButton.addEventListener("click", resetGame);

let submitButton = document.createElement("button");
submitButton.textContent = "Submit your answer";
submitButton.addEventListener("click", checkAnswer);

let startButton = document.querySelector("#clicker");
startButton.addEventListener("click", getData);

// Check the selected answer
function checkAnswer() {
  let userAnswer = document.querySelector('input[type="radio"]:checked').value;
  let reveal = document.createElement("p");
  reveal.setAttribute("id", "show-answer");

  if (userAnswer === correctAnswer) {
    reveal.textContent = "Correct Answer";
    score++;
  } else {
    reveal.textContent = `Wrong Answer. \n The right answer was ${correctAnswer}`;
  }
  document.body.appendChild(reveal);

  if (currentQuestion < data.results.length - 1) {
    // Create next question button
    let nextButton = document.createElement("button");
    nextButton.setAttribute("id", "next-button");
    nextButton.textContent = "Next Question";
    document.body.appendChild(nextButton);
    nextButton.addEventListener("click", nextQuestion);
  } else if (currentQuestion === data.results.length - 1) {
    // Create game over message and see score button
    let notifyEndGame = document.createElement("p");
    notifyEndGame.setAttribute("id", "end-game");
    notifyEndGame.textContent = "Game Over";
    document.body.appendChild(notifyEndGame);

    let seeScore = document.createElement("button");
    seeScore.setAttribute("id", "see-score")
    seeScore.textContent = "See Score";
    document.body.appendChild(seeScore);
    seeScore.addEventListener("click", showScore);
  }

  // Display the final score
  function showScore() {
    let finalScore = document.createElement("p");
    finalScore.setAttribute("id", "final-score");
    finalScore.textContent = `Your final score is ${score}/${data.results.length}`;
    document.body.appendChild(finalScore);
  }
}

// Display the next question
function nextQuestion() {
  // Remove previous question, answers, and result
  document.querySelector(".question-number").remove();
  document.querySelector(".question-display").remove();
  document.querySelector(".contentDiv").remove();
  document.querySelector("#show-answer").remove();
  submitButton.remove();
  document.querySelector("#next-button").remove();

  if (currentQuestion < data.results.length - 1) {
    // Show the next question
    currentQuestion++;
    getData();
  } else if (currentQuestion === data.results.length - 1) {
    // Show the final score
    let notifyEndGame = document.createElement("p");
    notifyEndGame.setAttribute("id", "end-game");
    notifyEndGame.textContent = "Game Over";
    document.body.appendChild(notifyEndGame);

    let seeScore = document.createElement("button");
    seeScore.textContent = "See Score";
    document.body.appendChild(seeScore);
    seeScore.addEventListener("click", showScore);
  }
}

