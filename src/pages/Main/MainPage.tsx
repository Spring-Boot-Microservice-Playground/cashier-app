import { Grid, Box } from "@mui/material";
import { useState } from 'react';
import { CustomerSection } from "./components/CustomerSection";
import { ProductSection } from "./components/ProductSection";
import { TransactionHistorySection } from "./components/TransactionHistorySection";

const transactions = [{id: 1, customer_name: 'aku adalah anak gembala selalu riang serta gembira', date: new Date().toISOString(), cash: 2000000000, change: 3000000, products: [{name: 'chitato', price: 800000, amount: 0, id: 'p1'}, {name: 'beng beng', price: 8000, amount: 8, id: 'p2'}, {name: 'halo halo bandung', price: 8000, amount: 8, id: 'p3'}, {name: 'ibu mota periangan sudah lama beta tidak berjumpa dengan kau', price: 8000, amount: 8, id: 'p4'}]}]

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

        <CustomerSection value={value} setValue={setValue} inputValue={inputValue} setInputValue={setInputValue} options={transactions[0].products} />
        <ProductSection />
        <TransactionHistorySection />

      </Grid>
    </Box>
  );
}