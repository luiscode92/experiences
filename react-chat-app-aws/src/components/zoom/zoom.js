import React, { Component } from 'react'
import { ZoomMtg } from "@zoomus/websdk";
import './zoom.css'

ZoomMtg.preLoadWasm();
ZoomMtg.prepareJssdk();


const API_KEY = "xkQ_L-MRT5Ob_p5_KmsQ8g";
const API_SECRET = "JQx5DKmNAJmTb5HcmrWg6kVim3S4bellzy4p";
const MEETING_NUMBER =  98651077140;

const meetConfig = {
    apiKey: API_KEY,
    apiSecret: API_SECRET,
    meetingNumber: MEETING_NUMBER,
    userName: 'Skillshare Experience User',
    passWord: "Holb3rt0n",
    leaveUrl: "../public/index.html",
    role: 0
};

export default class Zoom extends Component {
    state = {
        meetingLaunched: false,
    }

    launchMeeting = () => {

    this.setState({ meetingLaunched: !this.state.meetingLaunched })
    ZoomMtg.generateSignature({
        meetingNumber: meetConfig.meetingNumber,
        apiKey: meetConfig.apiKey,
        apiSecret: meetConfig.apiSecret,
        role: meetConfig.role,
        success(res) {
            console.log('signature:', res.result);
            ZoomMtg.init({
                  leaveUrl: meetConfig.leaveUrl,
                    success() {
                        ZoomMtg.join(
                            {
                            meetingNumber: meetConfig.meetingNumber,
                            userName: meetConfig.userName,
                            signature: res.result,
                            apiKey: meetConfig.apiKey,
                            userEmail: 'luiscode92@gmail.com',
                            passWord: meetConfig.passWord,
                            success() {
                                console.log('join meeting success');
                            },
                            error(res) {
                                console.log(res);
                            }
                        }
                    );
                },
                error(res) {
                console.log(res);
                }
            });
        }
    });
}
    
    componentDidMount() {
        ZoomMtg.setZoomJSLib('https://source.zoom.us/1.8.1/lib', '/av'); 
        ZoomMtg.preLoadWasm();
        ZoomMtg.prepareJssdk();
    }

    render() {
        const { meetingLaunched} = this.state;
        // Displays a button to launch the meeting when the meetingLaunched state is false
        return (
            <div>
                {!meetingLaunched ? 
                    <button className="launchButton" onClick={this.launchMeeting}>Launch Meeting</button> 
                : 
                    <></>
                }
            </div>
        )
    }
}
