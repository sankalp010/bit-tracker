import { Container, Typography } from '@mui/material';
import React from 'react'
import Caraousel from './Caraousel';
const Banner = () => {
    return (
        <div className="dashboard-banner">
            <Container className="dashboard-banner-content">
                <div className="dashboard-tagline">
                    <Typography variant='h2' style={{
                        fontWeight: "bold",
                        marginBottom: 15,
                        fontFamily: 'Montserrat',
                    }}>
                    Crypto Seer
                    </Typography>
                    <Typography variant='subtitle2' style={{
                        color: 'darkgray',
                        textTransform: "capitalize",
                        fontFamily: 'Montserrat',
                    }}>
                        Get All The Info Regarding Your Favorite Crypto Currency
                    </Typography>
                </div>
                <Caraousel />
            </Container>
        </div>
    )
}

export default Banner
