import React, { useEffect, useReducer } from 'react'
import { Link } from 'react-router-dom';
import { API } from 'aws-amplify';

import theme from './theme'
import { listRooms } from './graphql/queries';
import { onCreateRoom as OnCreateRoom } from './graphql/subscriptions';

const { primaryColor } = theme;

const CREATE_ROOM = "CREATE_ROOM";
const SET_ROOMS = "SET_ROOMS";
const SET_LOADING = "SET_LOADING";

const initialState = {
  loading: false,
  rooms: [],
  loading: true
}

function reducer(state, action) {
  switch (action.type) {
    case CREATE_ROOM:
      return { ...state, rooms: [...state.rooms, action.room] };
    case SET_ROOMS:
      return { ...state, rooms: action.rooms };
    case SET_LOADING:
      return { ...state, loading: action.loading };
    default:
      return state;
  }
}

export default function Rooms() {
  const [state, dispatch] = useReducer(reducer, initialState);
  let subscription;

  useEffect(() => {
    fetchRooms();
    subscribe();
    return () => subscription.unsubscribe();
  }, []);
  function subscribe() {
    subscription = API.graphql({
      query: OnCreateRoom
    })
    .subscribe({
      next: roomData => {
        console.log({ roomData });
        dispatch({ type: CREATE_ROOM, room: roomData.value.data.onCreateRoom });
      }
    })
  }
  async function fetchRooms() {
    try {
      const roomData = await API.graphql({
        query: listRooms,
        variables: { limit: 1000 }
      });
      dispatch({ type: SET_ROOMS, rooms: roomData.data.listRooms.items });
      console.log('roomData: ', roomData);
    } catch (err) {
      console.log('error: ', err)
    }
  }

  return (
    <div>
      <div>
        <h2 style={titleStyle}>Metrics by rooms</h2>
        {
          state.rooms.map((room) => (
            <Link to={`/Stats/${room.name}/${room.id}`} key={room.id} style={roomLinkStyle}>
              <p style={roomNameStyle}>{room.name}</p>
            </Link>
          ))
        }
      </div>
      </div>
  )
}

const roomLinkStyle = {
  textDecoration: 'none'
}

const roomNameStyle = {
  padding: '20px 0px',
  margin: 0,
  borderBottom: '1px solid #ddd',
  fontSize: '1vw',
  color: 'black',
  fontWeight: 300
}

const titleStyle = {
  color: primaryColor,
  fontSize: '1.7vw'
}