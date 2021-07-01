// import React, { useRef, useEffect } from "react";
// import io from "socket.io-client";

// const Room = (props) => {
//     const userVideo = useRef();
//     const partnerVideo = useRef();
//     const peerRef = useRef();
//     const socketRef = useRef();
//     const otherUser = useRef();
//     const userStream = useRef();
    
//     useEffect(() => {
//         navigator.mediaDevices.getUserMedia({ audio:true, video:true }).then(stream => {  // then we get this stream object that's actually includes both the audio and video.
//             userVideo.current.srcObject = stream;
//             userStream.current = stream; 
            
//             socketRef.current = io.connect("/");   //connect to socket.io server.
//             socketRef.current.emit("join room", props.match.params.roomID);   // grab the room id from URL and then send to server, and server put us in a specific room

//             socketRef.current.on("other user", userID => {   // when A is in room and b is joinig then this other user event will fire up for B
//                 callUser(userID);                            // userID=userID of A, when B will join server will give him the userId of A.                   
//                 otherUser.current = userID;        //use it later
//             });

//             socketRef.current.on("user joined", userID => {    // when A is in room and b is joinig then this other user event will fire up for A.(the one in room will get notified about the person that'joined through the "user joined " event)
//                 otherUser.current =  userID;       
//             });

//             socketRef.current.on("offer", handleRecieveCall);  // when we'r receiving an offer so then call the handlereceivecall function 
//             socketRef.current.on("answer", handleAnswer);      // when we'r sending an answer 
//             socketRef.current.on("ice-candidate", handleNewICECandidateMsg);

//         });

//     }, []); 
    
//     function callUser(userID) {
//         peerRef.current = createPeer(userID);
//         userStream.current.getTracks().forEach(track => peerRef.current.addTrack(track, userStream.current));
//     };

//     function createPeer(userID) {
//         const peer = new RTCPeerConnection({
//             iceServers: [
//                 {
//                     urls: "stun:stun.stunprotocol.org"
//                 },
//                 {
//                     urls: "turn:numb.viagenie.ca",
//                     credential: 'muazkh',
//                     username: 'webrtc@live.com'
//                 },
//             ]
//         });

//         peer.onicecandidate = handleICECandidateEvent;
//         peer.ontrack = handleTrackEvent;
//         peer.onnegotiationneeded = () => handleNegotiationNeededEvent(userID);  //when 1st person negotiate the call

//         return peer;
//     }

//     function handleNegotiationNeededEvent(userID) {
//         peerRef.current.createOffer().then(offer => {
//             return peerRef.current.setLocalDescription(offer);  //whatever offer you'r receiving from somebody else set as your remote description
//         }).then(() => {                                        //whatever offer/answer you'r creating yourself  set as your local description
//             const payload = {
//                 target: userID, //target of a person we are trying to send the offer to 
//                 caller: socketRef.current.id, //send our own ID 
//                 sdp: peerRef.current.localDescription //actual offer data 
//             }; 
//             socketRef.current.emit("offer", payload); 
//         }).catch( e => console.log(e));
//     }

//     function handleRecieveCall(incoming) {
//         peerRef.current = createPeer();
//         const desc = new RTCSessionDescription(incoming.sdp);
//         peerRef.current.setRemoteDescription(desc).then(() => {
//             userStream.current.getTracks().forEach(track => peerRef.current.addTrack(track, userStream.current));
//         }).then(() => {
//             return peerRef.current.createAnswer();
//         }).then(answer => {
//             return peerRef.current.setLocalDescription(answer);
//         }).then(() => {
//             const payload = {
//                 target: incoming.caller,
//                 caller: socketRef.current.id,
//                 sdp: peerRef.current.localDescription
//             }
//             socketRef.current.emit("answer", payload);
//         })
//     };

//     function handleAnswer(message) {
//         const desc = new RTCSessionDescription(message.sdp);
//         peerRef.current.setRemoteDescription(desc).catch(e => console.log(e));
//     };

//     function handleICECandidateEvent(e) {
//         if (e.candidate) {
//             const payload = {
//                 target: otherUser.current,
//                 candidate: e.candidate,
//             }
//             socketRef.current.emit("ice-candidate", payload);
//         }
//     };

//     function handleNewICECandidateMsg(incoming) {
//         const candidate = new RTCIceCandidate(incoming);

