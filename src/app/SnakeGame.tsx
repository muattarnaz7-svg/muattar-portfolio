'use client';
import React, { useState, useEffect, useRef } from 'react';

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameActive, setGameActive] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const gameStateRef = useRef({
    snake: [{ x: 10, y: 10 }],
    food: { x: 15, y: 15 },
    direction: { x: 1, y: 0 },
    nextDirection: { x: 1, y: 0 },
    score: 0,
  });

  const GRID_SIZE = 20;
  const TILE_SIZE = 20;

  // Initialize game
  const initGame = () => {
    gameStateRef.current = {
      snake: [{ x: 10, y: 10 }],
      food: { x: 15, y: 15 },
      direction: { x: 1, y: 0 },
      nextDirection: { x: 1, y: 0 },
      score: 0,
    };
    setScore(0);
    setGameOver(false);
    setGameActive(true);
  };

  // Draw game
  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = 'rgba(51, 65, 85, 0.3)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * TILE_SIZE, 0);
      ctx.lineTo(i * TILE_SIZE, canvas.height);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i * TILE_SIZE);
      ctx.lineTo(canvas.width, i * TILE_SIZE);
      ctx.stroke();
    }

    const state = gameStateRef.current;

    // Draw snake
    state.snake.forEach((segment, index) => {
      if (index === 0) {
        // Head - cyan gradient
        ctx.fillStyle = '#06b6d4';
        ctx.shadowColor = 'rgba(6, 182, 212, 0.6)';
        ctx.shadowBlur = 10;
      } else {
        // Body - teal
        ctx.fillStyle = '#14b8a6';
        ctx.shadowColor = 'rgba(20, 184, 166, 0.4)';
        ctx.shadowBlur = 5;
      }
      ctx.fillRect(
        segment.x * TILE_SIZE + 1,
        segment.y * TILE_SIZE + 1,
        TILE_SIZE - 2,
        TILE_SIZE - 2
      );
    });

    // Draw food
    ctx.fillStyle = '#ef4444';
    ctx.shadowColor = 'rgba(239, 68, 68, 0.6)';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(
      state.food.x * TILE_SIZE + TILE_SIZE / 2,
      state.food.y * TILE_SIZE + TILE_SIZE / 2,
      TILE_SIZE / 2 - 2,
      0,
      Math.PI * 2
    );
    ctx.fill();

    ctx.shadowColor = 'transparent';
  };

  // Game loop
  useEffect(() => {
    if (!gameActive) return;

    const gameLoop = setInterval(() => {
      const state = gameStateRef.current;
      state.direction = state.nextDirection;

      // Calculate new head position
      const head = state.snake[0];
      const newHead = {
        x: head.x + state.direction.x,
        y: head.y + state.direction.y,
      };

      // Check wall collision
      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE
      ) {
        setGameActive(false);
        setGameOver(true);
        return;
      }

      // Check self collision
      if (state.snake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameActive(false);
        setGameOver(true);
        return;
      }

      state.snake.unshift(newHead);

      // Check food collision
      if (newHead.x === state.food.x && newHead.y === state.food.y) {
        state.score += 10;
        setScore(state.score);
        state.food = {
          x: Math.floor(Math.random() * GRID_SIZE),
          y: Math.floor(Math.random() * GRID_SIZE),
        };
      } else {
        state.snake.pop();
      }

      draw();
    }, 100);

    return () => clearInterval(gameLoop);
  }, [gameActive]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const state = gameStateRef.current;
      switch (e.key.toLowerCase()) {
        case 'arrowup':
        case 'w':
          if (state.direction.y === 0) {
            state.nextDirection = { x: 0, y: -1 };
            e.preventDefault();
          }
          break;
        case 'arrowdown':
        case 's':
          if (state.direction.y === 0) {
            state.nextDirection = { x: 0, y: 1 };
            e.preventDefault();
          }
          break;
        case 'arrowleft':
        case 'a':
          if (state.direction.x === 0) {
            state.nextDirection = { x: -1, y: 0 };
            e.preventDefault();
          }
          break;
        case 'arrowright':
        case 'd':
          if (state.direction.x === 0) {
            state.nextDirection = { x: 1, y: 0 };
            e.preventDefault();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Mobile touch controls
  const handleTouchStart = useRef({ x: 0, y: 0 });

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!handleTouchStart.current) return;
    const state = gameStateRef.current;
    const touch = e.touches[0];
    const diffX = touch.clientX - handleTouchStart.current.x;
    const diffY = touch.clientY - handleTouchStart.current.y;

    if (Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 0 && state.direction.x === 0) {
        state.nextDirection = { x: 1, y: 0 };
      } else if (diffX < 0 && state.direction.x === 0) {
        state.nextDirection = { x: -1, y: 0 };
      }
    } else {
      if (diffY > 0 && state.direction.y === 0) {
        state.nextDirection = { x: 0, y: 1 };
      } else if (diffY < 0 && state.direction.y === 0) {
        state.nextDirection = { x: 0, y: -1 };
      }
    }
  };

  // Initial draw
  useEffect(() => {
    draw();
  }, []);

  return (
    <section className="py-32 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4">
        {/* Left Side - Text */}
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div className="flex flex-col">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400">Interactive</span>
            <h2 className="text-5xl font-extrabold text-slate-100 mt-3 mb-8">Play Snake Game</h2>
            <p className="text-slate-400 mb-8 text-lg leading-relaxed">
              Take a break and test your skills! Use arrow keys or WASD to control the snake. Eat the red food to grow and increase your score. Don't hit the walls or yourself!
            </p>

            {/* Instructions */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6 backdrop-blur mb-8">
              <p className="text-slate-300 font-semibold mb-4">How to Play</p>
              <div className="text-sm text-slate-400 space-y-3">
                <p>🎯 <span className="text-slate-300">Eat the red food to grow</span></p>
                <p>⬆️ <span className="text-slate-300">Use Arrow Keys or WASD</span></p>
                <p>💀 <span className="text-slate-300">Don't hit walls or yourself</span></p>
                <p>📱 <span className="text-slate-300">Swipe on mobile to move</span></p>
              </div>
            </div>

            {/* Button Below Instructions */}
            <div className="flex gap-3">
              {!gameActive && !gameOver && (
                <button
                  onClick={initGame}
                  className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-slate-950 font-bold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-cyan-500/30"
                >
                  🎮 Start Game
                </button>
              )}

              {gameActive && (
                <button
                  onClick={() => setGameActive(false)}
                  className="bg-slate-900 border border-slate-800 hover:border-orange-500 hover:text-orange-400 text-slate-400 font-bold px-8 py-4 rounded-xl transition-all"
                >
                  ⏸️ Pause
                </button>
              )}

              {gameOver && (
                <button
                  onClick={initGame}
                  className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-slate-950 font-bold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-cyan-500/30"
                >
                  🎮 Play Again
                </button>
              )}
            </div>

            {gameOver && (
              <div className="mt-4 bg-red-500/10 border border-red-500/30 rounded-xl p-4 inline-block">
                <p className="text-red-400 font-bold">Game Over!</p>
                <p className="text-slate-300 text-sm mt-1">Final Score: {score}</p>
              </div>
            )}
          </div>

          {/* Right Side - Game */}
          <div className="flex flex-col items-center gap-6">
            {/* Game Canvas */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-4 backdrop-blur shadow-2xl w-full">
              <canvas
                ref={canvasRef}
                width={GRID_SIZE * TILE_SIZE}
                height={GRID_SIZE * TILE_SIZE}
                onTouchStart={(e) => {
                  handleTouchStart.current = {
                    x: e.touches[0].clientX,
                    y: e.touches[0].clientY,
                  };
                }}
                onTouchMove={handleTouchMove}
                className="border border-slate-700 rounded-lg bg-slate-950 touch-none cursor-pointer w-full"
              />
            </div>

            {/* Score */}
            <div className="text-center w-full">
              <div className="text-4xl font-black text-cyan-400 mb-1">{score}</div>
              <p className="text-slate-400">Current Score</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}