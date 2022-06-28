import { Grid, Autocomplete, TextField, Button } from "@mui/material";
import { useState } from "react";
import { Product } from "../../../TypeDeclaration";
import { CreateCustomerModal } from "./CreateCustomerModal";
import { CreateTransactionActions } from "./CreateTransactionSection";

export const SelectOrCreateCustomer = ({
    receiptDispatch,
    customerList,
    customerSearchValue
}: {
    receiptDispatch: React.Dispatch<{
        type: CreateTransactionActions;
        item?: Product | undefined;
        amount?: number | undefined;
        cash?: number | undefined;
        customer_name?: string | undefined;
    }>,
    customerList: string[],
    customerSearchValue: string
}
): JSX.Element => {
    const [open, setOpen] = useState<boolean>(false);
    // const [searchValue, setSearchValue] = useState<Customer | null>(null);
    const [searchInputValue, setSearchInputValue] = useState<string>('');

    return (
        <Grid container alignItems='center'>
            <Grid item xs={8}>
                <Autocomplete
                    value={customerSearchValue ? customerSearchValue : null}
                    onChange={(event: any, customer: string | null) => {
                        receiptDispatch({ type: CreateTransactionActions.SELECT_CUSTOMER, customer_name: customer?.toString() ? customer.toString() : undefined })
                    }}
                    inputValue={searchInputValue}
                    onInputChange={(event, newInputValue) => setSearchInputValue(newInputValue)}
                    renderInput={(params) => <TextField {...params} label="Select a Customer" />}
                    options={customerList}
                    size='small'
                    getOptionLabel={(option: string) => `${option}`}
                    // isOptionEqualToValue={(option, value) => {
                    //     if (option === value) return true
                    //     else if (value === '') return true
                    //     else return false
                    // }}
                    renderOption={(props, option: string) => (
                        <li {...props}>
                            <Grid container justifyContent='space-between' direction='column'>
                                <Grid item xs={6}>
                                    {option}
                                </Grid>
                            </Grid>
                        </li>
                    )}
                />
            </Grid>
            <Grid item xs={4}>
                <Button onClick={() => setOpen(true)} sx={{ marginLeft: 5 }} variant="contained">New Customer</Button>
                <CreateCustomerModal receiptDispatch={receiptDispatch} open={open} setOpen={setOpen} />
            </Grid>
        </Grid>
    )
}