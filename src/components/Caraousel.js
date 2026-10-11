import React, { useEffect, useState } from 'react'
import AliceCarousel from 'react-alice-carousel'
import { Link } from 'react-router-dom'
import { TrendingCoins } from '../config/api'
import { CryptoState } from '../CryptoContext'
export const numberWithCommas = (x) => {
    if (x === null || x === undefined || !Number.isFinite(Number(x))) return '—';
    return Number(x).toLocaleString('en-US');
}
const Caraousel = () => {
    const { currency, symbol, setAlert } = CryptoState();
    const [trending, setTrending] = useState([])
    const fetchTrendingCoins = async () => {
        try {
            const response = await fetch(TrendingCoins(currency));
            if (!response.ok) throw new Error(`Coin data request failed (${response.status}).`);
            const data = await response.json();
            if (!Array.isArray(data)) throw new Error('Coin service returned invalid data.');
            setTrending(data);
        } catch (error) {
            setTrending([]);
            setAlert({ open: true, message: error.message || 'Unable to load trending coins.', type: 'error' });
        }
    }
    useEffect(() => {
        fetchTrendingCoins();
    }, [currency]);

    const items = trending.map(coin => {
        let profit = coin?.price_change_percentage_24h >= 0;
        return <Link
            to={`/coins/${coin.id}`}
            className="carousel-item"
            key={coin.id}
        >
            <img
                src={coin?.image}
                alt={coin.name}
                height="80"
                style={{ marginBottom: 10 }}
            />
            <span>
                {coin?.symbol}
                &nbsp;
                <span style={{
                    color: profit ? '#00ff00' : 'red',
                    fontWeight: '500',
                }}>{profit && '+'}{Number.isFinite(coin?.price_change_percentage_24h) ? coin.price_change_percentage_24h.toFixed(2) : '—'}</span>
            </span>
            <span style={{ fontSize: 22, fontWeight: 500 }}>
                {symbol}{numberWithCommas(coin?.current_price)}
            </span>
        </Link>
    })
    const responsive = {
        0: { items: 2 },
        512: { items: 4 },
    };
    return (
        <div className="trending-carousel">
            <AliceCarousel
                mouseTracking
                infinite
                autoPlayInterval={1000}
                animationDuration={1500}
                disableDotsControls
                disableButtonsControls
                responsive={responsive}
                autoPlay
                items={items}
            />
        </div>
    )
}

export default Caraousel