//         peerRef.current.addIceCandidate(candidate)
//             .catch(e => console.log(e));
//     }

//     function handleTrackEvent(e) {
//         partnerVideo.current.srcObject = e.streams[0];
//     }; 

//     return (
//         <div>
//             <video autoPlay ref={userVideo} />
//             <video autoPlay ref={partnerVideo} />
//         </div>
//     )
// };

// export default Room;

import React, { useRef, useEffect ,useState } from "react";
import send from "send";
import io from "socket.io-client";
import styled from "styled-components";
import CallPageFooter from "../components/UI/CallPageFooter/CallPageFooter";

const Container = styled.div`
    height: 100vh;
    width: 50%;
    margin: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const Messages = styled.div`
    width: 100%;
    height: 60%;
    border: 1px solid black;
    margin-top: 10px;
    overflow: scroll;
`;

const MessageBox = styled.textarea`
    width: 100%;
    height: 30%;
`;

const Button = styled.div`
    width: 50%;
    border: 1px solid black;
    margin-top: 15px;
    height: 5%;
    border-radius: 5px;
    cursor: pointer;
    background-color: black;
    color: white;
    font-size: 18px;
`;

const MyRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
`;

const MyMessage = styled.div`
  width: 45%;
  background-color: blue;
  color: white;
  padding: 10px;
  margin-right: 5px;
  text-align: center;
  border-top-right-radius: 10%;
  border-bottom-right-radius: 10%;
`;

const PartnerRow = styled(MyRow)`
  justify-content: flex-start;
`;

const PartnerMessage = styled.div`
  width: 45%;
  background-color: grey;
  color: white;
  border: 1px solid lightgray;
  padding: 10px;
  margin-left: 5px;
  text-align: center;
  border-top-left-radius: 10%;
  border-bottom-left-radius: 10%;
`;

// const startButton = document.getElementById('startButton');
// const callButton = document.getElementById('callButton');
// const hangupButton = document.getElementById('hangupButton');
// callButton.disabled = true;
// hangupButton.disabled = true;
// startButton.addEventListener('click', start);
// callButton.addEventListener('click', call);
// hangupButton.addEventListener('click', hangup);

