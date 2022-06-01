import { RemoveCircleOutline } from "@mui/icons-material";
import { Grid, Card, Autocomplete, TextField, Table, TableContainer, Paper, TableBody, TableRow, TableCell, IconButton, Typography } from "@mui/material";
import { useContext, useReducer, useState } from "react";
import { ProductsContext } from "../../../App";
import { numberCommaSeparator } from "../../../helper";
import { Product } from "../../../TypeDeclaration";

interface Receipt {
    purchasedProducts: Product[]
    totalPrice: number
    cash: number
    change: number
}

enum ActionType {
    REMOVE_ITEM = 'REMOVE_ITEM',
    ADD_ITEM = 'ADD_ITEM',
    CHANGE_AMOUNT = 'CHANGE_AMOUNT'
}

const initialReceipt: Receipt = {purchasedProducts: [], totalPrice: 0, cash: 0, change: 0}

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
        // setpurchasedProducts(updatedpurchasedProducts as Product[])
    }
    purchasedProducts.forEach(p => console.log("handleItemSelection: " + p.name + ","))
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
    // setpurchasedProducts(purchasedProductsCopy) 
}

const reducer = (state: Receipt, action: {type: ActionType, item: Product, amount?: number}): Receipt => {
    const {type, item, amount} = {...action}
    let updatedpurchasedProducts: Product[] = []
    switch (type) {
        case ActionType.ADD_ITEM:
            updatedpurchasedProducts = handleItemSelection(state.purchasedProducts, item)
            return {
                ...state,
                purchasedProducts: updatedpurchasedProducts
            }
        case ActionType.CHANGE_AMOUNT:
            updatedpurchasedProducts = handleOnChangeAmountSelectedItem(state.purchasedProducts, item, amount!)
            return {
                ...state,
                purchasedProducts: updatedpurchasedProducts
            }
        case ActionType.REMOVE_ITEM:
            updatedpurchasedProducts = handleRemoveItem(state.purchasedProducts, item)
            return {
                ...state,
                purchasedProducts: updatedpurchasedProducts
            }
        default:
            throw new Error("product section reducer error");
    }
}

