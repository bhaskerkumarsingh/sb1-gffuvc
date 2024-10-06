import questions from './questions.json';

let currentUser = '';
let currentQuestionIndex = 0;
let userAnswers = [];
let selectedQuestions = [];
const TOTAL_QUESTIONS = 30;

const loginSection = document.getElementById('login');
const testSection = document.getElementById('test');
const resultSection = document.getElementById('result');
const questionElement = document.getElementById('question');
const navigationElement = document.getElementById('navigation');
const userIdInput = document.getElementById('userId');
const createUserButton = document.getElementById('createUser');
const userMessageElement = document.getElementById('userMessage');
const testLinkElement = document.getElementById('testLink');
const submitButton = document.getElementById('submit');

createUserButton.addEventListener('click', createUser);
submitButton.addEventListener('click', submitTest);

// Check for user ID in URL on page load
window.addEventListener('load', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const userIdFromUrl = urlParams.get('userId');
  if (userIdFromUrl) {
    currentUser = userIdFromUrl;
    startTest();
  }
});

function createUser() {
  const userId = userIdInput.value.trim();
  if (userId) {
    currentUser = userId;
    const testUrl = `${window.location.origin}${window.location.pathname}?userId=${encodeURIComponent(userId)}`;
    userMessageElement.textContent = `User ID "${userId}" created successfully.`;
    testLinkElement.innerHTML = `<a href="${testUrl}">Click here to start the test</a>`;
    testLinkElement.style.display = 'block';
    createUserButton.style.display = 'none';
  } else {
    userMessageElement.textContent = 'Please enter a valid user ID.';
  }
}

function startTest() {
  loginSection.style.display = 'none';
  testSection.style.display = 'block';
  
  // Shuffle questions and select the first 30
  selectedQuestions = shuffleArray([...questions]).slice(0, TOTAL_QUESTIONS);
  
  // Initialize user answers
  userAnswers = new Array(TOTAL_QUESTIONS).fill(null);
  
  displayQuestion();
  createNavigation();
}

function displayQuestion() {
  const question = selectedQuestions[currentQuestionIndex];
  questionElement.innerHTML = `
    <h3>Question ${currentQuestionIndex + 1}</h3>
    <p>${question.text}</p>
    ${question.options.map((option, index) => `
      <label>
        <input type="radio" name="answer" value="${index}" 
          ${userAnswers[currentQuestionIndex] === index ? 'checked' : ''}>
        ${option}
      </label><br>
    `).join('')}
  `;
  
  // Add event listener to radio buttons
  const radioButtons = questionElement.querySelectorAll('input[type="radio"]');
  radioButtons.forEach(radio => {
    radio.addEventListener('change', (e) => {
      userAnswers[currentQuestionIndex] = parseInt(e.target.value);
      updateNavigation();
    });
  });

  updateNavigation();
}

function createNavigation() {
  navigationElement.innerHTML = Array(TOTAL_QUESTIONS).fill().map((_, index) => `
    <button class="nav-btn" data-index="${index}">${index + 1}</button>
  `).join('');
  
  navigationElement.addEventListener('click', (e) => {
    if (e.target.classList.contains('nav-btn')) {
      currentQuestionIndex = parseInt(e.target.dataset.index);
      displayQuestion();
    }
  });
}

function updateNavigation() {
  const navButtons = navigationElement.querySelectorAll('.nav-btn');
  navButtons.forEach((btn, index) => {
    if (userAnswers[index] !== null) {
      btn.classList.add('answered');
    } else {
      btn.classList.remove('answered');
    }
  });
}

function submitTest() {
  testSection.style.display = 'none';
  resultSection.style.display = 'block';
  
  // In a real application, you would send the userAnswers to a server here
  console.log('User ID:', currentUser);
  console.log('User Answers:', userAnswers);

  // Display a summary of answered questions
  const answeredCount = userAnswers.filter(answer => answer !== null).length;
  resultSection.innerHTML += `
    <p>You have answered ${answeredCount} out of ${TOTAL_QUESTIONS} questions.</p>
    <p>Your answers have been saved for User ID: ${currentUser}</p>
  `;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}