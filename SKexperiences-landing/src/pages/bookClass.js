import React from 'react'
import PageHeader from "../pages/PageHeader";
import { Paper,makeStyles, Grid } from '@material-ui/core';
import CalendlyEmbed from './calendly';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import {InlineWidget} from 'react-calendly'


const useStyles = makeStyles(theme => ({
    pageContent: {
        margin: theme.spacing(40),
        marginTop: theme.spacing(10),
        padding: theme.spacing(5)
    },
    classContent: {
        backgroudColor: 'blue',
        padding: '5px'
    },
    media: {
        height: '500px',
      },
      calendly: {
          height: '1000px'
      }
}))


export default function BookClass() {

    const classes = useStyles();

    
    return (
        <div>
            <PageHeader/>
            <Paper className={classes.pageContent}>
                <Grid container>
                    <Grid itme xs={6}>
                        <Typography gutterBottom variant="h3" component="h2">
                        About this live session        
                        </Typography>
                        <div className={classes.classContent}>
                           
                            <CardMedia
                                className={classes.media}
                                image="/img/classes/watercolor.jpg"
                                title="Contemplative Reptile"
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h3" component="h2">
                                Dive Into Beginner Watercolor: Easy Painting Basics
                                </Typography>
                                <Typography variant="h4" color="textSecondary" component="p">
                                Love the look of watercolor but not sure where to start? Beginning anything can feel daunting, and watercolor seems to have a reputation for being intimidating. But it doesn’t have to be! Join three painters for a workshop that’s all about those first steps into the colorful, quirky world of watercolor. Learn basic classic techniques, learn some more modern applications, and tackle your fear with abstract experiments. You’ll need a basic watercolor set, brushes, and paper. This is a judgment-free zone so you can feel safe and comfortable sharing your first watercolor paintings with the group!
                                </Typography>
                            </CardContent>
                            
                            
                        </div>
                    </Grid>
                    <Grid item xs={6}>
                    <div className={classes.calendly}>
                        <InlineWidget url="https://calendly.com/luiscode92/ch-12-manual-review-shell" />
                        </div>
                    </Grid>
                </Grid>
            </Paper>
            
        </div>
    )
}