const Room = (props) => {
    const userVideo = useRef();
    const partnerVideo = useRef();
    const peerRef = useRef();
    const socketRef = useRef();
    const otherUser = useRef();
    const userStream = useRef();
    const senders = useRef([]);
    const sendChannel = useRef();
    const [text, setText] = useState("");
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then(stream => {
            userVideo.current.srcObject = stream;
            userStream.current = stream;

            socketRef.current = io.connect("/");
            socketRef.current.emit("join room", props.match.params.roomID);

            socketRef.current.on('other user', userID => {
                // eslint-disable-next-line
                callUser(userID);
                otherUser.current = userID;
            });

            socketRef.current.on("user joined", userID => {
                otherUser.current = userID;
            });

            socketRef.current.on("offer", handleRecieveCall);

            socketRef.current.on("answer", handleAnswer);

            socketRef.current.on("ice-candidate", handleNewICECandidateMsg);
        });

    }, []);
    
    function callUser(userID) {
        peerRef.current = createPeer(userID);
        userStream.current.getTracks().forEach(track => senders.current.push(peerRef.current.addTrack(track, userStream.current)));  // add track allows you to take your track and send over to the other person
        sendChannel.current = peerRef.current.createDataChannel("sendChannel");
        sendChannel.current.onmessage = handleReceiveMessage;
    }
    
    function handleReceiveMessage(e) {
        setMessages(messages => [...messages, { yours:false, value: e.data }]);
    } 

    function createPeer(userID) {
        const peer = new RTCPeerConnection({
            iceServers: [
                {
                    urls: "stun:stun.stunprotocol.org"
                },
                {
                    urls: 'turn:numb.viagenie.ca',
                    credential: 'muazkh',
                    username: 'webrtc@live.com'
                },
            ]
        });

        peer.onicecandidate = handleICECandidateEvent;
        peer.ontrack = handleTrackEvent;
        peer.onnegotiationneeded = () => handleNegotiationNeededEvent(userID);

        return peer;
    }

    function handleNegotiationNeededEvent(userID) {
        peerRef.current.createOffer().then(offer => {
            return peerRef.current.setLocalDescription(offer);
        }).then(() => {
            const payload = {
                target: userID,
                caller: socketRef.current.id,
                sdp: peerRef.current.localDescription
            };
            socketRef.current.emit("offer", payload);
        }).catch(e => console.log(e));
    }

    function handleRecieveCall(incoming) {
        peerRef.current = createPeer();
        peerRef.current.ondatachannel = (event) => {
            sendChannel.current = event.channel;
            sendChannel.current.onmessage = handleReceiveMessage;
        };
        const desc = new RTCSessionDescription(incoming.sdp);
        peerRef.current.setRemoteDescription(desc).then(() => {
            userStream.current.getTracks().forEach(track => senders.current.push(peerRef.current.addTrack(track, userStream.current)));
            // userStream.current.getTracks().forEach(track => peerRef.current.addTrack(track, userStream.current));
        }).then(() => {
            return peerRef.current.createAnswer();
        }).then(answer => {
            return peerRef.current.setLocalDescription(answer);
        }).then(() => {
            const payload = {
                target: incoming.caller,
                caller: socketRef.current.id,
                sdp: peerRef.current.localDescription
            }
            socketRef.current.emit("answer", payload);
        })
    }
    

    function handleAnswer(message) {
        const desc = new RTCSessionDescription(message.sdp);
        peerRef.current.setRemoteDescription(desc).catch(e => console.log(e));
    }

    function handleICECandidateEvent(e) {
        if (e.candidate) {
            const payload = {
                target: otherUser.current,
                candidate: e.candidate,
            }
            socketRef.current.emit("ice-candidate", payload);
        }
    }

    function handleNewICECandidateMsg(incoming) {
        const candidate = new RTCIceCandidate(incoming);

        peerRef.current.addIceCandidate(candidate)
            .catch(e => console.log(e));
    }

    function handleTrackEvent(e) {
        partnerVideo.current.srcObject = e.streams[0];
    };

    function handleChange(e) {
        setText(e.target.value);
    }

    function sendMessage () {
        sendChannel.current.send(text);
        setMessages(messages => [...messages , {yours:true, value:text}]);
        setText("");
    }

    
    function shareScreen() {
        navigator.mediaDevices.getDisplayMedia({ cursor: true }).then(stream => {
            const screenTrack = stream.getTracks()[0];
            senders.current.find(sender => sender.track.kind === 'video').replaceTrack(screenTrack);
            screenTrack.onended = function() {
                console.log("screen share has ended");
                senders.current.find(sender => sender.track.kind === "video").replaceTrack(userStream.current.getTracks()[1]);
            }
        })
    }

    function stopScreenShare () {

    }
    // const disconnectCall = () => {
    //     peer.destroy();
    //     history.push("/");
    //     window.location.reload();
    //   };
    
    function renderMessage(message, index) {
        if (message.yours) {
            return (
                <MyRow key={index}>
                    <MyMessage>
                        {message.value}
                    </MyMessage>
                </MyRow>
            )
        }

        return (
            <PartnerRow key={index}>
                <PartnerMessage>
                    {message.value}
                </PartnerMessage>
            </PartnerRow>
        )
    }
    const [value, setValue] = useState("");

    const handleChnge = e => {
        setValue(e.target.value);
      };
    
    return (
        <div>
            <video controls style={{height: 500, width: 500}} autoPlay ref={userVideo} />
            <video controls style={{height: 500, width: 500}} autoPlay ref={partnerVideo} />
            <CallPageFooter stopScreenShare={stopScreenShare} screenShare={shareScreen}  />
            {/* <button onClick={shareScreen}>Start Share screen</button> */}
            {/* <button onClick={stopScreenShare}>Stop Screen Share</button> */}
            <Messages>
                {messages.map(renderMessage)}
            </Messages>
            <MessageBox value={text} onChange={handleChange} placeholder="Say something....." />
            {/* <Button  onClick={sendMessage}>Send..</Button> */}
            
        <input
          value={value}
          onChange={handleChnge}
        />
        <button
          onClick={sendMessage}
          type="submit"
        >
          Send..
        </button>
        {/* <button id="startButton">{Start}</button>
        <button id="callButton">{Call}</button>
        <button id="hangupButton">{HangUp}</button> */}
    
        </div>
    );
};

export default Room;