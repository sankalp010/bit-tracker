import React, { useState } from 'react';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import { CryptoState } from '../CryptoContext';
import { Avatar } from '@mui/material';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase';
import { numberWithCommas } from './Caraousel';
import { AiFillDelete } from 'react-icons/ai'
import { doc, setDoc } from 'firebase/firestore';


export default function UserSideBar() {
    const { user, setAlert, watchlist, coins, symbol } = CryptoState();
    const [state, setState] = useState({
        right: false,
    });
    const removeFromWatchList = async (coin) => {
        const coinRef = doc(db, "watchlist", user.uid);
        try {
            await setDoc(coinRef,
                {
                    coins: watchlist.filter((watch) => watch !== coin?.id),
                },
                { merge: true });
            setAlert({
                open: true,
                message: `${coin.name
                    } Removed from Watchlist!`,
                type: 'success'
            });
        } catch (error) {
            setAlert({
                open: true,
                message: error.message,
                type: 'error'
            });
        }
    }

    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setState({ ...state, [anchor]: open });
    };

    const logout = async () => {
        try {
            await signOut(auth);
            setAlert({ open: true, type: 'success', message: 'You have been signed out.' });
            setState({ right: false });
        } catch (error) {
            setAlert({ open: true, type: 'error', message: error.message || 'Unable to sign out.' });
        }
    };

    return (
        <div>
            {['right'].map((anchor) => (
                <React.Fragment key={anchor}>
                    <Avatar onClick={toggleDrawer(anchor, true)}
                        style={{
                            height: 38,
                            width: 38,
                            marginLeft: 15,
                            cursor: 'pointer',
                            backgroundColor: '#EEBC1D'
                        }}
                        src={user.photoURL}
                        alt={user.displayName || user.email}
                    />
                    <Drawer anchor={anchor} open={state[anchor]} onClose={toggleDrawer(anchor, false)}>
                        <div className="sidebar-container">
                            <div className="sidebar-profile">
                                <Avatar className="sidebar-picture" src={user.photoURL}
                                    alt={user.displayName || user.email}
                                />
                                <span
                                    style={{
                                        width: "100%",
                                        fontSize: 25,
                                        textAlign: "center",
                                        fontWeight: "bolder",
                                        wordWrap: "break-word"
                                    }}
                                >
                                    {user.displayName || user.email}
                                </span>
                                <div className="sidebar-watchlist">
                                    <span style={{
                                        fontSize: 15,
                                        textShadow: "0 0 5px black"
                                    }}>WatchList</span>
                                    {coins.map(coin => {
                                        if (watchlist.includes(coin.id))
                                            return (<div className="sidebar-coin" key={coin.id}>
                                                <span>{coin.name}</span>
                                                <span style={{ display: "flex", gap: 8 }}>
                                                    {symbol}
                                                    {numberWithCommas(coin.current_price)}
                                                    <AiFillDelete style={{ cursor: "pointer" }} onClick={() => removeFromWatchList(coin)} />
                                                </span>
                                            </div>);
                                    })}
                                </div>
                            </div>
                            <Button variant='contained' className="sidebar-logout" onClick={logout}>Log Out</Button>
                        </div>
                    </Drawer>
                </React.Fragment>
            ))}
        </div>
    );
}
