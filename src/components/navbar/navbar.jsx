import { Link } from "react-router-dom";
import logo from "../../assets/react.svg";
import '../../common.css'
import "./navbar.css";


function Navbar() {
  return (
    <nav>
      <ul>
        <li><Link to={"/"} id="logo"><h1>M</h1></Link></li>
        <li><Link to={"/about"}>About</Link></li>
        <li><Link to={"/algorithms"}>Algorithms</Link></li>
        <li><Link to={"/generate"}>Generate</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
