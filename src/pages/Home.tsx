import React from 'react'
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import DataViz from '../components/DataViz'


export default function Home() {
  return (
    <>
    <Container maxWidth="lg">
        <Box>
        <DataViz/>
        </Box>
    </Container>
    </>
  )
}