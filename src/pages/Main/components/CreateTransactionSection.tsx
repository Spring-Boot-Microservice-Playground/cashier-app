import { Grid, Card, Autocomplete, TextField, Typography, Button, Box, Dialog, DialogContent, Alert, AlertTitle } from "@mui/material";
import axios, { AxiosError, AxiosResponse } from "axios";
import { createContext, FormEvent, useContext, useEffect, useReducer, useState } from "react";
import { ProductsContext } from "../../../App";
import { Customer, Product, Transaction } from "../../../TypeDeclaration";
import { CashReceipt } from "./CashReceipt";
import { SelectOrCreateCustomer } from "./SelectOrCreateCustomer";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

export enum CreateTransactionActions {
    REMOVE_ITEM = 'REMOVE_ITEM',
    ADD_ITEM = 'ADD_ITEM',
    SELECT_CUSTOMER = 'SELECT_CUSTOMER',
    CHANGE_AMOUNT = 'CHANGE_AMOUNT',
    INSERT_CASH_AMOUNT = 'INSERT_CASH_AMOUNT',
    CLEAR_TRANSACTION = 'CLEAR_TRANSACTION'
}

export interface Receipt {
    transaction: { products: Product[], cash: number, change: number };
    customer_name: string;
    totalPrice: number;
}

const initialReceipt: Receipt = { transaction: { products: [], cash: 0, change: 0 }, customer_name: '', totalPrice: 0 }

const handleRemoveItem = (purchasedProducts: Product[], item: Product) => {
    const newList = purchasedProducts?.filter((p: Product) => p.id !== item.id);
    purchasedProducts = newList;
    return purchasedProducts
}

const handleItemSelection = (purchasedProducts: Product[], item: Product) => {
    const isAlreadySelected = purchasedProducts?.find(p => p?.id === item.id) ? true : false
    if (!isAlreadySelected) {
        const selectedItemCopy = Object.assign({}, item)
        selectedItemCopy.amount = 1
        purchasedProducts.push(selectedItemCopy)
    }
    return purchasedProducts
}

const handleOnChangeAmountSelectedItem = (purchasedProducts: Product[], item: Product, newAmount: number) => {
    purchasedProducts.every(p => {
        if (p.id === item.id) {
            p.amount = newAmount
            return false
        }
        return true
    })
    return purchasedProducts
}

const calculateTotalPrice = (purchasedProducts: Product[]) => {
    const totalPrice = purchasedProducts.map(p => p.price * p.amount).reduce((prev, curr) => prev + curr, 0)
    return totalPrice
}

const reducer = (
    state: Receipt,
    action: {
        type: CreateTransactionActions,
        item?: Product,
        amount?: number,
        cash?: number,
        customer_name?: string
    }
): Receipt => {
    const { type, item, amount, cash, customer_name } = { ...action }
    let updatedpurchasedProducts: Product[] = []
    let [change, totalPrice] = [0, 0]
    switch (type) {
        case CreateTransactionActions.ADD_ITEM:
            if (typeof item?.id === 'string') {
                updatedpurchasedProducts = handleItemSelection(state.transaction.products, item)
            }
            totalPrice = calculateTotalPrice(updatedpurchasedProducts)
            change = state.transaction.cash - totalPrice
            return {
                ...state,
                transaction: {
                    ...state.transaction,
                    products: updatedpurchasedProducts,
                    change: change
                },
                totalPrice: totalPrice
            }
        case CreateTransactionActions.CHANGE_AMOUNT:
            if (typeof item?.id === 'string' && typeof amount === 'number') {
                updatedpurchasedProducts = handleOnChangeAmountSelectedItem(state.transaction.products, item, amount)
            }
            totalPrice = calculateTotalPrice(updatedpurchasedProducts)
            change = state.transaction.cash - totalPrice
            return {
                ...state,
                transaction: {
                    ...state.transaction,
                    products: updatedpurchasedProducts,
                    change: change
                },
                totalPrice: totalPrice
            }
        case CreateTransactionActions.REMOVE_ITEM:
            if (typeof item?.id === 'string') {
                updatedpurchasedProducts = handleRemoveItem(state.transaction.products, item)
            }
            totalPrice = calculateTotalPrice(updatedpurchasedProducts)
            change = state.transaction.cash - totalPrice
            return {
                ...state,
                transaction: {
                    ...state.transaction,
                    products: updatedpurchasedProducts,
                    change: change
                },
                totalPrice: totalPrice
            }
        case CreateTransactionActions.INSERT_CASH_AMOUNT:
            let userCash = 0
            if (typeof cash === 'number') {
                userCash = cash
                change = cash - state.totalPrice
            }
            return {
                ...state,
                transaction: {
                    ...state.transaction,
                    change: change,
                    cash: userCash
                }
            }
        case CreateTransactionActions.SELECT_CUSTOMER:
            return {
                ...state,
                customer_name: customer_name ? customer_name : ''
            }
        case CreateTransactionActions.CLEAR_TRANSACTION:
            return {
                transaction: {
                    products: [], cash: 0, change: 0
                },
                customer_name: '',
                totalPrice: 0
            }
        default:
            throw new Error("product section reducer error");
    }
}

export const TransactionContext = createContext<{ products: Product[], cash: number, change: number }>(initialReceipt.transaction);

