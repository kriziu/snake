import { FC } from 'react';
import styled from 'styled-components';

const Header = styled.h1`
  font-weight: 500;
  font-size: 15rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  position: absolute;
  left: 50%;
  top: 20%;
  text-align: center;
  transform: translateX(-50%);
`;

const Background = styled.div`
  background-color: rgba(0, 0, 0, 0.6);
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
`;

const Pause: FC<{ message: string }> = ({ message }): JSX.Element => {
  return (
    <Background>
      <Header>{message}</Header>
    </Background>
  );
};

export default Pause;
