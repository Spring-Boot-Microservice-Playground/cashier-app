import { Grid, Box } from "@mui/material";
import { useState } from 'react';
import { CreateTransactionSection } from "./components/CreateTransactionSection";
import { TransactionHistorySection } from "./components/TransactionHistorySection";

export const MainPage = (): JSX.Element => {

  return (
    <Box padding={8}>
      <Grid 
        container spacing={5} 
        alignItems="center"
        justifyContent="center"
      >

        <CreateTransactionSection />
        <TransactionHistorySection />

      </Grid>
    </Box>
  );
}