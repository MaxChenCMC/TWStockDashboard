import React, { useState, useEffect } from 'react'
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { Typography, TableContainer } from '@material-ui/core'

interface Data { [key: string]: number[] }

const options: ApexOptions = {
  chart: { type: 'candlestick' }, xaxis: { type: 'category' },
  plotOptions: { candlestick: { colors: { upward: 'red', downward: 'green' } } }
};
// ========================================================================================
export const Sec7ApexChartsOHLC_TENN = () => {
  const [AmountRank, setAmountRank] = useState<Data>({})

  useEffect(() => {
    const fetchedData = async () => {
      const response = await fetch('http://localhost:9033/api/apiApexChartsOHLC_TENN');
      const fetchedData: Data = await response.json();

      // const fetchedData: Data = require('./../MockData/D_.json');
      setAmountRank(fetchedData);
    }
    fetchedData()
  });

  const series = [{
    data: Object.entries(AmountRank)
      .sort((a, b) => b[1][4] - a[1][4]) //正序就 a[1][4] - b[1][4]
      .map(([key, value]) => ({ x: key, y: value }))
  }];

  return (
    <div>
      <Typography variant="subtitle2" align='center' color='primary' >電子權值股</Typography>
      {/* <Chart options={options} series={series} type="candlestick" height={140} /> */}
      <Chart options={options} series={series} type="candlestick" height={220} />
    </div>
  );
};


export const Sec7ApexChartsOHLC_TFNN = () => {
  const [AmountRank, setAmountRank] = useState<Data>({})
  useEffect(() => {
    const fetchedData = async () => {
      const response = await fetch('http://localhost:9033/api/apiApexChartsOHLC_TFNN');
      const fetchedData: Data = await response.json();

      // const fetchedData: Data = require('./../MockData/E_.json');
      setAmountRank(fetchedData);
    }
    fetchedData()
  });

  const series = [{
    data: Object.entries(AmountRank)
      .sort((a, b) => b[1][4] - a[1][4]) //正序就 a[1][4] - b[1][4]
      .map(([key, value]) => ({ x: key, y: value }))
  }];
  return (
    <div>
      <Typography variant="subtitle2" align='center' color='primary' >金融權值股</Typography>
      <Chart options={options} series={series} type="candlestick" height={220} />
    </div>
  );
};


export const Sec7ApexChartsOHLC_XINN = () => {
  const [AmountRank, setAmountRank] = useState<Data>({})
  useEffect(() => {
    const fetchedData = async () => {
      const response = await fetch('http://localhost:9033/api/apiApexChartsOHLC_XINN');
      const fetchedData: Data = await response.json();

      // const fetchedData: Data = require('./../MockData/F_.json');
      setAmountRank(fetchedData);
    }
    fetchedData()
  });

  const series = [{
    data: Object.entries(AmountRank)
      .sort((a, b) => b[1][4] - a[1][4]) //正序就 a[1][4] - b[1][4]
      .map(([key, value]) => ({ x: key, y: value }))
  }];
  return (
    <div>
      <Typography variant="subtitle2" align='center' color='primary' noWrap >非金電權值股</Typography>
      <Chart options={options} series={series} type="candlestick" height={220} />
    </div>
  );
};


export const Sec7ApexChartsOHLC_PctChg = () => {
  const [AmountRank, setAmountRank] = useState<Data>({})
  useEffect(() => {
    const fetchedData = async () => {
      const response = await fetch('http://localhost:9033/api/apiApexChartsOHLC_PctChg');
      const fetchedData: Data = await response.json();

      // const fetchedData: Data = require('./../MockData/G_.json');
      setAmountRank(fetchedData);
    }
    fetchedData()
  });

  var AmountSum = Object.values(AmountRank).reduce((accumulator, currentValue) => accumulator + currentValue[currentValue.length - 1], 0);
  const series = [{
    data: Object.entries(AmountRank)
      .sort((a, b) => b[1][4] - a[1][4]) //正序就 a[1][4] - b[1][4]
      .map(([key, value]) => ({ x: key, y: value }))
  }];
  return (
    <div>
      <Typography variant="subtitle2" align='center' color='primary' noWrap >漲幅排行且量大個股總計成交值 {AmountSum / 10} Billion</Typography>
      {/* <Chart options={options} series={series} type="candlestick" height={260} /> */}
      <Chart options={options} series={series} type="candlestick" />
    </div>
  );
};