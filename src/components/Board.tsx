import { FC } from 'react';
import styled from 'styled-components';
import Cell from './Cell';

const Container = styled.div`
  width: 100rem;
  height: 100rem;
  margin-left: 50%;
  margin-top: 5%;
  display: flex;
  flex-wrap: wrap;

  transform: translateX(-50%);
`;

let cells: { snake: boolean }[][] = [[], [], [], [], [], [], [], [], [], []];

cells.forEach((e, i) => {
  for (let j = 0; j < 10; j++) {
    cells[i].push({ snake: false });
  }
});

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
