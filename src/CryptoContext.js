import { onAuthStateChanged } from "firebase/auth";
import React, { createContext, useContext, useState, useEffect } from "react";
import { CoinList } from "./config/api";
import { auth, db } from "./firebase";
import { doc, onSnapshot } from 'firebase/firestore';

const Crypto = createContext();
const CryptoContextProvider = ({ children }) => {
    const [currency, setCurrency] = useState("INR");
    const [symbol, setSymbol] = useState("₹");
    const [coins, setCoins] = useState([]);
    const [watchlist, setWatchlist] = useState([])
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [user, setUser] = useState(null);
    const [alert, setAlert] = useState({
        open: false,
        message: "",
        type: "success"
    })
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            setUser(user || null);
            if (!user) setWatchlist([]);
        });
        return unsubscribe;
    }, [])
    useEffect(() => {
        if (!user) return undefined;
        const watchlistRef = doc(db, 'watchlist', user.uid);
        return onSnapshot(watchlistRef, snapshot => {
            const coinIds = snapshot.exists() ? snapshot.data().coins : [];
            setWatchlist(Array.isArray(coinIds) ? coinIds : []);
        }, requestError => {
            setWatchlist([]);
            setAlert({ open: true, message: requestError.message || 'Unable to load your watchlist.', type: 'error' });
        });
    }, [user]);
    const fetchCoins = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await fetch(CoinList(currency));
            if (!response.ok) throw new Error(`CoinGecko request failed (${response.status}).`);
            const data = await response.json();
            if (!Array.isArray(data)) throw new Error('CoinGecko returned invalid coin data.');
            setCoins(data);
        } catch (requestError) {
            setCoins([]);
            setError(requestError.message || 'Unable to load cryptocurrency prices.');
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (currency === "INR") setSymbol("₹");
        else setSymbol("$");
    }, [currency])
    return <Crypto.Provider value={{ currency, symbol, setCurrency, coins, loading, error, fetchCoins, alert, setAlert, user, watchlist, setWatchlist }}>
        {children}
    </Crypto.Provider>
}
export default CryptoContextProvider;
export const CryptoState = () => {
    return useContext(Crypto)
};
