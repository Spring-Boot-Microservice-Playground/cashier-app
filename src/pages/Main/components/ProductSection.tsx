import { RemoveCircleOutline } from "@mui/icons-material";
import { Grid, Card, Autocomplete, TextField, Table, TableContainer, Paper, TableBody, TableRow, TableCell, IconButton } from "@mui/material";
import { useRef, useState } from "react";
import { Product } from "../../../TypeDeclaration";

// const pilihan: Product[] = [{name: 'budi', price: 2000, amount: 20}, {name: 'beng beng', amount: 55, price: 1000}]

export const ProductSection = ({products}: {products: Product[]}): JSX.Element => {
    const [selectedProductList, setSelectedProductList] = useState<Product[]>([])
    const [searchValue, setSearchValue] = useState<Product | null>(null);
    const [searchInputValue, setSearchInputValue] = useState<string>('');

    const handleRemoveItem = (pName: string) => {
        const newList = selectedProductList.filter((item) => item?.name !== pName);
        setSelectedProductList(newList);
    }

    const handleItemSelection = (selectedItem: Product | null) => {
        if (selectedItem){
            const selectedProduct = products?.find(p => p?.name === selectedItem?.name)
            const isAlreadySelected = selectedProductList?.find(p => p?.name === selectedItem?.name) ? true : false
            if (!isAlreadySelected && selectedProduct){
                const updatedSelectedProductList = [...selectedProductList, selectedProduct]
                setSelectedProductList(updatedSelectedProductList as Product[])
            }
        }
        
    }

    console.log("isi : " + selectedProductList)

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
                            {selectedProductList?.map((p) => (
                                <SelectedProductItem productItem={p} handleRemoveItem={handleRemoveItem}/>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>
        </Grid>
    )
}

const SelectedProductItem = ({productItem, handleRemoveItem}: {productItem: Product, handleRemoveItem: (pName: string) => void}) => {
    const [selectedProductAmount, setSelectedProductAmount] = useState<string>("1");

    const handleProductAmountInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputAmount = parseInt(e.target.value)
        if(!isNaN(inputAmount))
            inputAmount <= productItem?.amount ? setSelectedProductAmount(inputAmount.toString()) : setSelectedProductAmount(productItem.amount.toString())
        else
            setSelectedProductAmount("1")
    }
    return (
        <TableRow key={productItem?.name}>
            <TableCell sx={{width: '50%'}}>{productItem?.name}</TableCell>
            <TableCell align="center">
                <input 
                    type="number" 
                    min={1} 
                    max={productItem.amount} 
                    value={selectedProductAmount} 
                    onBlur={(e: React.ChangeEvent<HTMLInputElement>) => {
                        handleProductAmountInput(e)
                    }}
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
            <TableCell>{productItem?.price}</TableCell>
            <TableCell>
                <IconButton onClick={() => handleRemoveItem(productItem?.name)}>
                    <RemoveCircleOutline />
                </IconButton>
            </TableCell>
        </TableRow>
    )
}