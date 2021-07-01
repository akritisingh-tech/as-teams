import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVideo, faKeyboard } from "@fortawesome/free-solid-svg-icons";
import shortid from "shortid";
import Header from "./../UI/Header/Header";
import "./HomePage.scss";

const HomePage = () => {
    const history = useHistory();
    const startCall = () => {
        // Generating Unique ID
        const uid = shortid.generate();
        // Redirecting to the Call Page
        history.push(`/${uid}#admin`);
    }

    return (
        <div className="home-page">
            <Header />
            <div className="body">
                <div className="left-side">
                    <div className="content">
                        <h1>Microsoft Teams</h1>
                        <h3>Meet, chat, call, and collaborate in just one place.</h3>
                        <div className="meeting-btn">
                            <button className="btn blue" onClick={startCall}>
                                <FontAwesomeIcon className="icon" icon={faVideo} />
                                New Meeting
                            </button>
                            <div className="join-meeting">
                                <div className="input-section">
                                    <FontAwesomeIcon className="icon" icon={faKeyboard} />
                                    <input placeholder="Enter a Code or Link"></input>
                                </div>
                                <button className="btn no-bg">Join</button>
                            </div>
                        </div>
                    </div>
                    <div className="pricing">
                        <a href="">See plans and pricing</a>
                    </div>
                </div>
                <div className="right-side">
                    <div className="content">
                        <img src="https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RWDeEK?ver=e1e6&q=90&m=2&h=768&w=1024&b=%23FFFFFFFF&aim=true"></img>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomePage;