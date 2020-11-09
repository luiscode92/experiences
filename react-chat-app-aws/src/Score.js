import React, { useState, useEffect, useReducer, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { API, Auth } from 'aws-amplify';
import theme from './theme';

import { listScoresForRoom as ListScores } from './graphql/queries';
import { createScore as CreateScore } from './graphql/mutations';
import { onCreateScoreByRoomId as OnCreateScore } from './graphql/subscriptions';

//Import of Rating.js
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
//import Until here

const { primaryColor } = theme;

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

const scrollToRef = (ref) => {
  if (!ref.current) return;
  window.scrollTo(0, ref.current.offsetTop);
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
  const params = useParams();
  const scrollRef = useRef(null);
  const executeScroll = () => scrollToRef(scrollRef);
  const executeScrollWithAnimation = () => scrollToRefWithAnimation(scrollRef);
  const { name, id } = params;
  let subscription;
  let isMounted = true;
  useEffect(() => {
    listScores();
    setUserState();
    subscribe();
    return () => {
      subscription.unsubscribe();
      isMounted = false;
    }
  }, []);
  function subscribe() {
    subscription = API.graphql({
      query: OnCreateScore,
      variables: {
        roomId: id
      }
    })
    .subscribe({
      next: async subscriptionData => {
        const { value: { data: { onCreateScoreByRoomId }}} = subscriptionData;
        const currentUser = await Auth.currentAuthenticatedUser();
        if (onCreateScoreByRoomId.owner === currentUser.username) return;
        dispatch({ type: CREATE_SCORE, score: onCreateScoreByRoomId });
        executeScrollWithAnimation();
      }
    })
  }
  async function setUserState() {
    const user = await Auth.currentAuthenticatedUser();
    if (!isMounted) return;
    setUser(user);
  }
  async function listScores() {
    try {
      const scoreData = await API.graphql({
        query: ListScores,
        variables: {
          roomId: id,
          sortDirection: 'ASC'
        }
      })
      dispatch({ type: SET_SCORES, scores: scoreData.data.listScoresForRoom.items });
      executeScroll();
    } catch (err) {
      console.log('error fetching scores: ', err)
    }
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
    <div>
    <div style={inputContainerStyle}>
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
                defaultValue={0}
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
      </div>
    
    <div>
      <h2>Room: {name}</h2>
      {
        state.scores.length === Number(0) && !state.loading && (
          <div style={noScoreContainer}>
            <h1>No scores yet!</h1>
          </div>
        )
      }
      <div>
        {
          state.scores.map((score, index) => (
            <div
              ref={(index === Number(state.scores.length - 1) ? scrollRef : null)}
              key={score.id || score.content}
              style={scoreContainerStyle(user, score)}>
              <p style={scoreStyle(user, score)}>{score.content}</p>
              <p style={ownerStyle(user, score)}>{score.owner}</p>
            </div>
          ))
        }
      </div>
      
    </div>
    </div>
  )
}

const scoreContainerStyle = (user, score) => {
  const isOwner = user && user.username === score.owner;
  return {
    backgroundColor: isOwner ? primaryColor : '#ddd',
    padding: '15px 18px',
    borderRadius: 4,
    marginBottom: 10,
    boxShadow: `0 1px 1px rgba(0,0,0,0.11), 
    0 2px 2px rgba(0,0,0,0.11)`
  }
}

const scoreStyle = (user, score) => {
  const isOwner = user && user.username === score.owner;
  return {
     color: isOwner ? 'white' : 'black',
     fontSize: 'auto',
     margin: 0
  }
}

const ownerStyle = (user, score) => {
  const isOwner = user && user.username === score.owner;
  return {
     color: isOwner ? '#ddd' : '#666',
     fontWeight: 400,
     fontSize: 'auto',
     marginTop: 8,
     marginBottom: 0
  }
}

const inputContainerStyle = {
  display: 'flex',
  position: 'fixed',
  bottom: 0,
  height: 50,
  backgroundColor: '#ddd',
  /*width: '25%',*/
  left: 0
}

const noScoreContainer = {
  marginTop: 200,
  display: 'flex',
  justifyContent: 'center',
  color: primaryColor
}