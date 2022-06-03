import { Grid, Autocomplete, TextField, Button } from "@mui/material";
import { useState } from "react";
import { CreateCustomerModal } from "./CreateCustomerModal";

export const SelectOrCreateCustomer = (): JSX.Element => {
    const [open, setOpen] = useState<boolean>(false);

    return (
        <>
            <Grid container alignItems='center'>
                <Grid item xs={9}>
                    <Autocomplete
                        renderInput={(params) => <TextField {...params} label="Select a Customer" />}
                        options={['halo', 'bandung']}
                        size='small'
                    />
                </Grid>
                <Grid item xs={3}>
                    <Button onClick={() => setOpen(true)} sx={{ marginLeft: 2 }} variant="contained">New Customer</Button>
                    <CreateCustomerModal open={open} setOpen={setOpen} />
                </Grid>
            </Grid>
        </>
    )
}