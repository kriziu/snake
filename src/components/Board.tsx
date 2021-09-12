import { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import Cell from './Cell';

const Container = styled.div<{ boardSize: number }>`
  width: 80vw;
  height: 80vw;
  margin-left: 50%;
  margin-top: 30%;
  transform: translateY(-50%);
  transform: translateX(-50%);
  display: grid;
  grid-template-columns: ${props => `repeat(${props.boardSize}, 1fr)`};

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

interface BoardProps {
  snakePosition: number[][];
  fruitPosition: number[];
  boardSize: number;
}

type CellsType = { snake: boolean; fruit: boolean; head: boolean }[][];

const Board: FC<BoardProps> = ({
  snakePosition,
  fruitPosition,
  boardSize,
}): JSX.Element => {
  const [cells, setCells] = useState<CellsType>([[]]);

  useEffect(() => {
    let cellsCreated: CellsType = [];
    for (let i = 0; i < boardSize; i++) {
      cellsCreated.push([]);

      for (let j = 0; j < boardSize; j++) {
        cellsCreated[i].push({ snake: false, fruit: false, head: false });
      }
    }

    console.log(cellsCreated);

    setCells(cellsCreated);
  }, [boardSize]);

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

  return <Container boardSize={boardSize}>{renderCells()}</Container>;
};

export default Board;
