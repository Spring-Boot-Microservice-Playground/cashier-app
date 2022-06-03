import { Grid, Card, Autocomplete, TextField, Typography } from "@mui/material";
import { useContext, useReducer, useState } from "react";
import { ProductsContext } from "../../../App";
import { Product, Receipt } from "../../../TypeDeclaration";
import { CashReceipt } from "./CashReceipt";
import { SelectOrCreateCustomer } from "./SelectOrCreateCustomer";

export enum ActionType {
    REMOVE_ITEM = 'REMOVE_ITEM',
    ADD_ITEM = 'ADD_ITEM',
    CHANGE_AMOUNT = 'CHANGE_AMOUNT',
    INSERT_CASH_AMOUNT = 'INSERT_CASH_AMOUNT'
}

const initialReceipt: Receipt = {transaction: {products: [], cash: 0, change: 0, date: '', customer_name: '', id: ''}, totalPrice: 0}

const handleRemoveItem = (purchasedProducts: Product[], item: Product) => {
    const newList = purchasedProducts?.filter((p: Product) => p.id !== item.id);
    purchasedProducts = newList;
    return purchasedProducts
}

const handleItemSelection = (purchasedProducts: Product[], item: Product) => {
    const isAlreadySelected = purchasedProducts?.find(p => p?.id === item.id) ? true : false
    if (!isAlreadySelected){
        const selectedItemCopy = Object.assign({}, item)
        selectedItemCopy.amount = 1
        purchasedProducts.push(selectedItemCopy)
    }
    return purchasedProducts
}

const handleOnChangeAmountSelectedItem = (purchasedProducts: Product[], item: Product, newAmount: number) => {
    purchasedProducts.every(p => {
        if(p.id === item.id){
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

const reducer = (state: Receipt, action: {type: ActionType, item?: Product, amount?: number, cash?: number}): Receipt => {
    const {type, item, amount, cash} = {...action}
    let updatedpurchasedProducts: Product[] = []
    let [change, totalPrice] = [0, 0]
    switch (type) {
        case ActionType.ADD_ITEM:
            if(typeof item?.id === 'string') {
                updatedpurchasedProducts = handleItemSelection(state.transaction.products, item)
            }
            totalPrice = calculateTotalPrice(updatedpurchasedProducts)
            change = state.transaction.cash - totalPrice
            return {
                transaction: {
                    ...state.transaction,
                    products: updatedpurchasedProducts,
                    change: change
                },
                totalPrice: totalPrice
            }
        case ActionType.CHANGE_AMOUNT:
            if(typeof item?.id === 'string' && typeof amount === 'number') {
                updatedpurchasedProducts = handleOnChangeAmountSelectedItem(state.transaction.products, item, amount)
            }
            totalPrice = calculateTotalPrice(updatedpurchasedProducts)
            change = state.transaction.cash - totalPrice
            return {
                transaction: {
                    ...state.transaction,
                    products: updatedpurchasedProducts,
                    change: change
                },
                totalPrice: totalPrice
            }
        case ActionType.REMOVE_ITEM:
            if(typeof item?.id === 'string') {
                updatedpurchasedProducts = handleRemoveItem(state.transaction.products, item)
            }
            totalPrice = calculateTotalPrice(updatedpurchasedProducts)
            change = state.transaction.cash - totalPrice
            return {
                transaction: {
                    ...state.transaction,
                    products: updatedpurchasedProducts,
                    change: change
                },
                totalPrice: totalPrice
            }
        case ActionType.INSERT_CASH_AMOUNT:
            let userCash = 0
            if(typeof cash === 'number'){
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
        default:
            throw new Error("product section reducer error");
    }
}

export const CreateTransactionSection = (): JSX.Element => {
    const PRODUCTS = useContext(ProductsContext);
    const [receipt, receiptDispatch] = useReducer(reducer, initialReceipt);
    const [searchValue, setSearchValue] = useState<Product | null>(null);
    const [searchInputValue, setSearchInputValue] = useState<string>('');

    return (
        <Grid item xs={5} height='90vh'>
            <Card sx={{p: 2, height: '100%', backgroundColor: "#f5f5f5"}}>
                <SelectOrCreateCustomer />
                <br />
                <Autocomplete
                    sx={{ width: '100%' }}
                    size='small'
                    value={searchValue}
                    onChange={(event: any, newItem: Product | null) => {
                        setSearchValue(newItem)
                        if(typeof newItem?.id === 'string') receiptDispatch({type: ActionType.ADD_ITEM, item: newItem})
                    }}
                    onClose={() => {
                        setSearchInputValue("")
                        setSearchValue(null)
                    }}
                    inputValue={searchInputValue}
                    onInputChange={(event, newInputValue) => setSearchInputValue(newInputValue)}
                    options={PRODUCTS}
                    // filterSelectedOptions={true} // useless since searchValue is cleared everytime
                    // getOptionLabel={(option: Product) => `${option.name} (${option.amount}) Rp. ${option.price}` }
                    renderOption={(props, option: Product) => (
                        <li {...props}>
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
                <CashReceipt receipt={receipt} receiptDispatch={receiptDispatch}/>
            </Card>
        </Grid>
    )
}