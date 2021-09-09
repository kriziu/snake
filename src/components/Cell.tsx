import { FC } from 'react';
import styled from 'styled-components';

interface CellProps {
  snake: boolean;
  head: boolean;
  fruit: boolean;
}

const Container = styled.div<CellProps>`
  width: 10%;
  height: 10%;

  background-color: ${props =>
    props.head
      ? 'var(--color-head)'
      : props.snake
      ? 'var(--color-snake)'
      : props.fruit
      ? 'var(--color-fruit)'
      : 'transparent'};

  border: 1px solid var(--color-white);
`;

const Cell: FC<CellProps> = (props): JSX.Element => {
  return <Container {...props}></Container>;
};

export default Cell;
