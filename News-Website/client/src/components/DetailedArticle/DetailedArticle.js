import React from 'react';
import axios from 'axios';
import {
    EmailShareButton, FacebookShareButton, TwitterShareButton, EmailIcon,
    FacebookIcon, TwitterIcon
} from 'react-share';
import { FaRegBookmark, FaBookmark } from 'react-icons/fa';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { ToastContainer, toast, cssTransition, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import commentBox from 'commentbox.io';
import qs from 'qs';
import { Element, scroller } from 'react-scroll';


import '../App.css';

class DetailedArticle extends React.Component {
    constructor() {
        super();
        this.state = {
            article: '',
            err: '',
            favorite: 'false',
            diaplay_description: ''
        }
        localStorage.setItem("commentKey", '5735653593579520-proj');
    }

    find(str) {
        var x = str.indexOf('. ');
        for (var i = 1; i < 4; i++) {
            x = str.indexOf('. ', x + 1);
            if (x === -1) return x + 1
        }
        return x + 1;
    }

    componentDidMount = () => {

        document.getElementsByClassName("home")[0].setAttribute("class", "nav-link home");
        document.getElementsByClassName("world")[0].setAttribute("class", " nav-link world");
        document.getElementsByClassName("business")[0].setAttribute("class", " nav-link business");
        document.getElementsByClassName("technology")[0].setAttribute("class", " nav-link technology");
        document.getElementsByClassName("sports")[0].setAttribute("class", " nav-link sports");
        document.getElementsByClassName("politics")[0].setAttribute("class", " nav-link politics");
        document.getElementsByClassName('bookmark_yes')[0].style.display = "none";
        document.getElementsByClassName('bookmark_no')[0].style.display = "inline";

        document.getElementsByClassName("loading")[0].style.display = "block";

        localStorage.setItem("currentTab", "detailed_article");
        let article_id = this.props.location.search;

        for (let i = 0; i < 3; i++) {
            document.getElementsByClassName("navitem_not_shown")[i].style.display = "none";
        }

        // console.log("will send request to server in detailed_article tab");
        // axios.get(`http://ec2-54-146-190-253.compute-1.amazonaws.com:5000/`)
        axios.get('http://ec2-54-146-190-253.compute-1.amazonaws.com:5000/article' + article_id + '&source=' + localStorage.getItem('source'))
            .then(res => {
                const dataFromServer = res.data;

                if (res.status === 200) {
                    // console.log("detailed done");
                    document.getElementsByClassName("loading")[0].style.display = "none";
                    document.getElementsByClassName("detailed_article")[0].style.display = "block";

                    if (localStorage.getItem("favorite-" + dataFromServer.article_id) == null) {
                        document.getElementsByClassName('detail_bookmark_no')[0].style.display = 'inline';
                        document.getElementsByClassName('detail_bookmark_yes')[0].style.display = 'none';
                    } else {
                        document.getElementsByClassName('detail_bookmark_no')[0].style.display = 'none';
                        document.getElementsByClassName('detail_bookmark_yes')[0].style.display = 'inline';
                    }

                    let display_desc = dataFromServer.description;
                    let last_index = this.find(display_desc);
                    if (last_index === 0) {
                        document.getElementsByClassName("arrow")[0].style.display = 'none';
                        document.getElementsByClassName("arrow")[1].style.display = 'none';
                        this.setState({ diaplay_description: display_desc });
                    }
                    else {
                        this.setState({ diaplay_description: display_desc.substr(0, last_index) + "..." });
                        document.getElementsByClassName("arrow")[0].style.display = 'block';
                    }

                }
                this.setState({ article: dataFromServer });
            })
            .catch(error => {
                this.setState({ err: error.message })
            })

        this.removeCommentBox = commentBox("5735653593579520-proj", {
            createBoxUrl(boxId, pageLocation) {
                const queryParams = qs.parse(pageLocation.search.replace('?', ''));
                const relevantParams = { 'id': queryParams['id'] };
                pageLocation.search = qs.stringify(relevantParams); // we will now include "?page_id=5" in the box URL
                pageLocation.hash = boxId; // creates link to this specific Comment Box on your page
                // console.log(pageLocation.href);
                // document.getElementsByClassName("commentbox")[0].setAttribute("id",pageLocation.href);
                // localStorage.setItem("currentId",pageLocation.search);
                return relevantParams['id']; // return id string
            }
        });

    }

    componentWillUnmount() {
        this.removeCommentBox();
    }


    renderTooltip(str) {
        return (
            <Tooltip id="button-tooltip">
                {str}
            </Tooltip>
        );
    }


    Zoom = cssTransition({
        enter: 'zoomIn',
        exit: 'zoomOut',
        duration: 700,
    });

    renderToast = () => {

        if (localStorage.getItem("favorite-" + this.state.article.article_id) == null) {
            let message = "Saving " + this.state.article.title;
            toast(message);
            localStorage.setItem("favorite-" + this.state.article.article_id, JSON.stringify(this.state.article));
            document.getElementsByClassName('detail_bookmark_no')[0].style.display = 'none';
            document.getElementsByClassName('detail_bookmark_yes')[0].style.display = 'inline';
        } else {
            let message = "Removing " + this.state.article.title;
            toast(message);
            localStorage.removeItem("favorite-" + this.state.article.article_id);
            document.getElementsByClassName('detail_bookmark_no')[0].style.display = 'inline';
            document.getElementsByClassName('detail_bookmark_yes')[0].style.display = 'none';
        }
    }

    expand = () => {
        document.getElementsByClassName("detailed_description")[0].innerHTML = this.state.article.description;
        document.getElementsByClassName("arrow_u")[0].style.display = 'block';
        document.getElementsByClassName("arrow_d")[0].style.display = 'none';
        scroller.scrollTo("last", { smooth: true });
    }

    shrink = () => {
        document.getElementsByClassName("detailed_description")[0].innerHTML = this.state.diaplay_description;
        document.getElementsByClassName("arrow_u")[0].style.display = 'none';
        document.getElementsByClassName("arrow_d")[0].style.display = 'block';
        scroller.scrollTo("first", { smooth: true });
    }

    render() {
        return (
            <div className="detailed_article">
                <ToastContainer className="left" autoClose={false} position="top-center" closeOnClick={true} draggablePercent={60} transition={Zoom} />
                <Element name="first" />
                <div className="card detail_card" onClick={toast.dismiss}>
                    {/* <Element name="first">First ele</Element> */}
                    <p className="card-title detail_title">{this.state.article.title}</p>
                    <div className="detail_date_share_div">
                        <span className="detail_date">{this.state.article.date}</span>
                        <span className="detail_share">
                            <OverlayTrigger placement="top" delay={{ show: 200, hide: 300 }} overlay={this.renderTooltip("Facebook")} >
                                <FacebookShareButton className="detail_share_btn" url={this.state.article.url} hashtag="#CSCI_571_NewsApp">
                                    <FacebookIcon size={30} round={true} />
                                </FacebookShareButton>
                            </OverlayTrigger>
                            <OverlayTrigger placement="top" delay={{ show: 200, hide: 300 }} overlay={this.renderTooltip("Twitter")} >
                                <TwitterShareButton className="detail_share_btn" url={this.state.article.url} hashtags={["CSCI_571_NewsApp"]}>
                                    <TwitterIcon size={30} round={true} />
                                </TwitterShareButton>
                            </OverlayTrigger>
                            <OverlayTrigger placement="top" delay={{ show: 200, hide: 300 }} overlay={this.renderTooltip("Email")} >
                                <EmailShareButton className="detail_share_btn" url={this.state.article.url} subject="#CSCI_571_NewsApp">
                                    <EmailIcon size={30} round={true} />
                                </EmailShareButton>
                            </OverlayTrigger>
                            <OverlayTrigger placement="top" delay={{ show: 200, hide: 300 }} overlay={this.renderTooltip("Bookmark")} >
                                <FaRegBookmark className="detail_bookmark_no" size={24} onClick={this.renderToast} />
                            </OverlayTrigger>
                            <OverlayTrigger placement="top" delay={{ show: 200, hide: 300 }} overlay={this.renderTooltip("Bookmark")} >
                                <FaBookmark className="detail_bookmark_yes" size={24} onClick={this.renderToast} />
                            </OverlayTrigger>

                        </span>
                    </div>
                    <img src={this.state.article.img} className="card-img-top" alt="..." />
                    <Element name="last" />
                    <div>
                        <p className="detailed_description">{this.state.diaplay_description}</p>
                    </div>
                    <p className="arrowP">
                        <IoIosArrowDown className="arrow arrow_d" onClick={this.expand} />
                        <IoIosArrowUp className="arrow arrow_u" onClick={this.shrink} />
                    </p>
                </div>

                <div className="commentbox"></div>
            </div>
        )
    }
}

export default DetailedArticle