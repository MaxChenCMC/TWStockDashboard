import React, { useState, useEffect } from 'react'
import { makeStyles, Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Typography } from '@material-ui/core'

const useStyles = makeStyles({ greenText: { color: "green" }, redText: { color: "red" } });

interface Data {
  code: string;
  close: number;
  price_range: number;
  tick_type: string;
  change_price: number;
  average_price: number;
  rank_value: number;
  buy_price: number;
  sell_price: number;
}



// const TW30AndAmountRankTable: React.FC = () => {
export const Sec6StocksTableTW30 = () => {
  const classes = useStyles();
  const [BlueChips, setBlueChips] = useState<{ [key: string]: Data }>({});
  useEffect(() => {
    const fetchedData = async () => {
      const response = await fetch('http://localhost:9033/api/apiStocksTable_TW30');
      const fetchedData = await response.json();

      // const fetchedData = require('./../MockData/H_.json');
      setBlueChips(fetchedData);
    }
    fetchedData()
  });

  return (
    <>
      {/* <TableContainer style={{ width: '445px', height: '250px' }}> */}
      <Typography variant="subtitle2" align='center' color='primary' noWrap >TW30榜</Typography>
      <TableContainer style={{ height: '355px' }}>
        <Table size="small" stickyHeader>
          <TableHead >
            <TableRow>
              <TableCell style={{ backgroundColor: 'lightgrey' }} >Name</TableCell>
              <TableCell style={{ backgroundColor: 'lightgrey' }} align="right">Code</TableCell>
              <TableCell style={{ backgroundColor: 'lightgrey' }} align="right">Close</TableCell>
              {/* <TableCell align="right">Price Range</TableCell> */}
              {/* <TableCell align="right">Tick Type</TableCell> */}
              {/* <TableCell align="right">Change Price</TableCell> */}
              {/* <TableCell align="right">Average Price</TableCell> */}
              <TableCell style={{ backgroundColor: 'lightgrey' }} align="right">Rank Value</TableCell>
              {/* <TableCell align="right">Buy Price</TableCell> */}
              {/* <TableCell align="right">Sell Price</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(BlueChips).map((company) => (
              <TableRow key={company}>
                <TableCell>{company}</TableCell>
                <TableCell align="right">{BlueChips[company].code}</TableCell>
                <TableCell align="right">{BlueChips[company].close}</TableCell>
                {/* <TableCell align="right">{BlueChips[company].price_range}</TableCell> */}
                {/* <TableCell align="right">{BlueChips[company].tick_type}</TableCell> */}
                {/* <TableCell align="right">{BlueChips[company].change_price}</TableCell> */}
                {/* <TableCell align="right">{BlueChips[company].average_price}</TableCell> */}
                <TableCell align="right">{BlueChips[company].rank_value}</TableCell>
                {/* <TableCell align="right">{Math.fround(BlueChips[company].rank_value / 100_000_000).toFixed(2)}</TableCell> */}
                {/* <TableCell align="right">{BlueChips[company].buy_price}</TableCell> */}
                {/* <TableCell align="right">{BlueChips[company].sell_price}</TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
};

// export default TW30AndAmountRankTable;

export const Sec6StocksTablePctChg = () => {
  const [BlueChips, setBlueChips] = useState<{ [key: string]: Data }>({});
  useEffect(() => {
    const fetchedData = async () => {
      const response = await fetch('http://localhost:9033/api/apiStocksTable_Watachlist');
      const fetchedData = await response.json();

      // const fetchedData = require('./../MockData/I_.json');
      setBlueChips(fetchedData);
    }
    fetchedData()
  });

  return (
    <>
      <Typography variant="subtitle2" align='center' color='primary' noWrap >PctAmt排行榜</Typography>
      <TableContainer style={{ height: '210px' }}>
        <Table size="small" stickyHeader>
          <TableHead >
            <TableRow>
              <TableCell style={{ backgroundColor: 'lightgrey' }} >Name</TableCell>
              <TableCell style={{ backgroundColor: 'lightgrey' }} align="right">Code</TableCell>
              <TableCell style={{ backgroundColor: 'lightgrey' }} align="right">Close</TableCell>
              <TableCell style={{ backgroundColor: 'lightgrey' }} align="right">Rank Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(BlueChips).map((company) => (
              <TableRow key={company}>
                <TableCell>{company}</TableCell>
                <TableCell align="right">{BlueChips[company].code}</TableCell>
                <TableCell align="right">{BlueChips[company].close}</TableCell>
                <TableCell align="right">{BlueChips[company].rank_value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
};