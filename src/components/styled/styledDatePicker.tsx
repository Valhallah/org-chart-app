import { Typography } from '@mui/material';
 // eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import styled from 'styled-components';

export const StyledHeader = styled(Typography)({
    fontSize: '30px !important', //I never use ! if I can get around it, being used here to save for time
    padding: '16px',
    fontWeight: 'bold !important'
  })

export const StyledInputContainer = styled.div`
position: absolute;
right: 10%;
text-align: center;
margin-top: 100px;
z-index: 100;
`;

export const StyledCenterText = styled.div`
position: relative;
text-align: center;
margin-top: 2%;
`;

export const StyledDateInput = styled.input`
position: relative;
padding: 8px;
border-radius: 4px;
border: 1px solid darkgray;
font-family: sans-serif;
font-size: 19px;
cursor: pointer;
input[type=button] {
    cursor: pointer;
}
`;