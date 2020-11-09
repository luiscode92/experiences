import React from 'react'
import { Paper, Card, Typography, makeStyles, Button } from '@material-ui/core'
import logo  from '../../src/Skillshare_logo_2020.svg';

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: '#0d2c3b'
    },
    pageHeader:{
        padding:theme.spacing(),
        display:'flex',
        marginBottom:theme.spacing(2),
        backgroundColor: '#0d2c3b'
    },
    pageIcon:{
        display:'inline-block',
        padding:theme.spacing(5),
        color:'#3c44b1'
    },
    pageTitle:{
        paddingLeft:theme.spacing(4),
        color: 'white',
        '& .MuiTypography-subtitle2':{
            opacity:'0.6'
        }
    },
    img: {
        padding:'10px',
        width:'230px',
        height:'100px',
        marginLeft: '270px'
    }
}))

export default function PageHeader(props) {

    const classes = useStyles();
    const { title, subTitle, icon } = props;
    return (
        <Paper elevation={1} square className={classes.root}>
            <div className={classes.pageHeader}>
            <a href="https://landingpage.d2p4rnxt78rjqm.amplifyapp.com/">
              <img src={logo} alt="logo skillshare" className={classes.img} />
            </a>
                <div className={classes.pageTitle}>
                    <Typography
                        variant="h6"
                        component="div">
                        {title}</Typography>
                    <Typography
                        variant="subtitle2"
                        component="div">
                        {subTitle}</Typography>
                </div>
            </div>
        </Paper>
    )
}
