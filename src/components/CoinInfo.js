import React, { useState } from 'react'
import { useEffect } from 'react';
import { HistoricalChart } from '../config/api';
import { CryptoState } from '../CryptoContext';
import { Alert, CircularProgress } from '@mui/material';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import { chartDays } from '../config/data';
import SelectButton from './SelectButton';
const CoinInfo = ({ coin }) => {
    const [historicData, setHistoricData] = useState(null);
    const [error, setError] = useState('');
    const [days, setDays] = useState(1);
    const { currency } = CryptoState();
    const fetchHistoricData = async () => {
        setHistoricData(null);
        setError('');
        try {
            const response = await fetch(HistoricalChart(coin.id, days, currency));
            if (!response.ok) throw new Error(`Chart request failed (${response.status}).`);
            const data = await response.json();
            if (!Array.isArray(data.prices)) throw new Error('Chart service returned invalid data.');
            setHistoricData(data.prices);
        } catch (requestError) {
            setError(requestError.message || 'Unable to load chart history.');
        }
    }
    useEffect(() => {
        fetchHistoricData();
    }, [coin.id, currency, days]);
    return (
        <div className="coin-chart-container">
            {
                error ? <Alert severity="error">{error}</Alert> : !historicData ? (
                    <CircularProgress
                        style={{ color: "gold" }}
                        size={250}
                        thickness={1}
                    />
                ) : (
                    <Line
                        data={{
                            labels: historicData.map(coin => {
                                let date = new Date(coin[0]);
                                let time =
                                    date.getHours() > 12 ? `${date.getHours() - 12}:${date.getMinutes()} PM` : `${date.getHours()}:${date.getMinutes()} AM`;
                                return days === 1 ? time : date.toLocaleDateString();
                            }),

                            datasets: [
                                {
                                    data: historicData.map(coin => coin[1]),
                                    label: `Price (Past ${days} Days) in ${currency}`,
                                    borderColor: "gold",
                                }
                            ]
                        }}
                        options={{
                            elements: {
                                point: { radius: 1 }
                            }
                        }}
                    />)
            }
            <div
                style={{
                    display: "flex",
                    marginTop: 20,
                    justifyContent: "space-around",
                    width: "100%"
                }}
            >{chartDays.map(day => (
                <SelectButton
                    key={day.value}
                    onClick={() => setDays(day.value)}
                    selected={day.value === days}
                >{day.label}</SelectButton>
            ))}</div>
        </div >
    )
}

export default CoinInfo
