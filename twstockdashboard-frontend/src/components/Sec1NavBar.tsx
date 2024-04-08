import React, { useState, useEffect } from 'react'
import { AppBar, Toolbar, Grid, Paper, Typography, makeStyles, TableContainer } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
    paper: {
        padding: theme.spacing(0.5),
        textAlign: 'left',
        color: theme.palette.text.secondary,
        width: 115, height: 60, margin: 3
    },
}));

interface Data {
    TAIFEX: number[];
    TSE: number[];
    OTC: number[];
    Margin: number[];
    Acct: string[];
}

const TwTime = new Date().toLocaleString("Taiwan",
    {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
    }
);


const Sec1NavBar: React.FC = () => {

    const [TbarTseTxfOtc, setTbarTseTxfOtc] = useState<Data>({ TAIFEX: [], TSE: [], OTC: [], Margin: [], Acct: [] });
    useEffect(() => {
        const fetchedData = async () => {
            const response = await fetch('http://localhost:9033/api/apiNavBar');
            const fetchedData: Data = await response.json();

            // const fetchedData: Data = require('./../MockData/A_.json');
            setTbarTseTxfOtc(fetchedData);
        }
        fetchedData()
    });

    const classes = useStyles();
    return (
        <AppBar position='static' style={{ height: 80 }} >
            <Toolbar >
                <Paper className={classes.paper}>
                    指期：{TbarTseTxfOtc.TAIFEX[0]}<br />漲跌：{TbarTseTxfOtc.TAIFEX[1]}<br />漲幅：{TbarTseTxfOtc.TAIFEX[2]}%
                </Paper>
                <Paper className={classes.paper}>
                    加權：{TbarTseTxfOtc.TSE[0]}<br />漲跌：{TbarTseTxfOtc.TSE[1]}<br />漲幅：{TbarTseTxfOtc.TSE[2]}%
                </Paper>
                <Paper className={classes.paper}>
                    櫃買：{TbarTseTxfOtc.OTC[0]}<br />漲跌：{TbarTseTxfOtc.OTC[1]}<br />漲幅：{TbarTseTxfOtc.OTC[2]}%
                </Paper>
                <Grid item xs={7}>
                    <Typography variant="h3" align='center' noWrap> TW Stock Dashboard </Typography>
                    <Typography variant="subtitle2" align='center' noWrap>
                        證：****{TbarTseTxfOtc.Acct[0]}　期：****{TbarTseTxfOtc.Acct[1]}　{TwTime}
                    </Typography>
                </Grid>
                <Paper className={classes.paper}>
                    權益數：{TbarTseTxfOtc.Margin[0]}<br />可出金：{TbarTseTxfOtc.Margin[1]}
                </Paper>
            </Toolbar>
        </AppBar >
    )
}
export default Sec1NavBar