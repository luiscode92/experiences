import React, { useState, useEffect, useReducer, useRef } from 'react';
//import { useParams } from 'react-router-dom';
import { API, Auth } from 'aws-amplify';
import theme from '../../theme';
import { createScore as CreateScore } from '../../graphql/mutations';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import FavoriteBorderRoundedIcon from '@material-ui/icons/FavoriteBorderRounded';
import FavoriteRoundedIcon from '@material-ui/icons/FavoriteRounded';


const useStyles = makeStyles((theme) => ({
  root: {
    width: 180 + theme.spacing(8) * 1,
  },
  margin: {
    height: theme.spacing(3),
  },
}));

const PrettoSlider = withStyles({
  root: {
    color: '#002333',
    height: 8,
  },
  thumb: {
    height: 24,
    width: 24,
    backgroundColor: '#00fc83',
    border: '2px solid #002333',
    marginTop: -8,
    marginLeft: -12,
    '&:focus, &:hover, &$active': {
      boxShadow: 'inherit',
    },
  },
  active: {},
  valueLabel: {
    left: 'calc(-50% + 4px)',
  },
  track: {
    height: 10,
    borderRadius: 5,
    background: 'linear-gradient(to right, #f6290c 0%, #f72905 25%, yellow 50%, #19fa05 100%)',
  },
  rail: {
    height: 10,
    borderRadius: 5,
    background: 'linear-gradient(to right, #f6290c 0%, #f72905 25%, yellow 50%, #19fa05 100%)',
  },
})(Slider);

const CREATE_SCORE = "CREATE_SCORE";
const SET_SCORES = "SET_SCORES";
const SET_LOADING = "SET_LOADING";

const initialState = {
  scores: [],
  loading: true
}

function reducer(state, action) {
  switch(action.type) {
    case CREATE_SCORE:
      return {
        ...state, scores: [...state.scores, action.score]
      }
    case SET_SCORES:
      return {
        ...state, scores: action.scores, loading: false
      }
    case SET_LOADING:
      return {
        ...state, loading: action.loading
      }
    default:
      return state;
  }
}

const scrollToRefWithAnimation = ref => {
  if (!ref.current) return;
  window.scrollTo({
    top: ref.current.offsetTop,
    behavior: 'smooth'
  });
}

export default function Score() {
  console.log("c")
  const classes = useStyles();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [user, setUser] = useState(null);
  const [inputValue, setInputValue] = useState('');
  //const params = useParams();
  const scrollRef = useRef(null);
  const executeScrollWithAnimation = () => scrollToRefWithAnimation(scrollRef);
  //const { name, id } = params;
  const name = 'Test%20room'
  const id = 'b5989464-e285-4c39-bf9d-0abef74dd3f2'
  console.log(name);
  console.log(id);
  let isMounted = true;
  useEffect(() => {
    setUserState();
    return () => {
      isMounted = false;
    }
  }, []);

  async function setUserState() {
    const user = await Auth.currentAuthenticatedUser();
    if (!isMounted) return;
    setUser(user);
  }

  async function createScore() {
    if (!inputValue) return;
    const score = { owner: user.username, content: inputValue, roomId: id };
    dispatch({ type: CREATE_SCORE, score });
    setInputValue('');
    setTimeout(() => {
      executeScrollWithAnimation();
    })
    try {
      await API.graphql({
        query: CreateScore,
        variables: {
          input: score
        }
      })
      console.log('score created!')
    } catch (err) {
      console.log('error creating score: ', err);
    }
  }

  const onChange=(e, value)=>{
    console.log(value)
    setInputValue(value);
  }
  return (
        <div className="rating">
          <div className={classes.root}>
            <Typography id="discrete-slider" gutterBottom variant="caption" align="center">
            How is the class going?
            </Typography>
            <Grid container spacing={2}>
              <Grid item>
                <FavoriteBorderRoundedIcon fontSize="default" style={{fill:"#002333"}}/>
              </Grid>
              <Grid item xs>
                <PrettoSlider 
                valueLabelDisplay="auto" 
                aria-label="pretto slider" 
                defaultValue={5}
                onChange={onChange}
                onChangeCommitted={createScore}
                step={1}
                marks
                min={0}
                max={5}
                size="small" />
              </Grid>
                <Grid item>
                  <FavoriteRoundedIcon style={{fill:"#002333"}} />
                </Grid>
              </Grid>
          </div>  
        </div>
  )
}
