import { Box, Grid, Button, TextField, Typography, Dialog, DialogContent, Alert, AlertTitle } from '@mui/material';
import React, { FormEvent, useReducer } from 'react';
import { Customer, Product } from '../../../TypeDeclaration';
import axios, { AxiosResponse, AxiosError } from 'axios';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { CreateTransactionActions } from './CreateTransactionSection';

interface FormValuesAndErrors {
    values: Customer,
    errors: CustomerFormErrors
}

type CustomerFormErrors = {
    name_error: string,
    address_error: string
}

interface apiCallFeedback {
    backdropOpen: boolean,
    alertOpen: boolean,
    response: { data: string, status: number }
}

enum ActionType {
    NAME_CHANGED = 'NAME_CHANGED',
    ADDRESS_CHANGED = 'ADDRESS_CHANGED',
    SEND_REQUEST = 'SEND_REQUEST',
    RETRIEVE_RESPONSE = 'RETRIEVE_RESPONSE',
    ALERT_CLOSE = 'ALERT_CLOSE'
}

const validateForm = (inputValue: string): string => {
    let inputValueError = ''

    if (inputValue.length > 40) {
        inputValueError = 'Must be 40 characters or less';
    } else if (inputValue.trim().length === 0) {
        inputValueError = 'Must be filled'
    }

    return inputValueError;
};

const formInputsReducer = (
    state: FormValuesAndErrors,
    action: {
        type: ActionType,
        name?: string,
        address?: string,
    }
): FormValuesAndErrors => {

    const { type, name, address } = { ...action }

    switch (type) {

        case ActionType.NAME_CHANGED:
            let nameError = ''
            if (typeof name === 'string') {
                nameError = validateForm(name)
            }
            return {
                values: {
                    ...state.values,
                    name: name ? name : ''
                },
                errors: {
                    ...state.errors,
                    name_error: nameError
                }
            }

        case ActionType.ADDRESS_CHANGED:
            let addressError = ''
            if (typeof address === 'string') {
                addressError = validateForm(address)
            }
            return {
                values: {
                    ...state.values,
                    address: address ? address : ''
                },
                errors: {
                    ...state.errors,
                    address_error: addressError
                }
            }

        default:
            throw new Error("create customer form reducer error");
    }
}

const apiCallFeedbackReducer = (
    state: apiCallFeedback,
    action: { type: ActionType, response?: { data: string, status: number } }
): apiCallFeedback => {

    const { type, response } = { ...action }
    switch (type) {
        case ActionType.SEND_REQUEST:
            return {
                ...state,
                backdropOpen: true,
                alertOpen: false,
            };

        case ActionType.RETRIEVE_RESPONSE:
            return {
                ...state,
                backdropOpen: false,
                alertOpen: true,
                response: response ? response : { data: 'app error', status: 1 }
            };

        case ActionType.ALERT_CLOSE:
            return {
                ...state,
                backdropOpen: false,
                alertOpen: false,
            };

        default:
            throw new Error("create customer api call feedback reducer error");
    }
}

const initValuesAndErrors: FormValuesAndErrors = {
    values: { name: '', address: '', created_at: '' },
    errors: { name_error: '', address_error: '' }
}

const initApiCallFeedback: apiCallFeedback = {
    backdropOpen: false,
    alertOpen: false,
    response: { data: '', status: 0 }
}

