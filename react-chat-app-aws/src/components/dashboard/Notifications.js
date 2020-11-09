import React from 'react';
import "../../App.css"
import ReactNotification from 'react-notifications-component'
import { store } from 'react-notifications-component';
import 'animate.css'
import 'react-notifications-component/dist/theme.css'

function Notifications() {
    return (
        <div className="container">
            <h1>Notifications</h1>
            <ReactNotification />
            <Home />
        </div>
    );
}

function Home(){
    const handleOnClickDefault = () =>{
        store.addNotification({
            title: "New Notification",
            message: "Felipe does not understand",
            type: "success",
            container: "top-left",
            insert: "top",
            animationIn: ["animated", "fadeIn"],
            animationOut: ["animated", "fadeOut"],
            
            dismiss: {
                duration: 9000,
                showIcon: true,
                onScreen: true,
                pauseOnHover: true
            }
        })
    }
    return (
        <div>
            <button onClick={handleOnClickDefault}>
                Help
            </button>
        </div>
    )
}

export default Notifications;