export const CreateTransactionSection = (
    {
        rerenderTransactionHistory,
        setRerenderTransactionHistory
    }: {
        rerenderTransactionHistory: Boolean,
        setRerenderTransactionHistory: React.Dispatch<React.SetStateAction<Boolean>>
    }
): JSX.Element => {
    const PRODUCTS = useContext(ProductsContext);
    const [receipt, receiptDispatch] = useReducer(reducer, initialReceipt);
    const [searchValue, setSearchValue] = useState<Product | null>(null);
    const [searchInputValue, setSearchInputValue] = useState<string>('');
    const [customerList, setCustomerList] = useState<string[]>([]);
    const [responseStatus, setResponseStatus] = useState<Number>(400);
    const [backdropOpen, setBackdropOpen] = useState<boolean>(false);
    const [alertOpen, setAlertOpen] = useState<boolean>(false);

    useEffect(() => {
        axios.get<Customer[]>(`${process.env.REACT_APP_API_URL}customer/search?name=`)
            .then((res: AxiosResponse<Customer[]>) => {
                setCustomerList(res?.data.map(c => c.name))
            })
            .catch((error) => {
                console.log("error :" + error.toJSON())
                console.log("error :" + error.message)
            })
    }, [receipt.customer_name]);

    const handleSubmit = (e: FormEvent) => {
        if (receipt.customer_name && receipt.transaction.cash >= receipt.totalPrice && receipt.totalPrice) {
            const date = new Date().toISOString();
            const data = {
                customer_name: receipt.customer_name,
                date: date,
                cash: receipt.transaction.cash,
                change: receipt.transaction.change,
                products: receipt.transaction.products
            }
            setBackdropOpen(true)
            setTimeout(() => {
                axios.post<Transaction>(`${process.env.REACT_APP_API_URL}transaction`, data)
                    .then((res: AxiosResponse<Transaction>) => {
                        console.log(res.status)
                        if (res.status === 201) {
                            setResponseStatus(res.status)
                            setAlertOpen(true)
                            setRerenderTransactionHistory(!rerenderTransactionHistory)
                        }
                    })
                    .catch((error: AxiosError) => {
                        setAlertOpen(true)
                        console.log(error.message)
                        console.log(error)
                    })
                    .finally(() => {
                        receiptDispatch({ type: CreateTransactionActions.CLEAR_TRANSACTION })
                        setBackdropOpen(false)
                    })
            }, 1000);
        }
    }

    return (
        <>
            <TransactionContext.Provider value={receipt.transaction}>
                <Grid item xs={5} height='90vh'>
                    <Card sx={{ p: 2, height: '100%', backgroundColor: "#f5f5f5", overflow: 'auto' }}>
                        <SelectOrCreateCustomer customerSearchValue={receipt.customer_name} customerList={customerList} receiptDispatch={receiptDispatch} />
                        <br />
                        <Autocomplete
                            sx={{ width: '100%' }}
                            size='small'
                            value={searchValue}
                            onChange={(event: any, newItem: Product | null) => {
                                setSearchValue(newItem)
                                if (typeof newItem?.id === 'string') receiptDispatch({ type: CreateTransactionActions.ADD_ITEM, item: newItem })
                            }}
                            onClose={() => {
                                setSearchInputValue("")
                                setSearchValue(null)
                            }}
                            inputValue={searchInputValue}
                            onInputChange={(event, newInputValue) => setSearchInputValue(newInputValue)}
                            options={PRODUCTS}
                            // filterSelectedOptions={true} // useless since searchValue is cleared everytime
                            getOptionLabel={(option: Product) => `${option.id}`}
                            renderOption={(props, option: Product) => (
                                <li key={option.name} {...props}>
                                    <Grid container justifyContent='space-between'>
                                        <Grid item xs={6}>
                                            <Typography color='gray' variant="caption">name: </Typography>
                                            {option.name}
                                        </Grid>
                                        <Grid item xs={3}>
                                            <Typography color='gray' variant="caption">price: </Typography>
                                            Rp. {option.price}
                                        </Grid>
                                        <Grid item xs={3} paddingLeft={4}>
                                            <Typography color='gray' variant="caption">available: </Typography>
                                            {option.amount}
                                        </Grid>
                                    </Grid>
                                </li>
                            )}
                            renderInput={(params) => <TextField {...params} label="Select Products" />}
                        />
                        <CashReceipt receipt={receipt} receiptDispatch={receiptDispatch} />
                        <Box marginTop={2} sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'row' }}>
                            <Button
                                onClick={handleSubmit}
                                variant="contained"
                                disabled={
                                    !receipt.customer_name ||
                                    !receipt.totalPrice ||
                                    !receipt.transaction.products ||
                                    !receipt.transaction.cash ||
                                    (receipt.totalPrice > receipt.transaction.cash)
                                }
                            >
                                Submit
                            </Button>
                        </Box>
                    </Card>
                    <Backdrop
                        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                        open={backdropOpen}
                    >
                        <CircularProgress color="inherit" />
                    </Backdrop>

                    <Dialog
                        open={alertOpen}
                        onClose={() => {
                            setAlertOpen(false);
                        }}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogContent>
                            {responseStatus === 201 ?
                                (
                                    <Alert severity="success">
                                        <AlertTitle>{`Success ${responseStatus}: Transaction created`}</AlertTitle>
                                    </Alert>
                                ) :
                                (
                                    <Alert severity="error">
                                        <AlertTitle>{`Error ${responseStatus}: Transaction failed`}</AlertTitle>
                                    </Alert>
                                )
                            }
                        </DialogContent>
                    </Dialog>
                </Grid>
            </TransactionContext.Provider>
        </>
    )
}