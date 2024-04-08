import * as React from 'react';

import { Paper, Grid } from '@mui/material';
import Sec1NavBar from './Sec1NavBar';
import Sec2ApexCharts from './Sec2ApexCharts';
import Sec3Ticks from './Sec3Ticks';
import Sec4Options from './Sec4Options';
import { Sec6StocksTableTW30, Sec6StocksTablePctChg } from './Sec6StocksTable';
import { Sec7ApexChartsOHLC_TENN, Sec7ApexChartsOHLC_TFNN, Sec7ApexChartsOHLC_XINN, Sec7ApexChartsOHLC_PctChg } from './Sec7ApexChartsOHLC';

const Layout = () => {
    return (
        <>
            <Sec1NavBar />
            <Grid container component={Paper} style={{ width: '1260px', height: '850px' }}>
                <Grid container direction="row" xs={8.5}>
                    <Grid item xs={9.5}>
                        <Sec2ApexCharts />
                    </Grid>
                    <Grid item xs={2.5}>
                        <Sec3Ticks />
                    </Grid>
                    <Grid item xs={6.5}>
                        <Sec4Options />
                    </Grid>
                </Grid>
                <Grid container direction="row" xs={3.5}>
                    <Grid item>
                        <Sec6StocksTableTW30 />
                        <Sec6StocksTablePctChg />
                    </Grid>
                </Grid>
                <Grid container direction="row" xs={12}>
                    <Sec7ApexChartsOHLC_TENN />
                    <Sec7ApexChartsOHLC_TFNN />
                    <Sec7ApexChartsOHLC_XINN />
                    <Grid item xs={3.3}>
                        <Sec7ApexChartsOHLC_PctChg />
                    </Grid>
                </Grid>
            </Grid>
        </>
    )
}
export default Layout