export const CreateCustomerForm = ({
    setModalOpen,
    receiptDispatch,
}: {
    setModalOpen: (modalOpen: boolean) => void,
    receiptDispatch: React.Dispatch<{
        type: CreateTransactionActions;
        item?: Product | undefined;
        amount?: number | undefined;
        cash?: number | undefined;
        customer_name?: string | undefined;
    }>,
}) => {
    const [formValuesAndErrors, formValuesAndErrorsDispatch] = useReducer(formInputsReducer, initValuesAndErrors);
    const [apiCallFeedback, apiCallFeedbackDispatch] = useReducer(apiCallFeedbackReducer, initApiCallFeedback);

    const handleSubmit = (e: FormEvent) => {
        if (formValuesAndErrors.values.name.trim() !== '' && formValuesAndErrors.values.address.trim() !== '') {
            e.preventDefault()
            formValuesAndErrors.values.created_at = new Date().toISOString();
            apiCallFeedbackDispatch({ type: ActionType.SEND_REQUEST })
            setTimeout(() => {
                axios.post<Customer>(`${process.env.REACT_APP_API_URL}customer`, formValuesAndErrors.values)
                    .then((res: AxiosResponse<Customer>) => {
                        apiCallFeedbackDispatch({
                            type: ActionType.RETRIEVE_RESPONSE,
                            response: {
                                data: 'Customer named ' + res.data.name + ' succesfully created',
                                status: res.status
                            }
                        })
                        receiptDispatch({ type: CreateTransactionActions.SELECT_CUSTOMER, customer_name: res.data.name })
                    })
                    .catch((error: AxiosError) => {
                        apiCallFeedbackDispatch({
                            type: ActionType.RETRIEVE_RESPONSE,
                            response: {
                                data: 'Failed to create customer named ' + formValuesAndErrors.values.name,
                                status: Number(error.response?.status)
                            }
                        })
                    });
            }, 1000);
        }
    }


    return (
        <Box paddingX={6} paddingY={3}>
            <form onSubmit={handleSubmit} method='POST'>
                <Grid container justifyContent='center'>
                    <Grid item xs={5}>
                        <Typography display='inline'>Customer Name</Typography>
                    </Grid>
                    <Grid item xs={7}>
                        <TextField
                            size='small'
                            type="text"
                            required
                            onChange={
                                (e: React.ChangeEvent<HTMLInputElement>) => formValuesAndErrorsDispatch({ type: ActionType.NAME_CHANGED, name: e.target.value })
                            }
                            value={formValuesAndErrors.values.name}
                        />
                        {formValuesAndErrors.errors.name_error ? <Typography fontSize='small' color='red'>{formValuesAndErrors.errors.name_error}</Typography> : ''}
                    </Grid>
                </Grid>

                <Grid container justifyContent='center' marginTop={2}>
                    <Grid item xs={5}>
                        <Typography display='inline'>Address</Typography>
                    </Grid>
                    <Grid item xs={7}>
                        <TextField
                            size='small'
                            type="text"
                            required
                            onChange={
                                (e: React.ChangeEvent<HTMLInputElement>) => formValuesAndErrorsDispatch({ type: ActionType.ADDRESS_CHANGED, address: e.target.value })
                            }
                            value={formValuesAndErrors.values.address}
                        />
                        {formValuesAndErrors.errors.address_error ? <Typography fontSize='small' color='red'>{formValuesAndErrors.errors.address_error}</Typography> : ''}
                    </Grid>

                    <Grid item marginTop={3}>
                        <Button
                            disabled={
                                formValuesAndErrors.errors.address_error ||
                                    formValuesAndErrors.errors.name_error ||
                                    !formValuesAndErrors.values.address ||
                                    !formValuesAndErrors.values.name ? true : false
                            }
                            variant='contained'
                            type="submit"
                        >
                            Submit
                        </Button>
                    </Grid>
                </Grid>
            </form>

            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={apiCallFeedback.backdropOpen}
            >
                <CircularProgress color="inherit" />
            </Backdrop>

            <Dialog
                open={apiCallFeedback.alertOpen}
                onClose={() => {
                    apiCallFeedbackDispatch({ type: ActionType.ALERT_CLOSE })
                    setModalOpen(false)
                }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent>
                    {apiCallFeedback.response.status === 200 ?
                        (
                            <Alert severity="success">
                                <AlertTitle>Success {apiCallFeedback.response.status}</AlertTitle>
                                <strong>{apiCallFeedback.response.data}</strong>
                            </Alert>
                        ) :
                        (
                            <Alert severity="error">
                                <AlertTitle>Error {apiCallFeedback.response.status}</AlertTitle>
                                <strong>{apiCallFeedback.response.data}</strong>
                            </Alert>
                        )
                    }
                </DialogContent>
            </Dialog>
        </Box>
    );
};