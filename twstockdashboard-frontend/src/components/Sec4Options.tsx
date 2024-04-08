import React, { useState, useEffect } from 'react'
import { Typography, TableBody, TableRow, TableCell, Table, TableHead, TableContainer, Paper, Grid } from '@material-ui/core'
import { Height } from '@material-ui/icons';

interface SCSPBP {
    [key: string]: {
        buy_price: number;
        sell_price: number;
    };
}

const Sec4Options: React.FC = () => {

    const OP: SCSPBP = require('./../MockData/Options.json');
    const strike = Object.keys(OP);


    // const [OP, setOP] = useState<SCSPBP>({})
    // useEffect(() => {
    //     const fetchedData = async () => {
    //         const response = await fetch('http://localhost:9033/api/apiOptions');
    //         const fetchedData: SCSPBP = await response.json();

    //         // const fetchedData: SCSPBP = require('./../MockData/Options.json');
    //         setOP(fetchedData);
    //     }
    //     fetchedData()
    // });
    // const strike = Object.keys(OP);



    const filteredData = Object.entries(OP).map(([_, value]) => value);

    const BP = filteredData[0]?.sell_price;
    const SP = filteredData[4]?.buy_price;
    const SC = filteredData[7]?.buy_price;

    const _BP = filteredData[2]?.sell_price;
    const _SP = filteredData[4]?.buy_price;
    const _SC = filteredData[7]?.buy_price;
    const _BC = filteredData[9]?.sell_price;

    const __BC = filteredData[3]?.sell_price;
    const __SC = filteredData[5]?.buy_price;
    const __SP = filteredData[6]?.buy_price;
    const __BP = filteredData[8]?.sell_price;

    return (
        <>
            <Grid container direction="row" >
                <Grid item>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ backgroundColor: 'lightgrey' }}></TableCell>
                                <TableCell colSpan={2} align='center' style={{ backgroundColor: 'lightgrey' }}>SCSP+BP<br />{SC + SP - BP}</TableCell>
                            </TableRow>
                            <TableRow>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow >
                                <TableCell style={{ backgroundColor: 'lightgrey' }}>{strike[0].slice(0, -1)}</TableCell>
                                <TableCell>-</TableCell>
                                <TableCell>{BP}</TableCell>
                            </TableRow>
                            <TableRow >
                                <TableCell style={{ backgroundColor: 'lightgrey' }}>{strike[1].slice(0, -1)}</TableCell>
                                <TableCell>-</TableCell>
                                <TableCell>-</TableCell>
                            </TableRow>
                            <TableRow >
                                <TableCell style={{ backgroundColor: 'lightgrey' }}>{strike[3].slice(0, -1)}</TableCell>
                                <TableCell>-</TableCell>
                                <TableCell>{SP}</TableCell>
                            </TableRow>
                            <TableRow >
                                <TableCell style={{ backgroundColor: 'lightgrey' }}>{strike[5].slice(0, -1)}</TableCell>
                                <TableCell>-</TableCell>
                                <TableCell>-</TableCell>
                            </TableRow>
                            <TableRow >
                                <TableCell style={{ backgroundColor: 'lightgrey' }}>{strike[7].slice(0, -1)}</TableCell>
                                <TableCell>{SC}</TableCell>
                                <TableCell>-</TableCell>
                            </TableRow>
                            <TableRow >
                                <TableCell style={{ backgroundColor: 'lightgrey' }}>{strike[9].slice(0, -1)}</TableCell>
                                <TableCell>-</TableCell>
                                <TableCell>-</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </Grid>
                <Grid item>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell colSpan={2} align='center' style={{ backgroundColor: 'lightgrey' }}>SCBC&SPBP<br />{_SC - _BC}　　{_SP - _BP}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow >
                                <TableCell>-</TableCell>
                                <TableCell>-</TableCell>
                            </TableRow>
                            <TableRow >
                                <TableCell>-</TableCell>
                                <TableCell>{_BP}</TableCell>
                            </TableRow>
                            <TableRow >
                                <TableCell>-</TableCell>
                                <TableCell>{_SP}</TableCell>
                            </TableRow>
                            <TableRow >
                                <TableCell>-</TableCell>
                                <TableCell>-</TableCell>
                            </TableRow>
                            <TableRow >
                                <TableCell>{_SC}</TableCell>
                                <TableCell>-</TableCell>
                            </TableRow>
                            <TableRow >
                                <TableCell>{_BC}</TableCell>
                                <TableCell>-</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </Grid>
                <Grid item>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell colSpan={2} align='center' style={{ backgroundColor: 'lightgrey' }}>BCSC&BPSP<br />{__BC - __SC}　　{__BP - __SP}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow >
                                <TableCell>-</TableCell>
                                <TableCell>-</TableCell>
                            </TableRow>
                            <TableRow >
                                <TableCell>-</TableCell>
                                <TableCell>-</TableCell>
                            </TableRow>
                            <TableRow >
                                <TableCell>{__BC}</TableCell>
                                <TableCell>-</TableCell>
                            </TableRow>
                            <TableRow >
                                <TableCell>{__SC}</TableCell>
                                <TableCell>{__SP}</TableCell>
                            </TableRow>
                            <TableRow >
                                <TableCell>-</TableCell>
                                <TableCell>{__BP}</TableCell>
                            </TableRow>
                            <TableRow >
                                <TableCell>-</TableCell>
                                <TableCell>-</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </Grid>
            </Grid >

        </>

    );
};
export default Sec4Options