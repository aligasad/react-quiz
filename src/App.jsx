import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import './App.css';

function App() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(5);
  const [skipped, setSkipped] = useState(false);
  const [quizEnded, setQuizEnded] = useState(false);
  const [shuffledAnswers, setShuffledAnswers] = useState([]);

  const timerRef = useRef(null);

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const response = await axios.get("https://opentdb.com/api.php?amount=10&type=multiple");
        setQuestions(response.data.results);
      } catch (error) {
        console.error("Error fetching question: ", error);
      }
    }
    fetchQuestions();
  }, []);


  // shuffling the four options-----------
  useEffect(() => {
    if (questions.length > 0) {
      const current = questions[currentQuestionIndex];
      const answers = [...current.incorrect_answers, current.correct_answer];
      setShuffledAnswers(shuffleArray(answers));
    }
  }, [questions, currentQuestionIndex]);

  useEffect(() => {
    if (currentQuestionIndex < questions.length && timer >= 0) {
      timerRef.current = setTimeout(() => {
        if (timer > 0) {
          setTimer(timer - 1);
        } else {
          handleNextQues();
        }
      }, 1000);

      return () => {
        clearTimeout(timerRef.current);
      };
    }
  });

  useEffect(() => {
    if (skipped) {
      handleNextQues();
      setSkipped(false);
    }
  }, [skipped]);

  function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
  }

  function handleSkipQues() {
    setSkipped(true);
  }

  function handleNextQues() {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimer(5);
    } else {
      setQuizEnded(true);
      clearTimeout(timerRef.current);
    }
  }

  function handleAnswerClick(answer) {
    const correct = questions[currentQuestionIndex].correct_answer;
    if (answer === correct) {
      setScore(score + 1);
    }
    handleNextQues();
  }

  if (!questions || questions.length === 0) {
    return (
      // <div className="flex items-center justify-center min-h-screen bg-gray-100 text-xl">
      //   Loading...
      // </div>
      <div className="flex items-center justify-center min-h-screen bg-white">
  <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
</div>

    );
  }

  if (quizEnded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 text-white">
        <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-8 shadow-xl text-center">
          <h2 className="text-3xl font-bold mb-4 text-black">Quiz Completed!</h2>
          <p className="text-xl font-semibold text-rose-500">Your Score: {score} / {questions.length}</p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-400 to-cyan-400 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Quiz Competition</h1>
        <div className="mb-4 text-lg font-semibold text-gray-700">
          Question {currentQuestionIndex + 1} of {questions.length}
        </div>
        <div className="mb-6 text-gray-800 text-lg">
          {currentQuestion.question}
        </div>
        <ul className="grid grid-cols-1 gap-4 mb-6">
          {shuffledAnswers.map((answer, index) => (
            <li key={index}>
              <button
                onClick={() => handleAnswerClick(answer)}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-xl transition duration-200"
              >
                {answer}
              </button>
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between">
          <button
            onClick={handleSkipQues}
            className="bg-yellow-400 hover:bg-yellow-500 text-white py-2 px-4 rounded-xl"
          >
            Skip
          </button>
          <p className="text-gray-700 font-medium">Time left: <span className="text-red-600 font-bold">{timer}</span> sec</p>
        </div>
      </div>
    </div>
  );
}

export default App;
