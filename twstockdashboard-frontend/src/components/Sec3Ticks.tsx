import React, { useState, useEffect } from 'react'
import {
    Typography, TableContainer, Paper, Table, Grid, TableHead,
    TableBody, TableRow, TableCell, makeStyles,
    Card, AppBar, Tab, Toolbar
} from '@material-ui/core'

interface Data { [key: string]: number }

const Sec3Ticks: React.FC = () => {

    const [TicksLastCount, setTicksLastCount] = useState<Data>({})
    useEffect(() => {
        const fetchedData = async () => {
            const response = await fetch('http://localhost:9033/api/apiTicks/逐筆明細');
            const fetchedData: Data = await response.json();

            // const fetchedData = require('./../MockData/C_.json');
            setTicksLastCount(fetchedData);
        }
        fetchedData()
    });

    return (
        <>
            <Typography variant="subtitle2" align='center' color='primary' noWrap >逐筆明細</Typography>
            {/* <TableContainer component={Paper} style={{ width: '185px', height: '465px' }}> */}
            <TableContainer component={Paper} style={{ height: '355px' }}>
                <Table size="small" >
                    {Object.entries(TicksLastCount).map(([key, value]) => (
                        <TableRow  >
                            <TableCell >{key}</TableCell>
                            <TableCell >{value}</TableCell>
                        </TableRow>
                    ))}
                </Table>
            </TableContainer>
        </>
    )
}
export default Sec3Ticks
