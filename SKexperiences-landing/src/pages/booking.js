import React from 'react'
import { makeStyles, CssBaseline, createMuiTheme, ThemeProvider } from '@material-ui/core';
import BookClass from '../pages/bookClass';


const theme = createMuiTheme({
    palette: {
      primary: {
        main: "#0d2c3b",
        light: '#3c44b126'
      },
      secondary: {
        main: "#00fc83",
        light: '#f8324526'
      },
      background: {
        default: "#f4f5fd"
      },
    },
    overrides:{
      MuiAppBar:{
        root:{
          transform:'translateZ(0)'
        }
      }
    },
    props:{
      MuiIconButton:{
        disableRipple:true
      }
    }
  })

  const useStyles = makeStyles({
    appMain: {
      width: '100%',
    }
  })
  
  
export default function Booking() {
    const classes = useStyles();
    console.log("im in booking");

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.appMain}>
       <BookClass/>
      </div>
      <CssBaseline />
    </ThemeProvider>
  );
}