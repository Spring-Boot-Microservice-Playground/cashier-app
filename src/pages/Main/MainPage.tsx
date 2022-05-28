import { Grid, Box } from "@mui/material";
import { useState } from 'react';
import { CustomerSection } from "./components/CustomerSection";
import { ProductSection } from "./components/ProductSection";
import { TransactionHistorySection } from "./components/TransactionHistorySection";

const options = ["dono", "casino", "indro"];

export const MainPage = (): JSX.Element => {
  const [value, setValue] = useState<string | undefined | null>()
  const [inputValue, setInputValue] = useState<string | undefined>('')

  return (
    <Box padding={8}>
      <Grid 
        container spacing={5} 
        alignItems="center"
        justifyItems="center"
      >

        <CustomerSection value={value} setValue={setValue} inputValue={inputValue} setInputValue={setInputValue} options={options} />
        <ProductSection options={options} />
        <TransactionHistorySection />

      </Grid>
    </Box>
  );
}