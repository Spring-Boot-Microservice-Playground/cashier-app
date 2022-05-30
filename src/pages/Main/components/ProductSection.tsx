import { RemoveCircleOutline } from "@mui/icons-material";
import { Grid, Card, Autocomplete, TextField, Table, TableContainer, Paper, TableBody, TableRow, TableCell, IconButton, Typography } from "@mui/material";
import { useState } from "react";
import { Product } from "../../../TypeDeclaration";

export const ProductSection = ({products}: {products: Product[]}): JSX.Element => {
    const [selectedProductList, setSelectedProductList] = useState<Product[]>([])
    const [searchValue, setSearchValue] = useState<Product | null>(null);
    const [searchInputValue, setSearchInputValue] = useState<string>('');

    const handleRemoveItem = (index: number) => {
        const newList = selectedProductList.filter((item: Product, idx: number) => idx !== index);
        setSelectedProductList(newList);
    }

    const handleItemSelection = (selectedItem: Product | null) => {
        if (selectedItem){
            const isSelectedProductInProductsList: boolean = products?.find(p => p?.name === selectedItem?.name) ? true : false
            const isAlreadySelected = selectedProductList?.find(p => p?.name === selectedItem?.name) ? true : false
            if (!isAlreadySelected && isSelectedProductInProductsList){
                const selectedItemCopy = Object.assign({}, selectedItem)
                selectedItemCopy.amount = 1
                const updatedSelectedProductList = [...selectedProductList, selectedItemCopy]
                setSelectedProductList(updatedSelectedProductList as Product[])
            }
        }
    }

    const handleOnChangeAmountSelectedItem = (index: number, newAmount: number) => {
        const selectedProductListCopy = selectedProductList.slice()
        selectedProductListCopy[index].amount = newAmount
        setSelectedProductList(selectedProductListCopy) 
    }

    return (
        <Grid item xs={4} height='90vh'>
            <Card sx={{p: 2, height: '100%', backgroundColor: "#f5f5f5"}}>
                <Autocomplete
                    size='small'
                    value={searchValue}
                    onChange={(event: any, newValue: Product | null) => {
                        setSearchValue(newValue)
                        handleItemSelection(newValue)
                    }}
                    onClose={() => {
                        setSearchInputValue("")
                        setSearchValue(null)
                    }}
                    inputValue={searchInputValue}
                    onInputChange={(event, newInputValue) => setSearchInputValue(newInputValue)}
                    options={products}
                    // filterSelectedOptions={true} // useless since searchValue is cleared everytime
                    filterOptions={(options: Product[]) => options.filter(p => p.amount > 0)}
                    getOptionLabel={(option: Product) => option.name }
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
                            {selectedProductList?.map((productItem, index) => (
                                <SelectedProductItem 
                                    key={index} 
                                    onChangeAmount={(amount: number) => handleOnChangeAmountSelectedItem(index, amount)} 
                                    maxAmount={(() => {
                                        let getAmount = products?.find(p => p.name === productItem.name)?.amount
                                        return getAmount ? getAmount : 0
                                    })()}
                                    productItem={productItem} onItemRemoved={() => handleRemoveItem(index)}
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
                                            {selectedProductList?.map(p => p.amount * p.price)?.reduce((prevValue, currValue) => prevValue + currValue, 0)}
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
                                        <input type="number" style={{ width: '110px' }}/>
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
            if(inputAmount <= maxAmount){
                setSelectedProductAmount(inputAmount.toString())
                onChangeAmount(inputAmount)
            } else {
                setSelectedProductAmount(maxAmount.toString())
                onChangeAmount(inputAmount)
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
            <TableCell>{productItem?.price * productItem?.amount}</TableCell>
            <TableCell>
                <IconButton onClick={onItemRemoved}>
                    <RemoveCircleOutline />
                </IconButton>
            </TableCell>
        </TableRow>
    )
}