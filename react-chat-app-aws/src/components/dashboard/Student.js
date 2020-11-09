import  React, { Fragment, useEffect, useState, useRef } from 'react';
import Rating from './Rating';
import '../styles/student.css'
import { Auth } from 'aws-amplify'
import isEqual from 'lodash/isEqual'


export default function Profile() {
  const [user, setUser] = useState(null);
  let isMounted = true;
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

    return (
	    <Fragment>
            <div>
                <div className="media">
                    <div className="profile">
                        <img className="photo" src='https://static.skillshare.com/assets/images/default-profile-2020.jpg' alt="" height="20%" width="20%"/>
                        <div className="usertitle">
                            <span className="stick"></span>
                            <span className="userholder">
                                <h5>{ user && user.username }</h5>
                                <h6>Student's Dashboard</h6>
                            </span>
                        </div>
                      
                    </div>
                  <div className="rating">
                      <Rating/>
                  </div>                      
                    
                </div>
            </div>
         

        </Fragment>

    )
};

