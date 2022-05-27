import { Grid, Card, Autocomplete, TextField, Typography } from "@mui/material";

export const ProductSection = ({options}: {options: string[]}): JSX.Element => {
    return (
        <Grid item xs={4} height='90vh'>
            <Card sx={{p: 2, height: '100%', backgroundColor: "#f5f5f5"}}>
                <Grid 
                    container 
                    spacing={3}
                    alignItems="center">
                    <Grid item xs={7}>
                        <Autocomplete
                            size='small'
                            freeSolo
                            options={options.map((option) => option)}
                            renderInput={(params) => <TextField {...params} label="Add Product" />}
                        />
                    </Grid>
                    <Grid item>
                        <Typography fontSize={18}>Total Price : 123,000,000</Typography>
                    </Grid>
                </Grid>
            </Card>
        </Grid>
    )
}