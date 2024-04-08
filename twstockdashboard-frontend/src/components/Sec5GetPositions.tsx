import React, { useState, useEffect } from 'react'
import { Typography, TableBody, TableRow, TableCell, Table, TableHead, TableContainer, Paper } from '@material-ui/core'
import { Height } from '@material-ui/icons';

interface Data { [key: string]: any[] }


export const GetPositions: React.FC = () => {

    const [GetPositions, setGetPositions] = useState<Data>({})
    useEffect(() => {
        const fetchedData = async () => {
            // const response = await fetch('http://localhost:9033/api/apiGetPositions');
            // const fetchedData: Data = await response.json();

            // const fetchedData = require('./../MockData/C_.json');
            // setGetPositions(fetchedData);
        }
        fetchedData()
    });

    return (
        <>
            <Typography variant="subtitle2" align='center' color='primary' noWrap >部位</Typography>
            <TableContainer component={Paper} >
                <Table size="small" >
                    {Object.entries(GetPositions).map(([key, value]) => (
                        <TableRow  >
                            {/* <TableCell >{key}</TableCell>
                            <TableCell >{value}</TableCell> */}
                        </TableRow>
                    ))}
                </Table>
            </TableContainer>
        </>
    );
}