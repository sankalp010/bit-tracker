import React from 'react'
import { Typography } from '@mui/material'
import { FaHeart } from 'react-icons/fa'
const Footer = () => {
    return (
        <Typography variant='h6' style={{
            color: "white",
            display: "flex",
            alignItems: "center",
            fontFamily: "Montserrat",
            padding: "2px",
            justifyContent: "center",
        }}>Built with&nbsp;<FaHeart aria-label="heart" style={{ color: '#e25555', marginRight: 6 }} />by&nbsp;sankalP</Typography>
    )
}

export default Footer
