import React, { useEffect, useState } from 'react'
import { CoinList } from '../config/api'
import { CryptoState } from '../CryptoContext';
import {
    Container,
    TableCell,
    LinearProgress,
    Typography,
    TextField,
    TableBody,
    TableRow,
    TableHead,
    TableContainer,
    Table,
    Alert,
} from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { numberWithCommas } from './Caraousel';
import { Pagination } from '@mui/material';

const CoinsTable = () => {
    const [page, setPage] = useState(1)
    const [search, setsearch] = useState('')
    const { currency, symbol, coins, loading, fetchCoins, error } = CryptoState();
    const navigate = useNavigate();
    useEffect(() => {
        fetchCoins();
    }, [currency]);
    const handleSearch = () => {
        return coins.filter(
            (coin) =>
                coin.name.toLowerCase().includes(search.trim().toLowerCase()) ||
                coin.symbol.toLowerCase().includes(search.trim().toLowerCase())
        )
    }
    return (
        <Container style={{ textAlign: "center" }}>
            <Typography variant="h4" style={{ margin: 18, fontFamily: 'Montserrat' }}>
                Crypto Prices by Market Cap
            </Typography>
            <TextField label="Search for a crypto Currency" variant='outlined'
                style={{ marginBottom: 20, width: "100%" }}
                value={search}
                onChange={(e) => { setsearch(e.target.value); setPage(1); }}
            ></TextField>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {!loading && !error && coins.length === 0 && <Alert severity="info">No coin data is available right now.</Alert>}
            <TableContainer>
                {
                    loading ? (
                        <LinearProgress style={{ backgroundColor: "gold" }} />
                    ) : (
                        <Table aria-label="simple table">
                            <TableHead style={{ backgroundColor: "#EEBC1D" }}>
                                <TableRow>
                                    {["Coin", "Price", "24h Change", "Market Cap"].map((head) => (
                                        <TableCell
                                            style={{
                                                color: "black",
                                                fontWeight: "700",
                                                fontFamily: "Montserrat",
                                            }}
                                            key={head}
                                            align={head === "Coin" ? "left" : "right"}
                                        >
                                            {head}
                                        </TableCell>))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {handleSearch().slice((page - 1) * 10, (page - 1) * 10 + 10).map(row => {
                                    const profit = Number(row.price_change_percentage_24h) > 0;
                                    return (
                                        <TableRow key={row.id}
                                            onClick={() => navigate(`/coins/${row.id}`)}
                                            className="coin-table-row"
                                        >
                                            <TableCell component='th' scope='row'
                                                sx={{
                                                    display: "flex",
                                                    gap: 15
                                                }}
                                            >
                                                <img src={row.image} alt={row.name} height="50"
                                                    style={{ marginBottom: 10 }}
                                                />
                                                <div style={{
                                                    display: "flex",
                                                    flexDirection: "column"
                                                }}>
                                                    <span style={{
                                                        textTransform: "uppercase",
                                                        fontSize: 22,
                                                    }}>{row.symbol}</span>
                                                    <span style={{
                                                        color: 'darkgray'
                                                    }}>
                                                        {row.name}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell align='right'>
                                                {symbol}{" "}
                                                {numberWithCommas(row.current_price)}
                                            </TableCell>
                                            <TableCell align='right'
                                                style={{
                                                    color: profit ? "rgb(14,203,129)" : "red",
                                                    fontWeight: "500"

                                                }}>
                                                {Number.isFinite(row.price_change_percentage_24h) ? `${profit ? "+" : ""}${row.price_change_percentage_24h.toFixed(2)}%` : '—'}
                                            </TableCell>
                                            <TableCell align='right'>
                                                {symbol}{" "}{
                                                    numberWithCommas(row.market_cap)
                                                }
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    )
                }
            </TableContainer>
            <Pagination
                count={Math.ceil(handleSearch().length / 10)}
                style={{
                    padding: 20,
                    width: "100%",
                    display: "flex",
                    justifyContent: "center"
                }}
                sx={{ '& .MuiPaginationItem-root': { color: 'gold' } }}
                onChange={(_, value) => {
                    setPage(value);
                    window.scroll(0, 450);
                }}
            >
            </Pagination>
        </Container >
    )
}

export default CoinsTable;
