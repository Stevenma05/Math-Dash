import React, { useState, useEffect } from 'react';
import './App.css';
import logo from "./Assets/logo.png"

function App() {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(1); // Avoid division by 0
  const [operator, setOperator] = useState('+');
  const [answer, setAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(10);
  const [gameOver, setGameOver] = useState(false);
  const [difficulty, setDifficulty] = useState('easy');

  const operators = ['+', '-', '*', '/'];

  // Generate a random whole number based on difficulty
  const generateNumber = () => {
    switch (difficulty) {
      case 'easy':
        return Math.floor(Math.random() * 5) + 1; // 1 to 5
      case 'intermediate':
        return Math.floor(Math.random() * 6) + 5; // 5 to 10
      case 'hard':
        return Math.floor(Math.random() * 41) + 10; // 10 to 50
      default:
        return Math.floor(Math.random() * 10) + 1;
    }
  };

  // Ensure divisible numbers for division
  const generateDivisionProblem = () => {
    const n1 = generateNumber();
    let n2 = generateNumber();
    while (n1 % n2 !== 0) {
      n2 = generateNumber(); // Regenerate until n1 is divisible by n2
    }
    setNum1(n1);
    setNum2(n2);
    setOperator('/');
  };

  // Generate a random math problem
  const generateProblem = () => {
    const newOperator = operators[Math.floor(Math.random() * operators.length)];

    if (newOperator === '/') {
      generateDivisionProblem(); // Handle division separately
    } else {
      setNum1(generateNumber());
      setNum2(generateNumber());
      setOperator(newOperator);
    }
  };

  // Evaluate the correct answer based on the operator
  const evaluateAnswer = (num1, num2, operator) => {
    switch (operator) {
      case '+':
        return num1 + num2;
      case '-':
        return num1 - num2;
      case '*':
        return num1 * num2;
      case '/':
        return parseFloat((num1 / num2).toFixed(2)); // Allow decimal answers
      default:
        return 0;
    }
  };

  // Handle answer submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const correctAnswer = evaluateAnswer(num1, num2, operator);
    if (parseFloat(answer) === correctAnswer) {
      setScore(score + 1);
      setAnswer('');
      generateProblem(); // New problem on correct answer
      setTimer(10); // Reset timer
    } else {
      setGameOver(true);
    }
  };

  // Timer logic
  useEffect(() => {
    if (timer > 0 && !gameOver) {
      const interval = setInterval(() => setTimer(timer - 1), 1000);
      return () => clearInterval(interval);
    } else if (timer === 0) {
      setGameOver(true);
    }
  }, [timer, gameOver]);

  // Reset the game
  const resetGame = () => {
    setScore(0);
    setAnswer('');
    setTimer(10);
    setGameOver(false);
    generateProblem();
  };

  // Handle difficulty change
  const handleDifficultyChange = (e) => {
    setDifficulty(e.target.value);
    resetGame(); // Reset the game when difficulty changes
  };

  // Generate the first problem on mount
  useEffect(() => {
    generateProblem(); // eslint-disable-next-line
  }, []); 

  return (
    <div>
    <img className='logo' src={logo} alt='logo' />
    <div className="App">
      

      <div className="difficulty-selector">
        <label>Select Difficulty:</label>
        <select value={difficulty} onChange={handleDifficultyChange}>
          <option value="easy">Easy</option>
          <option value="intermediate">Intermediate</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      {gameOver ? (
        <div className="game-over">
          <h2>Game Over!</h2>
          <p>Your Score: {score}</p>
          <button onClick={resetGame}>Play Again</button>
        </div>
      ) : (
        <div className="game">
          <div className="problem">
            <span>{num1}</span>
            <span>{operator}</span>
            <span>{num2}</span>
          </div>

          <form onSubmit={handleSubmit}>
            <input
              type="number"
              step="0.01" // Allow decimal inputs
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              autoFocus
              required
            />
            <button type="submit">Submit</button>
          </form>

          <div className="status">
            <p>Score: {score}</p>
            <p>Time Left: {timer} seconds</p>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}

export default App;
