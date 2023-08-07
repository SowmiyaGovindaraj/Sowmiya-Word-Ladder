import React, { useState, useEffect } from 'react';
import ErrorAlert from './AlertDialogBox';
import wordList from './DataStub.json'
import './App.css';

const WordLadder = () => {
  const [startWord, setStartWord] = useState('');
  const [endWord, setEndWord] = useState('');
  const [wordLadder, setWordLadder] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isTextboxesDisabled, setIsTextboxesDisabled] = useState(false)

  useEffect(() => {
    setIsButtonDisabled(startWord === '' || endWord === '' || startWord.length !== endWord.length);
    setShowResult(false); // Clear solution on input change
  }, [startWord, endWord]);

  const handleStartWordChange = (e) => {
    setStartWord(e.target.value.trim().replace(/[^A-Za-z]/g, ''));
    setShowResult(false); // Clear solution when input is edited
  };

  const handleEndWordChange = (e) => {
    setEndWord(e.target.value.trim().replace(/[^A-Za-z]/g, ''));
    setShowResult(false); // Clear solution when input is edited
  };

    // Disable the button if start and end words are the same
    const isSameWords = startWord.trim().toLowerCase() === endWord.trim().toLowerCase();

  function findLadder(startWord, endWord, wordList) {
    setIsCalculating(true);
    setTimeout(() => {
      const wordSet = new Set(wordList);
      if (!wordSet.has(endWord) || !wordSet.has(startWord)) {
        setIsButtonDisabled(true);
        setIsTextboxesDisabled(true);
        setIsCalculating(false);
        return setErrorMessage('No solution can be found'); // word not in the dictionary.
      }
    
      const neighborsMap = new Map();
      const ladder = [];
    
      function findNeighbors(word) {
        const neighbors = [];
        for (let i = 0; i < word.length; i++) {
          console.log('ladder 1', word);
          for (let charCode = 97; charCode <= 122; charCode++) {
            console.log('ladder 2', charCode);
            const newWord = word.slice(0, i) + String.fromCharCode(charCode) + word.slice(i + 1);
            console.log('ladder 3', newWord);
            if (wordSet.has(newWord) && newWord !== word) {
              console.log('ladder 4', newWord);
              neighbors.push(newWord);
            }
          }
        }
        return neighbors;
      }
    
      function buildNeighborsMap() {
        for (const word of wordSet) {
          neighborsMap.set(word, findNeighbors(word));
        }
      }
    
      function bfs() {
        const queue = [[startWord]];
        const visited = new Set([startWord]);
    
        while (queue.length) {
          const path = queue.shift();
          const currentWord = path[path.length - 1];
    
          if (currentWord === endWord) {
            return path;
          }
    
          for (const neighbor of neighborsMap.get(currentWord)) {
            if (!visited.has(neighbor)) {
              visited.add(neighbor);
              queue.push([...path, neighbor]);
            }
          }
        }
    
        return [];
      }
    
      buildNeighborsMap();
      ladder.push(...bfs());
      if (ladder.length) {
        findWordLadder(ladder);
      }else {
        setIsButtonDisabled(true);
        setIsTextboxesDisabled(true);
        setIsCalculating(false);
        return setErrorMessage('No solution can be found');
      }
      return ladder;
    }, 500);
  }

  const findWordLadder = (ladder) => {
    setWordLadder(ladder);
    setIsSuccess(true);
    setIsCalculating(false);
    setShowResult(true);
    setIsButtonDisabled(true);
  };
    

  const handleFindWordLadder = () => {
    findLadder(startWord.trim().toLowerCase(), endWord.trim().toLowerCase(), wordList);
  };

  const handleCloseModal = () => {
    setErrorMessage('');
    setStartWord('');
    setEndWord('');
    setIsTextboxesDisabled(false);
  };



  const scrollableStyle = wordLadder.length > 8 ? { maxHeight: '200px', overflowY: 'scroll' } : {};

  return (
    <div className="container d-flex align-items-center justify-content-center vh-100">
      <div className="word-ladder-title">
        {'Word Ladder'.split('').map((char, index) => {
          if (char === ' ') return <span key={index}>&nbsp;&nbsp;&nbsp;</span>; // Add non-breaking space
          return (
            <div key={index} className="title-letter">
              {char}
            </div>
          );
        })}
      </div>
      <div className="word-ladder-container">
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Enter start word (alphabets only)"
            value={startWord}
            onChange={handleStartWordChange}
            disabled={isTextboxesDisabled === true ? 'disabled' : ''}
          />
          {isCalculating && (
            <div className="spinner-container">
              <div className="spinner"></div>
            </div>
          )}
          
        {/* Word Ladder Result */}
        {showResult && isSuccess && !isCalculating && (
          <div className="word-ladder-result">
            <div className="word-ladder-scrollable" style={scrollableStyle}>
              <ul className="word-list">
                {wordLadder.map((word, index) => (
                  <li key={index} className="word-list-item animate__animated animate__fadeInUp">
                    {word}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
          <input
            type="text"
            className="form-control"
            placeholder="Enter end word (alphabets only)"
            value={endWord}
            onChange={handleEndWordChange}
            disabled={isTextboxesDisabled === true ? 'disabled' : ''}
          />
          <button
            onClick={handleFindWordLadder}
            className="btn btn-primary animate__animated animate__heartBeat"
            disabled={!startWord || !endWord || isButtonDisabled || isSameWords}
          >
          Solve
          </button>
          {errorMessage && (
            <ErrorAlert message={errorMessage} onClose={handleCloseModal} />
          )}
        </div>
      </div>
    </div>
  );
};

export default WordLadder;
