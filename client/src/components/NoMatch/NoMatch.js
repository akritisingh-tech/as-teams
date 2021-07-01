
import Header from "../UI/Header/Header";
import { Link } from "react-router-dom";
import "./NoMatch.scss";


const NoMatch = () => {
    return (
        <div className="no-match">
            <Header/>
            <div className="content">
                <h3>We are sorry, the page you requested cannot be found.</h3>
                <div className="redirect-btn">
                    <Link className="btn blue" to="/">
                        Return to HomePage
                    </Link>
                </div>
                <img src="https://microsoft.acehacker.com/engage2021/img/demo-content/images/be_agile.png"/>
            </div>
        </div>
    )
}

export default NoMatch;