import React, { useState, useEffect } from 'react'
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { Typography, TableContainer, Paper } from '@material-ui/core'

interface Data { [key: string]: number[]; }

const Sec2ApexCharts: React.FC = () => {

    const [TXFR1Charts, setTXFR1Charts] = useState<Data>({})
    useEffect(() => {
        const fetchedData = async () => {
            const response = await fetch('http://localhost:9033/api/apiApexCharts');
            const fetchedData: Data = await response.json();

            // const fetchedData: Data = require('./../MockData/B_.json');
            setTXFR1Charts(fetchedData);
        }
        fetchedData()
    });

    const series = [{ data: Object.entries(TXFR1Charts).map(([key, value]) => ({ x: key, y: value })) }];
    const options: ApexOptions = {
        chart: { type: 'candlestick' },
        xaxis: { type: 'datetime' },
        plotOptions: { candlestick: { colors: { upward: 'red', downward: 'green' } } }
    };
    return (
        <div>
            <Typography variant="subtitle2" align='center' color='primary' noWrap >台指期全日盤1分K</Typography>
            <TableContainer component={Paper} style={{ height: '355px' }}>
                <Chart options={options} series={series} type="candlestick" />
            </TableContainer>
            {/* <TableContainer component={Paper} style={{ width: '550px', height: '465px' }}>
                <Chart options={options} series={series} type="candlestick" height={440} width={550} />
            </TableContainer> */}
        </div>
    );
};
export default Sec2ApexCharts;