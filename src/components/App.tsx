import { FC, RefCallback, useEffect, useRef, useState } from 'react';
import Board from './Board';
import Pause from './Pause';
import GlobalStyle from './GlobalStyles';
import styled from 'styled-components';
import { useSwipeable } from 'react-swipeable';

enum DIRECTION {
  UP,
  DOWN,
  LEFT,
  RIGHT,
}

const initialSnakePos = [
  [4, 4],
  [4, 4],
  [4, 4],
];

const initialFruitPos = [3, 3];

const Score = styled.h1`
  font-weight: 500;
  font-size: 5vw;
  position: absolute;
  top: 23vw;
  width: 100%;
  text-align: center;

  @media (min-width: 500px) {
    top: 10vw;
    font-size: 4vw;
  }

  @media (min-width: 800px) {
    top: 2vw;
    font-size: 2vw;
  }
`;

const Input = styled.input`
  font-size: 5vw;
  position: absolute;
  top: 43vw;
  width: 40%;
  text-align: center;
  background-color: rgba(255, 255, 255, 0.1);
  border: none;
  margin-left: 50%;
  transform: translateX(-50%);
  color: var(--color-white);

  :focus {
    outline: none;
    border: 1px solid var(--color-white);
  }

  @media (min-width: 500px) {
    top: 20vw;
    font-size: 4vw;
    width: 25%;
  }

  @media (min-width: 800px) {
    top: 10vw;
    font-size: 2vw;
    width: 20%;
  }
`;

const App: FC = (): JSX.Element => {
  const [snake, setSnake] = useState(initialSnakePos);
  const [fruit, setFruit] = useState(initialFruitPos);
  const [pause, setPause] = useState(true);
  const [boardSize, setBoardSize] = useState(10);
  const [boardSizeInput, setBoardSizeInput] = useState('10');
  const [gameOver, setGameOver] = useState(false);
  const [direction, setDirection] = useState(DIRECTION.UP);
  const score = useRef(0);
  const time = useRef<NodeJS.Timeout>();

  const { ref } = useSwipeable({
    onSwiped: () => {
      setPause(false);
      setGameOver(false);
    },
    onSwipedUp: () =>
      direction !== DIRECTION.DOWN && setDirection(DIRECTION.UP),
    onSwipedDown: () =>
      direction !== DIRECTION.UP && setDirection(DIRECTION.DOWN),
    onSwipedLeft: () =>
      direction !== DIRECTION.RIGHT && setDirection(DIRECTION.LEFT),
    onSwipedRight: () =>
      direction !== DIRECTION.LEFT && setDirection(DIRECTION.RIGHT),
    preventDefaultTouchmoveEvent: true,
  }) as { ref: RefCallback<Document> };

  useEffect(() => {
    ref(document);
  });

  const makeNewSnake = () => {
    const newSnake: number[][] = [];

    if (newSnake.length === 0) {
      switch (direction) {
        case DIRECTION.RIGHT:
          newSnake.push([snake[0][0], snake[0][1] + 1]);
          break;
        case DIRECTION.LEFT:
          newSnake.push([snake[0][0], snake[0][1] - 1]);
          break;
        case DIRECTION.UP:
          newSnake.push([snake[0][0] - 1, snake[0][1]]);
          break;
        case DIRECTION.DOWN:
          newSnake.push([snake[0][0] + 1, snake[0][1]]);
          break;
      }
    }

    newSnake.forEach(pos => {
      if (pos[0] === -1 || pos[0] === boardSize) setGameOver(true);
      else if (pos[1] === -1 || pos[1] === boardSize) setGameOver(true);
    });

    snake.forEach(ceil => {
      newSnake.push(ceil);
    });

    for (let i = 1; i < newSnake.length; i++) {
      if (JSON.stringify(newSnake[i]) === JSON.stringify(newSnake[0])) {
        setGameOver(true);
      }
    }

    if (newSnake[0][0] === fruit[0] && newSnake[0][1] === fruit[1]) {
      let fruitPos: number[] = [];
      score.current++;
      let random = false;

      while (!random) {
        fruitPos = [
          Math.floor(Math.random() * boardSize),
          Math.floor(Math.random() * boardSize),
        ];
        random = true;

        for (let i = 0; i < newSnake.length; i++) {
          if (JSON.stringify(newSnake[i]) === JSON.stringify(fruitPos)) {
            random = false;
          }
        }
      }

      setFruit(fruitPos);
    } else newSnake.pop();

    setSnake(newSnake);
  };

  const setDirectionListener = (e: KeyboardEvent) => {
    if (e.key === 'ArrowUp' && direction !== DIRECTION.DOWN)
      setDirection(DIRECTION.UP);
    else if (e.key === 'ArrowDown' && direction !== DIRECTION.UP)
      setDirection(DIRECTION.DOWN);
    else if (e.key === 'ArrowLeft' && direction !== DIRECTION.RIGHT)
      setDirection(DIRECTION.LEFT);
    else if (e.key === 'ArrowRight' && direction !== DIRECTION.LEFT)
      setDirection(DIRECTION.RIGHT);
  };

  const setPauseFalse = (e: KeyboardEvent) => {
    if (!(e.target instanceof HTMLInputElement) || e.key === 'Enter')
      setPause(false);
  };

  const clearGameOver = (e: KeyboardEvent) => {
    if (!(e.target instanceof HTMLInputElement) || e.key === 'Enter') {
      setGameOver(false);
      score.current = 0;
    }
  };

  const handleBoardSizeChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setBoardSizeInput(e.target.value);
    const value = e.target.value !== '' ? parseInt(e.target.value) : 0;
    if (value >= 5 && value <= 50) {
      setBoardSize(value);
    }
  };

  useEffect(() => {
    if (!pause && !gameOver)
      window.addEventListener('keydown', setDirectionListener);

    if (pause) window.addEventListener('keydown', setPauseFalse);

    makeNewSnake();

    if (gameOver) {
      setSnake(initialSnakePos);
      setFruit(initialFruitPos);
      setDirection(DIRECTION.UP);
      window.addEventListener('keydown', clearGameOver);
    }

    return () => {
      window.removeEventListener('keydown', setDirectionListener);

      window.removeEventListener('keydown', setPauseFalse);

      window.removeEventListener('keydown', clearGameOver);
    };
  }, [direction, pause, gameOver]);

  useEffect(() => {
    time.current && clearTimeout(time.current);

    if (!pause && !gameOver) time.current = setTimeout(makeNewSnake, 200);
  }, [snake, direction, pause, makeNewSnake, gameOver]);

  return (
    <>
      <GlobalStyle />
      <Score>Score: {score.current}</Score>
      <Board
        snakePosition={snake}
        fruitPosition={fruit}
        boardSize={boardSize}
      />
      {pause && (
        <>
          <Pause message="Press any button to start" />
          <Input
            type="number"
            value={boardSizeInput}
            onChange={handleBoardSizeChange}
          />
        </>
      )}
      {gameOver && (
        <>
          <Pause
            message={`Game Over
        Score: ${score.current}
      `}
          />
          <Input
            type="number"
            value={boardSizeInput}
            onChange={handleBoardSizeChange}
          />
        </>
      )}
    </>
  );
};

export default App;
