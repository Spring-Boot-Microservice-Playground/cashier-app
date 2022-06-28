import { RemoveCircleOutline } from "@mui/icons-material";
import { Table, TableContainer, Paper, TableBody, TableRow, TableCell, IconButton, Typography } from "@mui/material";
import { useState, useContext } from "react";
import { numberCommaSeparator } from "../../../helper";
import { ProductsContext } from "../../../App";
import { Product } from "../../../TypeDeclaration";
import { CreateTransactionActions, Receipt } from "./CreateTransactionSection";

export const CashReceipt = ({
        receipt,
        receiptDispatch
    } : {
        receipt: Receipt,
        receiptDispatch: React.Dispatch<{
            type: CreateTransactionActions;
            item?: Product;
            amount?: number;
            cash?: number;
        }>
    }
): JSX.Element => {
    const PRODUCTS = useContext(ProductsContext);

    return (
        <TableContainer sx={{ width: '100%', marginTop: 4 }} component={Paper}>
            <Table stickyHeader size="small">
                <TableBody>
                    <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', minWidth: '50%' }}>Product Name</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }} align="left">Amount</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }} align="left">Price</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }} align="right"></TableCell>
                    </TableRow>
                    {receipt.transaction.products?.map((productItem, index) => (
                        <SelectedProductItem 
                            key={index} 
                            onChangeAmount={(amount: number) => receiptDispatch({type: CreateTransactionActions.CHANGE_AMOUNT, item: productItem, amount: amount})} 
                            maxAmount={(() => {
                                let getAmount = PRODUCTS?.find(p => p.id === productItem.id)?.amount
                                return getAmount ? getAmount : 0
                            })()}
                            productItem={productItem} onItemRemoved={() => receiptDispatch({type: CreateTransactionActions.REMOVE_ITEM, item: productItem})}
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
                                numberCommaSeparator(receipt.transaction.products?.map(p => p.amount * p.price)?.reduce((prevValue, currValue) => prevValue + currValue, 0))
                            }
                            </Typography>
                        </TableCell>
                    </TableRow>
                    <TableRow sx={{ backgroundColor: receipt.transaction.cash >= receipt.totalPrice ? '' : 'red'}}>
                        <TableCell colSpan={2} align="right">
                            <Typography fontWeight="bold">
                                Cash : Rp.
                            </Typography>
                        </TableCell>
                        <TableCell colSpan={2} align="left">
                            <input 
                                min={0}
                                max={10000000} 
                                defaultValue={0}
                                onBlur={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    let value = parseInt(e.target.value)
                                    receiptDispatch({type: CreateTransactionActions.INSERT_CASH_AMOUNT, cash: value})
                                }}
                                onKeyDownCapture={(e: React.KeyboardEvent<HTMLInputElement>) => {
                                    if(e.key === 'Enter' || e.key === "NumpadEnter"){
                                        e.preventDefault()
                                        e.currentTarget.blur()
                                    }
                                }}

                                type="number" 
                                style={{ width: '110px' }}
                            />
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
                                {!isNaN(receipt.transaction.change) && receipt.transaction.change >=0 ? numberCommaSeparator(receipt.transaction.change) : ""}
                            </Typography>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
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