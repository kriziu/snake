import { FC } from 'react';
import styled from 'styled-components';

interface CellProps {
  snake: boolean;
  head: boolean;
  fruit: boolean;
}

const Container = styled.div<CellProps>`
  background-color: ${props =>
    props.head
      ? 'var(--color-head)'
      : props.snake
      ? 'var(--color-snake)'
      : props.fruit
      ? 'var(--color-fruit)'
      : 'transparent'};
`;

const Cell: FC<CellProps> = (props): JSX.Element => {
  return <Container {...props}></Container>;
};

export default Cell;
