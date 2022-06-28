import { Grid, Card, Typography, List } from "@mui/material";
import axios, { AxiosResponse } from 'axios';
import { useState, useEffect } from "react";
import { TransactionListItem } from "./TransactionListItem";
import { Transaction } from "../../../TypeDeclaration";

// const transactions = [{id: 1, customer_name: 'aku adalah anak gembala selalu riang serta gembira', date: new Date().toISOString(), cash: 2000000000, change: 3000000, products: [{name: 'chitato', price: 80000000, amount: 8}, {name: 'beng beng', price: 8000, amount: 8}, {name: 'halo halo bandung', price: 8000, amount: 8}, {name: 'ibu mota periangan sudah lama beta tidak berjumpa dengan kau', price: 8000, amount: 8}]}]

export const TransactionHistorySection = (
    {
        rerenderTransactionHistory,
    }: {
        rerenderTransactionHistory: Boolean,
    }
): JSX.Element => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        axios.get<Transaction[]>(`${process.env.REACT_APP_API_URL}transaction?start=${new Date('2022-04-10').toISOString().split('T')[0]}`)
            .then((res: AxiosResponse) => {
                setTransactions(res?.data)
            })
            .catch((error) => {
                console.log("error :" + error.toJSON())
                console.log("error :" + error.message)
            })
    }, [rerenderTransactionHistory]);

    return (
        <Grid item xs={5} height='90vh'>
            <Card sx={{ p: 2, height: '100%', backgroundColor: "#f5f5f5", overflow: 'auto' }}>
                <Typography variant='h5' textAlign={'center'}>
                    Transaction History
                </Typography>
                <br />
                {transactions.length === 0 ? <Typography marginTop={30} align="center" variant="subtitle2">No Transaction Yet</Typography> :
                    <List sx={{ width: '100%' }}>
                        {transactions?.map(value => (
                            <TransactionListItem key={value.id} trDetail={value} />
                        ))}
                    </List>
                }
            </Card>
        </Grid>
    )
}