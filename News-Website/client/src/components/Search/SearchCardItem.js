import React, { Component } from 'react'
import { IoMdShare } from 'react-icons/io';
import Trash from './Trash';
import { Modal } from 'react-bootstrap';
import {
    EmailShareButton, FacebookShareButton, TwitterShareButton, EmailIcon,
    FacebookIcon, TwitterIcon
} from 'react-share';
import { Link } from 'react-router-dom';

import '../App.css';



export class SearchCardItem extends Component {
    constructor() {
        super();
        this.state = {
            openModal: false,
            shareUrl: '',
            openRedirect: true,
            modalSource: ''
        }
    }

    componentDidMount() {

        if (localStorage.getItem("currentTab") === "search") {
            let sources = document.getElementsByClassName("source");
            for (let i = 0; i < sources.length; i++) {
                sources[i].style.display = "none";
            }

        }

        if (localStorage.getItem("currentTab") === "favorites") {
            let sources = document.getElementsByClassName("source");
            for (let i = 0; i < sources.length; i++) {
                sources[i].style.display = "block";
            }
        }
    }


    render() {
        let closeModal = () => {
            this.setState({ openModal: false });
        }
        let openModal = (event) => {
            if (localStorage.getItem("currentTab") === "favorites") {
                this.setState({ modalSource: this.props.card.source });
            } else {
                this.setState({ modalSource: '' });
            }
            event.stopPropagation();
            event.preventDefault();
            this.setState({ openModal: true });
        }



        return (
            <div className="col-xs-12 col-md-6 col-lg-3">
                <Link className="redirect_to_detail" to={"/article?id=" + this.props.card.article_id} >
                    <div className="search_card ">
                        <div className="search_card_div">
                            <h6 className="card-title">{this.props.card.title}&nbsp;
                            <IoMdShare className="card_share" onClick={openModal} />
                                <Trash card={this.props.card} /></h6>
                            <div className="search_card_body">
                                <img className="img-thumbnail" src={this.props.card.img} alt="..." />
                                <p className="card-text search_card-text">
                                    <span className="card_date">{this.props.card.date}</span>
                                    <span className={"source card_section " + this.props.card.source}>{this.props.card.source}</span>
                                    <span className={"card_section " + this.props.card.section}>{this.props.card.section}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </Link>

                <Modal show={this.state.openModal} onHide={closeModal} aria-labelledby="ModalHeader">
                    <Modal.Header closeButton>
                        <Modal.Title>
                            <p className="share_source">{this.state.modalSource}</p>
                            {this.props.card.title}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="share_div">
                            <p className="share_p">Share via</p>
                            <FacebookShareButton className="share_btn" url={this.props.card.url} hashtag="#CSCI_571_NewsApp">
                                <FacebookIcon size={50} round={true} />
                            </FacebookShareButton>
                            <TwitterShareButton className="share_btn" url={this.props.card.url} hashtags={["CSCI_571_NewsApp"]}>
                                <TwitterIcon size={50} round={true} />
                            </TwitterShareButton>
                            <EmailShareButton className="share_btn" url={this.props.card.url} subject="#CSCI_571_NewsApp">
                                <EmailIcon size={50} round={true} />
                            </EmailShareButton>
                        </div>
                    </Modal.Body>
                </Modal>


            </div>



        )
    }
}


export default SearchCardItem
