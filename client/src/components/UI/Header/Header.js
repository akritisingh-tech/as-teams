import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faQuestionCircle,
    faExclamationCircle,
    faCog,
} from "@fortawesome/free-solid-svg-icons";

import './Header.scss';

const Header = () => {
    return (
        <div className="header">
            <div className="logo">
                {/* <img src="./client/public/images/logo.png"></img> */}
                <img src="https://i.ibb.co/sChxyYs/logo.png" alt="logo" border="0"></img>
                <span className="logo-text">Microsoft Teams</span>
            </div>
            <div className="right-panel">
                <FontAwesomeIcon className="icon-block" icon={faQuestionCircle} />
                <FontAwesomeIcon className="icon-block" icon={faExclamationCircle} />
                <FontAwesomeIcon className="icon-block" icon={faCog} />
            </div>
        </div>
    )
}

export default Header;