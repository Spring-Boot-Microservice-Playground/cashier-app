import './App.css';
import { Grid, Box, Card, CardContent, Autocomplete, TextField, Button, Typography, List, ListItem, ListItemText } from "@mui/material";
import { useState } from 'react';
import IconButton from '@mui/material/IconButton';

const options = ["dono", "casino", "indro"];
const transactions = ['budi', 'badu', 'bidu', 'bidi'];

function App() {
  const [value, setValue] = useState<string | null>()
  const [inputValue, setInputValue] = useState<string | undefined>('')

  return (
    <Box padding={8}>
      <Grid 
        container spacing={5} 
        alignItems="center"
        justifyItems="center">

          <Grid item xs={4} height='90vh'>
            <Card sx={{p: 2, height: '100%', backgroundColor: "#f5f5f5"}}>
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={7}>
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
                    renderInput={(params) => <TextField {...params} label="Customer" />}
                  />
                </Grid>
                <Grid item>
                  <Button variant="contained" size="small">Add New Customer</Button>
                </Grid>
              </Grid>
            </Card>
          </Grid>

          <Grid item xs={4} height='90vh'>
            <Card sx={{p: 2, height: '100%', backgroundColor: "#f5f5f5"}}>
              <Grid 
                container 
                spacing={5}
                alignItems="center">
                <Grid item xs={9}>
                  <Autocomplete
                    size='small'
                    freeSolo
                    options={options.map((option) => option)}
                    renderInput={(params) => <TextField {...params} label="Cari Produk" />}
                  />
                </Grid>
                <Grid item>
                  <Typography>Jumlah : 66</Typography>
                </Grid>
              </Grid>
            </Card>
          </Grid>

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
      </Grid>
    </Box>
  );
}

export default App;