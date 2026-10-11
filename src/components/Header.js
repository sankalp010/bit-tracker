import React from "react";
import { AppBar, Container, Toolbar, Typography, Select, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { CryptoState } from "../CryptoContext";
import AuthModal from "./AuthModal";
import UserSideBar from "./UserSideBar";
const Header = () => {
    const { currency, setCurrency, user } = CryptoState();
    const navigate = useNavigate();
    return <>
        <AppBar color="transparent" position="static">
            <Container>
                <Toolbar>
                    <Typography sx={{ flex: 1, color: 'gold', fontFamily: 'Montserrat', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => navigate('/')} variant="h6">🪙 Bit-Tracker</Typography>
                    <Select variant="outlined"
                        style={{
                            width: "100px",
                            height: "40px",
                            marginRight: "15"
                        }}
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                    >
                        <MenuItem value={"USD"}>USD</MenuItem>
                        <MenuItem value={"INR"}>INR</MenuItem>
                    </Select>
                    {user ? <UserSideBar /> : < AuthModal />}
                </Toolbar>
            </Container>
        </AppBar>
        </>
}
export default Header;
