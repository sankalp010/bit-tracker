import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Alert, Button, LinearProgress, Typography } from '@mui/material';
import { doc, setDoc } from 'firebase/firestore';
import parse from 'html-react-parser';
import { CryptoState } from '../CryptoContext';
import { SingleCoin } from '../config/api';
import CoinInfo from '../components/CoinInfo';
import { numberWithCommas } from '../components/Caraousel';
import { db } from '../firebase';

const CoinPage = () => {
    const { id } = useParams();
    const [coin, setCoin] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { currency, symbol, watchlist, setAlert, user } = CryptoState();
    const inWatchlist = watchlist.includes(coin?.id);

    useEffect(() => {
        let active = true;
        const fetchCoin = async () => {
            setLoading(true);
            setError('');
            setCoin(null);
            try {
                const response = await fetch(SingleCoin(id));
                if (!response.ok) throw new Error(`Coin request failed (${response.status}).`);
                const data = await response.json();
                if (!data?.id || !data?.market_data) throw new Error('Coin service returned incomplete data.');
                if (active) setCoin(data);
            } catch (requestError) {
                if (active) setError(requestError.message || 'Unable to load this coin.');
            } finally {
                if (active) setLoading(false);
            }
        };
        fetchCoin();
        return () => { active = false; };
    }, [id]);

    const updateWatchlist = async (shouldAdd) => {
        if (!user || !coin) return;
        const coinRef = doc(db, 'watchlist', user.uid);
        const nextWatchlist = shouldAdd
            ? [...new Set([...watchlist, coin.id])]
            : watchlist.filter((watch) => watch !== coin.id);
        try {
            await setDoc(coinRef, { coins: nextWatchlist }, { merge: true });
            setAlert({
                open: true,
                message: `${coin.name} ${shouldAdd ? 'added to' : 'removed from'} your watchlist.`,
                type: 'success'
            });
        } catch (writeError) {
            setAlert({ open: true, message: writeError.message || 'Unable to update your watchlist.', type: 'error' });
        }
    };

    if (loading) return <LinearProgress sx={{ backgroundColor: 'gold' }} />;
    if (error) return <Alert severity="error" sx={{ m: 3 }}>{error}</Alert>;
    if (!coin) return <Alert severity="info" sx={{ m: 3 }}>Coin details are unavailable.</Alert>;

    const description = coin.description?.en?.split('. ')[0] || 'No description is available.';
    const marketData = coin.market_data || {};
    const currentPrice = marketData.current_price?.[currency.toLowerCase()];
    const marketCap = marketData.market_cap?.[currency.toLowerCase()];

    return (
        <div className="coin-page-layout">
            <section className="coin-sidebar">
                <img src={coin.image?.large} height="200" style={{ marginBottom: 20 }} alt={coin.name} />
                <Typography variant="h3" className="coin-heading">{coin.name}</Typography>
                <Typography variant="subtitle1" className="coin-description">{parse(description)}</Typography>
                <div className="coin-market-data">
                    <div className="coin-market-row"><Typography variant="h5" className="coin-heading">Rank:</Typography><Typography variant="h5">{coin.market_cap_rank ?? '—'}</Typography></div>
                    <div className="coin-market-row"><Typography variant="h5" className="coin-heading">Current Price:</Typography><Typography variant="h5">{symbol} {numberWithCommas(currentPrice)}</Typography></div>
                    <div className="coin-market-row"><Typography variant="h5" className="coin-heading">Market Cap:</Typography><Typography variant="h5">{symbol} {marketCap == null ? '—' : numberWithCommas(marketCap / 1_000_000)}M</Typography></div>
                    {user && (
                        <Button
                            variant="outlined"
                            sx={{ width: '100%', height: 40, backgroundColor: inWatchlist ? '#ff0000' : '#EEBC1D', color: inWatchlist ? 'white' : 'black' }}
                            onClick={() => updateWatchlist(!inWatchlist)}
                        >
                            {inWatchlist ? 'Remove from Watchlist' : 'Add To Watchlist'}
                        </Button>
                    )}
                </div>
            </section>
            <CoinInfo coin={coin} />
        </div>
    );
};

export default CoinPage;
