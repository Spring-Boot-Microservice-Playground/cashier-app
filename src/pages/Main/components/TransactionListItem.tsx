import { Box, Typography, ListItemText, Collapse, ListItemButton, TableContainer, Paper, Table, TableRow, TableCell, TableBody, Divider } from "@mui/material";
import { useState } from "react";
import { Transaction } from "../../../TypeDeclaration";
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

export const TransactionListItem = ({ trDetail }: { trDetail: Transaction }) => {
    const [isExpand, setIsExpand] = useState<boolean>(false);

    return (
        <>
            <ListItemButton
                sx={{ mt: 1, backgroundColor: 'background.paper' }}
                key={trDetail.id}
                onClick={() => setIsExpand(!isExpand)}
            >
                <ListItemText
                    primary={
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-around'
                            }}
                        >
                            <Typography display="inline" width="30%" noWrap={true}>{trDetail.customer_name}</Typography>
                            <Typography display="inline" noWrap={true}>Rp. {trDetail.cash - trDetail.change}</Typography>
                            <Typography display="inline" color="text.secondary">{trDetail.date.split('T')[1].split('.')[0]}</Typography>
                        </Box>
                    }
                />
                {isExpand ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Divider />
            <Collapse sx={{ width: '100%' }} in={isExpand} timeout="auto" unmountOnExit>
                <TableContainer component={Paper}>
                    <Table size="small">
                        <TableBody>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }}>Product Name</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }} align="right">Amount</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }} align="right">Price</TableCell>
                            </TableRow>
                            {trDetail.products?.map((p) => (
                                <TableRow key={p.name}>
                                    <TableCell width="50%">{p.name}</TableCell>
                                    <TableCell align="right">{p.amount}</TableCell>
                                    <TableCell align="right">{p.price * p.amount}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableBody>
                            <TableRow>
                                <TableCell colSpan={2} sx={{ fontWeight: 'bold', textAlign: 'right' }}>Total : </TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                                    Rp. {trDetail.products?.map(p => p.amount * p.price).reduce((prev, curr) => prev + curr, 0)}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={2} sx={{ fontWeight: 'bold', textAlign: 'right' }}>Cash : </TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Rp. {trDetail.cash}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={2} sx={{ fontWeight: 'bold', textAlign: 'right' }}>Change : </TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Rp. {trDetail.change}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Collapse>
        </>
    )
}