import { FC } from 'react';
import styled from 'styled-components';
import { BOARD_SIZE } from '../Constants';
import Cell from './Cell';

const Container = styled.div`
  width: 80vw;
  height: 80vw;
  margin-left: 50%;
  margin-top: 30%;
  transform: translateY(-50%);
  transform: translateX(-50%);
  display: grid;
  grid-template-columns: ${props => `repeat(${BOARD_SIZE}, 1fr)`};

  border: 1px solid var(--color-white);

  @media (min-width: 500px) {
    width: 50vw;
    height: 50vw;
    margin-top: 15%;
  }

  @media (min-width: 800px) {
    width: 40vw;
    height: 40vw;
    margin-top: 5%;
  }
`;

let cells: { snake: boolean }[][] = [];
for (let i = 0; i < BOARD_SIZE; i++) {
  cells.push([]);

  for (let j = 0; j < BOARD_SIZE; j++) {
    cells[i].push({ snake: false });
  }
}

interface BoardProps {
  snakePosition: number[][];
  fruitPosition: number[];
}

const Board: FC<BoardProps> = ({
  snakePosition,
  fruitPosition,
}): JSX.Element => {
  const renderCells = (): JSX.Element[][] => {
    return cells.map((line, i) => {
      return line.map((e, j) => {
        let snake = false;
        let head = false;
        let fruit = false;
        snakePosition.forEach((pos, index) => {
          if (pos[0] === i && pos[1] === j) {
            snake = true;
            if (index === 0) head = true;
          }
        });

        if (fruitPosition[0] === i && fruitPosition[1] === j) fruit = true;

        const props = { snake, head, fruit };

        return <Cell key={`${i}${j}`} {...props} />;
      });
    });
  };

  return <Container>{renderCells()}</Container>;
};

export default Board;
