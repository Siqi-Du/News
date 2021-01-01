import React, { Component } from 'react'
import { IoMdShare } from 'react-icons/io';
import { Modal } from 'react-bootstrap';
import {
    EmailShareButton, FacebookShareButton, TwitterShareButton, EmailIcon,
    FacebookIcon, TwitterIcon
} from 'react-share';
import { Link } from 'react-router-dom';
// import DetailedArticle from './DetailedArticle';

import '../App.css';


export class CardItem extends Component {
    constructor() {
        super();
        this.state = {
            openModal: false,
            shareUrl: '',
            openRedirect: true,
            trunc: ''
        }
    }

    componentDidMount() {
        // localStorage.setItem("currentCardsNum",parseInt(localStorage.getItem("currentCardsNum"))+1);
        var desc = document.getElementsByClassName("card_description")[this.props.card.id];
        var h = desc.offsetHeight;
        var sh = desc.scrollHeight;
        if (h < sh) {
            this.setState({ trunc: '...' });
            // document.getElementsByClassName("trunc")[parseInt(localStorage.getItem("currentCardsNum"))-1].style.display = "block";
        }
    }

    render() {
        let closeModal = () => {
            this.setState({ openModal: false });
        }
        let openModal = (event) => {
            event.stopPropagation();
            event.preventDefault();
            this.setState({ openModal: true });
        }


        return (
            <div>
                <Link className="redirect_to_detail" to={"/article?id=" + this.props.card.article_id} >
                    <div className="card" >
                        <div className="row no-gutters">
                            <div className="card_img_div col-md-3">
                                <div className="img_div"><img src={this.props.card.img} className="card-img" alt="..." /></div>
                            </div>
                            <div className="col-md-9">
                                <div className="card-body">
                                    <h5 className="card-title">{this.props.card.title}&nbsp;<IoMdShare className="card_share" onClick={openModal} />
                                    </h5>
                                    <div className="card_description_div">
                                        <p className="card-text card_description">{this.props.card.description}</p>
                                        <p className="trunc">{this.state.trunc}</p>
                                    </div>
                                    <p className="card-text">
                                        <span className="card_date">{this.props.card.date}</span>
                                        <span className={"card_section " + this.props.card.section}>{this.props.card.section}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Link>

                <Modal show={this.state.openModal} onHide={closeModal} aria-labelledby="ModalHeader">
                    <Modal.Header closeButton>
                        <Modal.Title>{this.props.card.title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="share_div">
                            <p className="share_p">Share via</p>
                            <FacebookShareButton className="share_btn facebook" url={this.props.card.url} hashtag="#CSCI_571_NewsApp">
                                <FacebookIcon size={50} round={true} />
                            </FacebookShareButton>
                            <TwitterShareButton className="share_btn twitter" url={this.props.card.url} hashtags={["CSCI_571_NewsApp"]}>
                                <TwitterIcon size={50} round={true} />
                            </TwitterShareButton>
                            <EmailShareButton className="share_btn email" url={this.props.card.url} subject="#CSCI_571_NewsApp">
                                <EmailIcon size={50} round={true} />
                            </EmailShareButton>
                        </div>
                    </Modal.Body>
                </Modal>
            </div>



        )
    }
}


export default CardItem
