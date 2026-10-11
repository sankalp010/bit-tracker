import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import Backdrop from '@mui/material/Backdrop';
import Fade from '@mui/material/Fade';
import { AppBar, Box, Button, Tab, Tabs } from '@mui/material';
import Login from './Login';
import SignUp from './SignUp';
import GoogleButton from 'react-google-button'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase';
import { CryptoState } from '../CryptoContext';
export default function AuthModal() {
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const [value, setValue] = useState(0);
    const { setAlert } = CryptoState();
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const googleProvider = new GoogleAuthProvider();
    const signInWithGoogle = () => {
        signInWithPopup(auth, googleProvider).then(res => {
            setAlert({
                open: true,
                message: `Sign Up Successful. Welcome ${res.user.email}`,
                type: 'success'
            });
            handleClose();
        }).catch(error => {
            setAlert({
                open: true,
                message: error.message,
                type: "error"
            });
            return;
        });
    };
    return (
        <div>
            <Button variant='contained'
                style={{
                    width: 85,
                    height: 40,
                    backgroundColor: '#EEBC1D'
                }}
                onClick={handleOpen}
            >Login</Button>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className="auth-modal"
                open={open}
                onClose={handleClose}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{ backdrop: { timeout: 500 } }}
            >
                <Fade in={open}>
                    <div className="auth-modal-paper">
                        <AppBar position='static' style={{
                            backgroundColor: "transparent", color: "white"
                        }} >
                            <Tabs value={value}
                                onChange={handleChange}
                                variant='fullWidth'
                                style={{ borderRadius: 10 }}
                            >
                                <Tab label="Login" />
                                <Tab label="Sign Up" />
                            </Tabs>
                        </AppBar>
                        {value === 0 && <Login handleClose={handleClose} />}
                        {value === 1 && <SignUp handleClose={handleClose} />}
                        <Box className="auth-modal-google">
                            <span>OR</span>
                            <GoogleButton style={{
                                width: "100%",
                                outline: "none"
                            }}
                                onClick={signInWithGoogle}
                            />
                        </Box>
                    </div>
                </Fade>
            </Modal>
        </div>
    );
}
