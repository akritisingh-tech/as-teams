import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUserFriends,
    faCommentAlt,
    faUserCircle
} from "@fortawesome/free-solid-svg-icons";

import './CallPageHeader.scss';

const date = new Date();
const currentTime = date.getHours();
const currentmin = date.getMinutes();
const CallPageHeader = () => {
    return (
        <div className="frame-header">
            <div className="header-items icon-block">
                <FontAwesomeIcon className="icon" icon={faUserFriends} />
            </div>
            <div className="header-items icon-block">
                <FontAwesomeIcon className="icon" icon={faCommentAlt} />
                <span className="alert-circle-icon"></span>
            </div>
            <div className="header-items date-block">
                {currentTime}:{currentmin}
            </div>
            <div className="header-items icon-block">
                <FontAwesomeIcon className="icon profile" icon={faUserCircle} />
            </div>
        </div>
    )
}

export default CallPageHeader;