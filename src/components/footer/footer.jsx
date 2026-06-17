import { Link } from "react-router";
import githubLogo from '../../assets/svgs/githubLogo.svg';
import instagramLogo from '../../assets/svgs/instagramLogo.svg';
import './footer.css';

function Footer() {
    return (<>
        <footer>
            <div id="qoute"><h2>The page ends here, never the possibilities of mazes</h2></div>
            <div id="footerDown">
                <div id="footerLeft">
                    <div>
                        <h3>Pages</h3>
                        <ul>
                            <li><Link to={"/"}>Home</Link></li>
                            <li><Link to={"/about"}>About</Link></li>
                            <li><Link to={"/algorithms"}>Algorithms</Link></li>
                            <li><Link to={"/generate"}>Generate</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3>Know the developer</h3>
                        <ul>
                            <li><Link to={""}>GitHub</Link></li>
                            <li><Link to={""}>Instagram</Link></li>
                        </ul>
                    </div>
                </div>
                <div id="footerRight">MAZE</div>
            </div>
        </footer>
    </>);
}

export default Footer;