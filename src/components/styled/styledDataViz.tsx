import React from 'react';
import { Container } from "@mui/material";
import styled from 'styled-components';
import { useMediaQuery } from "@mui/material";


// export const StyledAppContainer = styled(Container)({
//    position: 'relative',
//    [theme.breakpoints.between('sm', 'md')]: {
//     color: 'blue'
//  }
//   });

export const StyledSliderContainer = styled.div`
position: absolute;
right: 10%;
width: 160px;
text-align: center;
z-index: 100;
`;