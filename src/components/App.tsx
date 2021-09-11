import { FC, RefCallback, useEffect, useRef, useState } from 'react';
import Board from './Board';
import Pause from './Pause';
import GlobalStyle from './GlobalStyles';
import { BOARD_SIZE } from '../Constants';
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
  font-size: 2vw;
  position: absolute;
  top: 25vw;
  width: 100%;
  text-align: center;

  @media (min-width: 500px) {
    top: 11vw;
  }

  @media (min-width: 800px) {
    top: 2vw;
  }
`;

const Input = styled.input``;

const App: FC = (): JSX.Element => {
  const [snake, setSnake] = useState(initialSnakePos);
  const [fruit, setFruit] = useState(initialFruitPos);
  const [pause, setPause] = useState(true);
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
      if (pos[0] === -1 || pos[0] === BOARD_SIZE) setGameOver(true);
      else if (pos[1] === -1 || pos[1] === BOARD_SIZE) setGameOver(true);
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
          Math.floor(Math.random() * BOARD_SIZE),
          Math.floor(Math.random() * BOARD_SIZE),
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

  const setPauseFalse = () => {
    setPause(false);
  };

  const clearGameOver = () => {
    setGameOver(false);
    score.current = 0;
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
      <Board snakePosition={snake} fruitPosition={fruit} />
      {pause && <Pause message="Press any button to start" />}
      {gameOver && (
        <Pause
          message={`Game Over
        Score: ${score.current}
      `}
        />
      )}
    </>
  );
};

export default App;
