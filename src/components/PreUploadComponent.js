import React, {useState} from 'react';
import {
    Box, Button,
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import { LoadingButton } from '@mui/lab';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: {xs: '90vw', sm: '80vw', md: '50vw'},
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export function PreUploadComponent(props) {
    const [loading, setLoading] = useState(false);

    return (
        <>
            <Box sx={style}>
                {}
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <TableContainer component={Paper}>
                            <Table aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="left"><Typography variant='h6' sx={{fontWeight: 'bold'}}>Dunkin
                                            Branch</Typography></TableCell>
                                        <TableCell align="right"><Typography variant='h6' sx={{fontWeight: 'bold'}}>Payment
                                            Totals</Typography></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {props?.paymentsToBeMade?.map((payment) => (
                                        <TableRow key={payment.dunkinBranchId}>
                                            <TableCell align="left">{payment.dunkinBranchId}</TableCell>
                                            <TableCell
                                                align="right">{(payment.paymentTotalsInCents / 100).toLocaleString("en-US", {
                                                style: "currency",
                                                currency: "USD"
                                            })}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container spacing={1} alignItems="center" justifyContent="center">
                            <Grid item xs={6} textAlign={'center'}>
                                <Button color={'error'} variant={'outlined'} fullWidth onClick={() => props.handleCancel()}>
                                    Cancel
                                </Button>
                            </Grid>
                            <Grid item xs={6} textAlign={'center'}>
                                <LoadingButton color={'success'} variant={'contained'} fullWidth loading={loading}
                                               onClick={() => {
                                                   setLoading(true);
                                                   props.uploadCsv(null, false, setLoading);
                                               }}>
                                    Upload
                                </LoadingButton>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} alignItems="center" justifyContent="center">
                        <Typography variant={'body1'}>Please keep page open. Once file is finished being processed fully a report will be generated. For large files with mostly new employees, this could take 30 minutes or longer</Typography>
                        <Typography fontSize={13}>
                            (I made it like this, because it would have taken a bit longer to implement a status system for reports myself)
                        </Typography>
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}