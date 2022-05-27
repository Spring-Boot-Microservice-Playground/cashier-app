import { Grid, Card, Typography, List, ListItem, ListItemText } from "@mui/material";
import IconButton from '@mui/material/IconButton';

const transactions = ['budi', 'badu', 'bidu', 'bidi'];

export const TransactionHistory = (): JSX.Element => {
    return (
        <Grid item xs={4} height='90vh'>
            <Card sx={{p: 2, height: '100%', backgroundColor: "#f5f5f5"}}>
                <Typography variant='h5' textAlign={'center'}>
                    Transaction History
                </Typography>
                <br/>
                <List sx={{width: '100%'}}>
                    {
                    transactions.map(value => (
                        <ListItem
                        sx={{mt: 2, backgroundColor: 'background.paper'}}
                        key={value}
                        secondaryAction={
                            <IconButton aria-label="comment">
                            </IconButton>
                        }
                        >
                        <ListItemText primary={`${value} membeli sabun`}/>
                        </ListItem>
                    ))
                    }
                </List>
            </Card>
        </Grid>
    )
}