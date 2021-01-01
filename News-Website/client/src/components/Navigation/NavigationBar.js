import React from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import Select from './Select';
import { FaRegBookmark, FaBookmark } from 'react-icons/fa';
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';
// import { browserHistory } from 'react-router';
import Home from './Home';
import World from './World';
import Politics from './Politics';
import Sports from './Sports';
import Technology from './Technology';
import Business from './Business';
// import NoMatch from './NoMatch';;
import Favorites from './Favorites';
import { default as SourceSwitch } from "react-switch";
import '../App.css';
import DetailedArticle from './DetailedArticle';
import Search from './Search';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
// import _ from "lodash";
// import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Blank from './Blank';


// a functional component returns a react element
class NavigationBar extends React.Component {
    constructor() {
        super();

        if (localStorage.getItem('switchChecked') == null) {
            localStorage.setItem('switchChecked', "true");
        }
        if (localStorage.getItem("source") == null) {
            localStorage.setItem("source", "g");
        }
    }


    handleSwitch = (checked) => {
        localStorage.setItem('switchChecked', JSON.stringify(checked));
        if (localStorage.getItem('switchChecked') === "true") {
            localStorage.setItem('source', "g");
        } else {
            localStorage.setItem('source', "n");
        }
        window.location.reload();
    }

    renderTooltip(str) {
        return (
            <Tooltip id="button-tooltip">
                {str}
            </Tooltip>
        );
    }


    render() {
        return (
            <BrowserRouter  >
                <Navbar collapseOnSelect variant="dark" expand="lg">
                    <Nav.Item className="nav_select col-xl-3 col-lg-4 col-md-5 col-sm-7 col-xs-7">
                        <Select />
                    </Nav.Item>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id='responsive-navbar-nav'>
                        <Nav className="mr-auto">
                            <Nav.Item className="left"><Nav.Link as={Link} to="/" href="/" className="navs home">Home</Nav.Link></Nav.Item>
                            <Nav.Item className="left"><Nav.Link as={Link} to="/world" href="/world" className="navs world">World</Nav.Link></Nav.Item>
                            <Nav.Item className="left"><Nav.Link as={Link} to="/politics" href="/politics" className="navs politics">Politics</Nav.Link></Nav.Item>
                            <Nav.Item className="left"><Nav.Link as={Link} to="/business" href="/business" className="navs business">Business</Nav.Link></Nav.Item>
                            <Nav.Item className="left"><Nav.Link as={Link} to="/technology" href="/technology" className="navs technology">Technology</Nav.Link></Nav.Item>
                            <Nav.Item className="left"><Nav.Link as={Link} to="/sport" href="/sport" className="navs sports" >Sports</Nav.Link></Nav.Item>
                        </Nav>
                        <Nav>
                            <OverlayTrigger placement="bottom" delay={{ show: 200, hide: 300 }} overlay={this.renderTooltip("Bookmark")} >
                                <Nav.Item className="left bookmark_no"><Nav.Link as={Link} to="/favorites" href="/favorites"> <FaRegBookmark className="bookmark_sign_no" /></Nav.Link></Nav.Item>
                            </OverlayTrigger>
                            <OverlayTrigger placement="bottom" delay={{ show: 200, hide: 300 }} overlay={this.renderTooltip("Bookmark")} >
                                <Nav.Item className="left bookmark_yes"><Nav.Link as={Link} to="/favorites" href="/favorites"><FaBookmark className="bookmark_sign_yes" /></Nav.Link></Nav.Item>
                            </OverlayTrigger>

                            <Nav.Item className="navitem_not_shown left pr-03"><Navbar.Text className="switch_text1 pr-1">NYTimes</Navbar.Text></Nav.Item>
                            <Nav.Item className="navitem_not_shown nav_switch left"><SourceSwitch className="switch"
                                checked={JSON.parse(localStorage.getItem('switchChecked'))}
                                onChange={this.handleSwitch}
                                uncheckedIcon={false}
                                checkedIcon={false}
                                onColor="#2196F3" offColor="#C8C8C8" /></Nav.Item>
                            <Nav.Item className="navitem_not_shown left"><Navbar.Text className="switch_text2 pr-3">Guardian</Navbar.Text></Nav.Item>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>

                <Switch className="page">
                    <Route exact path="/" render={(props) => <Home {...props} source={localStorage.getItem('source')} />} />
                    <Route path="/world" render={(props) => <World {...props} source={localStorage.getItem('source')} />} />
                    <Route path="/politics" render={(props) => <Politics {...props} source={localStorage.getItem('source')} />} />
                    <Route path="/business" render={(props) => <Business {...props} source={localStorage.getItem('source')} />} />
                    <Route path="/technology" render={(props) => <Technology {...props} source={localStorage.getItem('source')} />} />
                    <Route path="/sport" render={(props) => <Sports {...props} source={localStorage.getItem('source')} />} />
                    <Route path='/search/:q' component={Search} />
                    <Route path='/article' component={DetailedArticle} />
                    <Route path='/favorites' component={Favorites} />
                    <Route path='/fav' component={Blank} />

                </Switch>
            </BrowserRouter>

        )
    }
}

export default NavigationBar;