export const ProductSection = (): JSX.Element => {
    const PRODUCTS = useContext(ProductsContext);
    const [receipt, receiptDispatch] = useReducer(reducer, initialReceipt);
    const [searchValue, setSearchValue] = useState<Product | null>(null);
    const [searchInputValue, setSearchInputValue] = useState<string>('');

    return (
        <Grid item xs={5} height='90vh'>
            <Card sx={{p: 2, height: '100%', backgroundColor: "#f5f5f5"}}>
                <Autocomplete
                    sx={{ width: '70%' }}
                    size='small'
                    value={searchValue}
                    onChange={(event: any, newItem: Product | null) => {
                        setSearchValue(newItem)
                        if(typeof newItem?.id === 'string') receiptDispatch({type: ActionType.ADD_ITEM, item: newItem})
                        // handleItemSelection(newItem)
                    }}
                    onClose={() => {
                        setSearchInputValue("")
                        setSearchValue(null)
                    }}
                    inputValue={searchInputValue}
                    onInputChange={(event, newInputValue) => setSearchInputValue(newInputValue)}
                    options={PRODUCTS}
                    // filterSelectedOptions={true} // useless since searchValue is cleared everytime
                    getOptionLabel={(option: Product) => `${option.name} (available: ${option.amount}) Rp. ${option.price}` }
                    renderInput={(params) => <TextField {...params} label="Add Product" />}
                />

                <TableContainer sx={{ width: '100%', marginTop: 4 }} component={Paper}>
                    <Table stickyHeader size="small">
                        <TableBody>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', minWidth: '50%' }}>Product Name</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }} align="left">Amount</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }} align="left">Price</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }} align="right"></TableCell>
                            </TableRow>
                            {receipt.purchasedProducts?.map((productItem, index) => (
                                <SelectedProductItem 
                                    key={index} 
                                    onChangeAmount={(amount: number) => receiptDispatch({type: ActionType.CHANGE_AMOUNT, item: productItem, amount: amount})} 
                                    maxAmount={(() => {
                                        let getAmount = PRODUCTS?.find(p => p.id === productItem.id)?.amount
                                        return getAmount ? getAmount : 0
                                    })()}
                                    productItem={productItem} onItemRemoved={() => receiptDispatch({type: ActionType.REMOVE_ITEM, item: productItem})}
                                />
                            ))}
                            <TableRow>
                                    <TableCell colSpan={2} align="right">
                                        <Typography fontWeight="bold">
                                            Total Price : Rp.
                                        </Typography>
                                    </TableCell>
                                    <TableCell colSpan={2} align="left">
                                        <Typography fontWeight="bold">
                                        {
                                            numberCommaSeparator(receipt.purchasedProducts?.map(p => p.amount * p.price)?.reduce((prevValue, currValue) => prevValue + currValue, 0))
                                        }
                                        </Typography>
                                    </TableCell>
                            </TableRow>
                            <TableRow>
                                    <TableCell colSpan={2} align="right">
                                        <Typography fontWeight="bold">
                                            Cash : Rp.
                                        </Typography>
                                    </TableCell>
                                    <TableCell colSpan={2} align="left">
                                        <input min={1} max={10000000} type="number" style={{ width: '110px' }}/>
                                    </TableCell>
                            </TableRow>
                            <TableRow>
                                    <TableCell colSpan={2} align="right">
                                        <Typography fontWeight="bold">
                                            Change : Rp.
                                        </Typography>
                                    </TableCell>
                                    <TableCell colSpan={2} align="left">
                                        <Typography fontWeight="bold">
                                            {receipt.purchasedProducts?.map(p => p.amount * p.price)?.reduce((prevValue, currValue) => prevValue + currValue, 0)}
                                        </Typography>
                                    </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>
        </Grid>
    )
}

const SelectedProductItem = ({
    productItem, 
    onItemRemoved, 
    maxAmount, 
    onChangeAmount
    }: {
        onChangeAmount: (amount: number) => void,
        maxAmount: number, 
        productItem: Product, 
        onItemRemoved: () => void
}) => {
    const [selectedProductAmount, setSelectedProductAmount] = useState<string>("1");

    const handleProductAmountInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputAmount = parseInt(e.target.value)
        if(!isNaN(inputAmount)){
            if(inputAmount <= maxAmount && inputAmount > 0){
                setSelectedProductAmount(inputAmount.toString())
                onChangeAmount(inputAmount)
            } else if(inputAmount > maxAmount) {
                setSelectedProductAmount(maxAmount.toString())
                onChangeAmount(maxAmount)
            } else {
                setSelectedProductAmount("1")
                onChangeAmount(1)
            }
        }
        else {
            setSelectedProductAmount("1")
            onChangeAmount(1)
        }
    }

    return (
        <TableRow>
            <TableCell sx={{width: '50%'}}>{productItem?.name}</TableCell>
            <TableCell align="center">
                <input 
                    type="number" 
                    min={1} 
                    max={maxAmount} 
                    value={selectedProductAmount} 
                    onBlur={(e: React.ChangeEvent<HTMLInputElement>) => handleProductAmountInput(e)}
                    onChange={(e) => setSelectedProductAmount(e.target.value)}
                    onKeyDownCapture={(e: React.KeyboardEvent<HTMLInputElement>) => {
                        if(e.key === 'Enter' || e.key === "NumpadEnter"){
                            e.preventDefault()
                            e.currentTarget.blur()
                        }
                    }}
                    style={{width: '40px'}}
                />
            </TableCell>
            <TableCell>{numberCommaSeparator(productItem?.price * productItem?.amount)}</TableCell>
            <TableCell>
                <IconButton onClick={onItemRemoved}>
                    <RemoveCircleOutline />
                </IconButton>
            </TableCell>
        </TableRow>
    )
}