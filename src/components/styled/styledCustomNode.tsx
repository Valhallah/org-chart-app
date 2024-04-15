 // eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import styled from 'styled-components';

interface IStyledCustomNodeProps {
    selected: boolean;
  }

  export const StyledNode = styled.div<IStyledCustomNodeProps>`
  padding: 14% 9%;
  width: 100%;
  overflow: hidden;
  border-radius: 5px;
  background:${(props) => props.selected ? '#fef9fe' : '#dadff7'};
  color: #000000;
  border: ${(props) => (props.selected ? '3px' : '1px')} solid ${(props) => (props.selected ? '#9046cf' : '#494949')};
  font-size: 16px;
  position: relative;
  .react-flow__handle {
    background: ${(props) => props.theme.primary};
    width: 8px;
    height: 10px;
    border-radius: 3px;
  }
`;

export const StyledInfo = styled.div`
  position: relative;
  text-align: center;
  div {
    position: relative;
    display: flex;
    justify-content: center;
    }
`;