import { Grid, Card, Autocomplete, TextField, Button } from "@mui/material";
import React from "react";
import { CreateCustomerModal } from "./CreateCustomerModal";

interface propsType {
    value: string | undefined | null, 
    setValue: (v: string | undefined | null) => void, 
    inputValue: string | undefined, 
    setInputValue: (v: string | undefined) => void,
    options: string[]
}

export const CustomerSection = ({value, setValue, inputValue, setInputValue, options}: propsType): JSX.Element => {
    const [open, setOpen] = React.useState<boolean>(false);
    
    return (
        <Grid item xs={4} height='90vh'>
            <Card sx={{p: 2, height: '100%', backgroundColor: "#f5f5f5"}}>
                <Grid container spacing={3} alignItems="center">
                    <Grid item xs={7}>
                        <Autocomplete
                            value={value}
                            onChange={(event: any, newValue: string | undefined | null) => {
                                setValue(newValue);
                            }}
                            inputValue={inputValue}
                            onInputChange={(event, newInputValue) => {
                                setInputValue(newInputValue);
                            }}
                            size='small'
                            freeSolo
                            options={options.map((option) => option)}
                            renderInput={(params) => <TextField {...params} label="Customer" />}
                        />
                    </Grid>
                    <Grid item>
                        <Button variant="contained" size="small" onClick={() => setOpen(true)}>Add New Customer</Button>
                        <CreateCustomerModal open={open} setOpen={setOpen} />
                    </Grid>
                </Grid>
            </Card>
        </Grid>
    )
}