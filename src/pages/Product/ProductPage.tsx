import { Box, Card, Grid, TextField, Autocomplete, Button } from '@mui/material';
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import * as React from 'react';
import axios, {AxiosResponse} from 'axios';
import { AddOrUpdateProductModal } from './components/AddOrUpdateProductModal';

const options = ["dono", "casino", "indro"];

interface Product {
    name: string;
    price: number;
    amount: number;
}

export default function ProductPage() {
    const [value, setValue] = React.useState<string | null>()
    const [inputValue, setInputValue] = React.useState<string | undefined>('')
    const [pageSize, setPageSize] = React.useState<number>(5);
    const [rows, setRows] = React.useState<GridRowsProp>([]);
    const [pageNo, setPageNo] = React.useState<number>(0);
    const [rowCount, setRowcount] = React.useState<number>(0);
    const [open, setOpen] = React.useState<boolean>(false);

    React.useEffect(() => {
        axios.get<Product[]>(`${process.env.REACT_APP_API_URL}product?pageSize=${pageSize}&pageNo=${pageNo}`)
            .then((res: AxiosResponse) => {
                setRowcount(res.data?.totalElements)
                setRows(res.data?.content)
            })
            .catch((error) => {
                console.clear()
                console.log("error " + error.toJSON())
                console.log("error " + error.message)
            })
    }, [pageNo, pageSize]);

    const columns: GridColDef[] = [
        { field: 'name', headerName: 'Product Name', flex: 2, headerAlign: 'center', align: 'center'},
        { field: 'price', headerName: 'Price', flex: 1, headerAlign: 'center', align: 'center'},
        { field: 'amount', headerName: 'Amount', flex: 1, headerAlign: 'center', align: 'center'}
    ];

    return (
        <Box padding={8}>
            <Grid container spacing={4} paddingY={4} alignItems="center" justifyItems="center">
                <Grid item xs={8}>
                    <Autocomplete
                        value={value}
                        onChange={(event: any, newValue: string | null) => {
                        setValue(newValue);
                        }}
                        inputValue={inputValue}
                        onInputChange={(event, newInputValue) => {
                        setInputValue(newInputValue);
                        }}
                        size='small'
                        freeSolo
                        options={options.map((option) => option)}
                        renderInput={(params) => <TextField {...params} label="Search Product" />}
                    />
                </Grid>
                <Grid item xs={4}>
                    <AddOrUpdateProductModal open={open} setOpen={setOpen} isUpdate/>
                    <Button size="small" variant="contained" onClick={() => setOpen(true)}>Add New Product</Button>
                </Grid>
            </Grid>
            <Box height='70vh'>
                <Card sx={{height: '100%', backgroundColor: "#f5f5f5", padding: 4}}>
                    <DataGrid
                        pageSize={pageSize}
                        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                        rowsPerPageOptions={[2,5]}
                        pagination
                        paginationMode="server"
                        onPageChange={(page) => setPageNo(page)}
                        rowCount={rowCount}
                        rows={rows} columns={columns}
                    />
                </Card>
            </Box>
        </Box>
    );
}
