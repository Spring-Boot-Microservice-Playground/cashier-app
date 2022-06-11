import { Box, Grid, Button, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { Customer } from '../../../TypeDeclaration';

const validate = (values: Customer) => {
  const errors = {name_error: '', created_at_error: '', address_error: ''};

  if (!values.name) {
    errors.name_error = 'Required';
  } else if (values.name.length > 20) {
    errors.name_error = 'Must be 20 characters or less';
  }
  
  if (!values.address) {
    errors.address_error = 'Required';
  } else if (values.address.length > 80) {
    errors.address_error = 'Must be 80 characters or less';
  }

  return errors;
};

export const CreateCustomerForm = () => {
    const [formValues, setFormValues] = useState<Customer>({
        name: '',
        created_at: '',
        address: '',
    })

    const handleSubmit = () => {
        // call create customer api
    }

    return (
        <Box paddingX={6} paddingY={3}>
            <form onSubmit={handleSubmit}>
                <Grid container justifyContent='center' rowSpacing={2}>
                    <Grid item xs={5}>
                        <Typography display='inline'>Customer Name</Typography>

                    </Grid>
                    <Grid item xs={7}>
                        <TextField
                            size='small'
                            id="customerName"
                            name="customerName"
                            type="text"
                            required
                            onChange={(e) => setFormValues({ ...formValues, name: e.target.value })}
                            value={formValues.name}
                        />
                    </Grid>

                    <Grid item xs={5}>
                        <Typography display='inline'>Address</Typography>
                    </Grid>
                    <Grid item xs={7}>
                        <TextField
                            size='small'
                            id="address"
                            name="address"
                            type="text"
                            required
                            onChange={(e) => setFormValues({ ...formValues, address: e.target.value })}
                            value={formValues.address}
                        />
                    </Grid>

                    <Grid item>
                        <Button variant='contained' type="submit">Submit</Button>
                    </Grid>

                </Grid>
            </form>
        </Box>
    );
};