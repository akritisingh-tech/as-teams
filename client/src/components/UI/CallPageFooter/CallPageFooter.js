import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faVideo,
    faMicrophone,
    faPhone,
    faAngleUp,
    faClosedCaptioning,
    faDesktop,
    faMicrophoneSlash,
} from "@fortawesome/free-solid-svg-icons";

import "./CallPageFooter.scss";

const CallPageFooter = ({ isPresenting, stopScreenShare, screenShare }) => {
    return (
        <div className="footer-item">
            <div className="left-item">
                <div className="icon-block">
                    Meeting Details
                    <FontAwesomeIcon className="icon" icon={faAngleUp} />
                </div>
            </div>
            <div className="center-item">
                <div className="icon-block">
                    <FontAwesomeIcon className="icon" icon={faMicrophone} />
                </div>
                <div className="icon-block">
                    <FontAwesomeIcon className="icon red" icon={faPhone} />
                </div>
                <div className="icon-block">
                    <FontAwesomeIcon className="icon" icon={faVideo} />
                </div>
                {/* <div className="icon-block" title="Present">
                    <FontAwesomeIcon className="icon" icon={faDesktop} />
                </div> */}
            </div>

            <div className="right-item">
                {isPresenting ? (
                    <div className="icon-block" onClick={stopScreenShare}>
                        <FontAwesomeIcon className="icon red" icon={faDesktop} />
                        <p className="title">Stop Now</p>
                    </div>
                ) : (
                    <div className="icon-block" onClick={screenShare}>
                        <FontAwesomeIcon className="icon red" icon={faDesktop} />
                        <p className="title">Present Now</p>
                    </div>
                )};
            </div>
        </div>
    )
}

export default CallPageFooter;