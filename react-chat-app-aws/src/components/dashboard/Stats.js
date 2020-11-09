import React, { useState, useEffect, useReducer, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import theme from '../../theme';
import uniqBy from 'lodash/uniqBy';
import isEqual from 'lodash/isEqual'

import { useParams } from 'react-router-dom';
import { API, Auth } from 'aws-amplify';
import { listScoresForRoom as ListScores } from '../../graphql/queries';

const { primaryColor } = theme;

const SET_SCORES = "SET_SCORES";
const SET_LOADING = "SET_LOADING";

const initialState = {
    scores: [],
    loading: true
}

function reducer(state, action) {
    switch(action.type) {
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

export default function Stats() {
    console.log("used stats func")

    const [user, setUser] = useState(null);
    const [state, dispatch] = useReducer(reducer, initialState);
    const params = useParams();
    const { name, id } = params;
    let isMounted = true;
    useEffect(() => {
      listScores();
      return () => {
        isMounted = false;
      }
    }, []);
  
    useEffect(() => {
      if (isEqual(prev.current, [user, setUser])) {
        return
      }
      checkUser();
      return () => {
        isMounted = false;
      }});

    const prev = useRef()
    useEffect(() => {
      prev.current = [user, setUser]
    })
  
    async function checkUser() {
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
        } catch (err) {
          console.log('error fetching scores: ', err)
        }
    }

    function checkScoreOwner(scoreData) {
      if (scoreData.owner === user.username) {
        return true;
      } else { 
        return false;
      }
    }

    function getScoreValue(scoreData) {
      return scoreData.content;
    }

    function getScoreCreationDate(scoreData) {
      return scoreData.createdAt;
    }    

    const scoreDataCurrentUser = state.scores.filter(checkScoreOwner);
    const scoresCurrentUser = scoreDataCurrentUser.map(getScoreValue);
    const scoresCreationCurrentUser = scoreDataCurrentUser.map(getScoreCreationDate);
    // variables for the status of the class
    const reverseScoreData = state.scores.reverse();
    const key = 'owner';
    const tryLodash = uniqBy(reverseScoreData, key);
    const mostRecentScoreForEachUser = tryLodash.map(getScoreValue);

    function getAverage(scoreData) {
      console.log(scoreData);
      var sum = 0;
      var len = scoreData.length;
      for(var i = 0; i < len; i++) {
        sum += parseInt( scoreData[i], 10);
      }

      const avg = parseInt(sum/len, 10);
      console.log('used func average');
      console.log(sum);
      console.log(len);
      console.log(avg);
      return avg;
    }
    // this is the average Classroom Score (should store for teacher metric)
    const classRoomAverage = getAverage(mostRecentScoreForEachUser);

    const charData = {
        labels: scoresCreationCurrentUser,
        datasets:[
            {
                label:'Understanding',
                data:scoresCurrentUser,
                borderColor:primaryColor,
                backgroundColor:'#00fc83',
                fill: false
            }
        ]
    }

    return (
        <div className="chart">
            <h3>Whole Class average score is: {classRoomAverage}</h3>
            <h2>Room: {name}</h2>
            <Line
                data={charData}
                width={100}
                height={100}
                options={{
                    title:{
                        display:true,
                        text:'Your understanding vs Time',
                        fontSize:25
                    },
                    legend:{
                        display:false,
                        position:'right'
                    },
                    scales:{
                        yAxes:[{
                            ticks:{
                                max:5,
                                min:0,
                                stepSize:1
                            }
                        }]
                    }
                }}
            />
        </div>
    )
}