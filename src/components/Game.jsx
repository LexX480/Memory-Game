import React, { useEffect, useState } from 'react'

const Game = () => {
  const [gridSize, setGridSize] = useState(4);
  const [cards, setCards] = useState([]);

  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);
  const [disabled, setDisabled] = useState(false);

  const [won, setWon] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);

  const handleGridSizeChange = (e) => {
    const size = parseInt(e.target.value);
    if (size >= 2 && size <= 10) setGridSize(size);
  };

  const initializeGame = () => {
    const totalCards = gridSize * gridSize; // 16
    const pairCount = Math.floor(totalCards / 2); // 8
    const numbers = [...Array(pairCount).keys()].map((n) => n + 1);
    const shuffledCards = [...numbers, ...numbers]
      .sort(() => Math.random() - 0.5)
      .slice(0, totalCards)
      .map((number, index) => ({ id: index, number }));

    setCards(shuffledCards);
    setFlipped([]);
    setSolved([]);
    setWon(false);
    setFailedAttempts(0);
  };

  useEffect(() => {
    initializeGame();
  }, [gridSize]);

  const checkMatch = (secondId) => {
    const [firstId] = flipped;
    if (cards[firstId].number === cards[secondId].number) {
      setSolved([...solved, firstId, secondId]);
      setFlipped([]);
      setDisabled(false);
    } else {
      setFailedAttempts(prev => prev + 1);
      setTimeout(() => {
        setFlipped([]);
        setDisabled(false);
      }, 1000);
    }
  };

  const handleClick = (id) => {
    if (disabled || won) return;

    if (flipped.length === 0) {
      setFlipped([id]);
      return;
    }

    if (flipped.length === 1) {
      setDisabled(true);
      if (id !== flipped[0]) {
        setFlipped([...flipped, id]);
        // check match logic
        checkMatch(id);
      } else {
        setFlipped([]);
        setDisabled(false);
      }
    }
  };

  const isFlipped = (id) => flipped.includes(id) || solved.includes(id);
  const isSolved = (id) => solved.includes(id);

  useEffect(() => {
    if (solved.length === cards.length && cards.length > 0) {
      setWon(true);
    }
  }, [solved, cards]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-grey-100 p-4">
      <h1 className="text-3xl font-bold mb-6">Memory Game</h1>
      {/* Input */}
      {/* Size Controls */}
      <div className="mb-4 flex items-center space-x-2">
        <label htmlFor="gridSize" className="mr-2">
          Size:
        </label>
        <button
          onClick={() => setGridSize(prev => Math.max(2, prev - 1))}
          className="w-8 h-8 rounded bg-gray-300 hover:bg-gray-400 flex items-center justify-center text-sm"
          disabled={gridSize <= 2}
        >
          −
        </button>
        <span className="w-12 text-center font-medium">{gridSize}</span>
        <button
          onClick={() => setGridSize(prev => Math.min(10, prev + 1))}
          className="w-8 h-8 rounded bg-gray-300 hover:bg-gray-400 flex items-center justify-center text-sm"
          disabled={gridSize >= 10}
        >
          +
        </button>
      </div>

      {/* Game Board */}
      <div
        className={`grid gap-2 mb-4`}
        style={{
          gridTemplateColumns: `repeat(${gridSize}, minmax(0,1fr))`,
          width: `min(100%, ${gridSize * 5.5}rem)`,
        }}
      >
        {cards.map((card) => {
          return (
            <div
              key={card.id}
              onClick={() => handleClick(card.id)}
              className={`aspect-square flex items-center justify-center text-xl font-bold rounded-lg cursor-pointer transition-all duration-300  ${isFlipped(card.id)
                ? isSolved(card.id)
                  ? "bg-green-500 text-white"
                  : "bg-blue-500 text-white"
                : "bg-gray-300 text-gray-400"
                }`}
            >
              {isFlipped(card.id) ? card.number : "?"}
            </div>
          );
        })}
      </div>

      {/* Result */}
      {won && (
        <div className="mt-6 text-center relative">
          {/* Confetti */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(30)].map((_, i) => {
              const style = {
                left: `${Math.random() * 100}%`,
                top: `${-Math.random() * 100}%`,
                backgroundColor: ['#f43f5e', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'][Math.floor(Math.random() * 5)],
                width: `${Math.random() * 4 + 2}px`,
                height: `${Math.random() * 4 + 2}px`,
                opacity: Math.random() * 0.8 + 0.4,
                transform: `rotate(${Math.random() * 360}deg)`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              };
              return (
                <div
                  key={i}
                  className="confetti-piece absolute"
                  style={style}
                ></div>
              );
            })}
          </div>

          {/* Celebratory Text with Animation */}
          <h2
            className="text-5xl sm:text-6xl font-extrabold animate-pop-in"
            style={{
              background: 'linear-gradient(90deg, #ff8a00, #e52e71, #22d1ee, #00d1b2)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 0 20px rgba(255,255,255,0.6)',
            }}
          >
            🎉 You Won! 🎉
          </h2>

          {/* Subtitle with gentle pulse */}
          <p className="text-lg text-gray-700 mt-2 animate-glow-pulse">
            Great memory! Let's play again?
          </p>

          {/* Inline Styles for Animations */}
          <style jsx>{`
      /* Pop-in Animation: Scale up + fade in */
      @keyframes popIn {
        0% {
          opacity: 0;
          transform: scale(0.5);
        }
        70% {
          opacity: 1;
          transform: scale(1.1);
        }
        100% {
          opacity: 1;
          transform: scale(1);
        }
      }

      .animate-pop-in {
        animation: popIn 0.8s ease-out forwards;
      }

      /* Gentle glowing pulse (like heartbeat) */
      @keyframes glowPulse {
        0%, 100% {
          text-shadow: 0 0 20px rgba(255, 255, 255, 0.6),
                       0 0 30px rgba(255, 210, 0, 0.4);
        }
        50% {
          text-shadow: 0 0 15px rgba(255, 255, 255, 0.4),
                       0 0 20px rgba(255, 210, 0, 0.2);
        }
      }

      .animate-glow-pulse {
        animation: glowPulse 2s ease-in-out infinite;
      }

      /* Confetti fall animation */
      @keyframes fall {
        0% {
          transform: translateY(-10px) rotate(0deg);
          opacity: 1;
        }
        100% {
          transform: translateY(100vh) rotate(720deg);
          opacity: 0;
        }
      }

      .confetti-piece {
        position: absolute;
        animation-name: fall;
        animation-timing-function: linear;
        animation-iteration-count: 1;
        animation-fill-mode: forwards;
      }
    `}</style>
        </div>
      )}

      {/* Failed Attempts Counter */}
      {failedAttempts > 0 && (
        <div className="mt-2 text-lg text-red-600 font-medium animate-bounce-once">
          Failed Attempts: {failedAttempts}
        </div>
      )}
      {/* Reset / Play Again Btn */}
      <button
        onClick={initializeGame}
        className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
      >
        {won ? "Play Again" : "Reset"}
      </button>
    </div>
  );
}

export default Game
