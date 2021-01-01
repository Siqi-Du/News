import React from 'react';
// import SearchCards from './SearchCards';
// import {CardDeck,CardColumns,Container} from 'react-bootstrap';
import SearchRow from './SearchRow';
import { ToastContainer, toast, Zoom } from 'react-toastify';

class Favorites extends React.Component {

    state = {
        cards: [],
        err: '',
        row: 0
    };

    componentDidMount = () => {

        document.getElementsByClassName("home")[0].setAttribute("class", "nav-link home");
        document.getElementsByClassName("world")[0].setAttribute("class", " nav-link world");
        document.getElementsByClassName("business")[0].setAttribute("class", " nav-link business");
        document.getElementsByClassName("technology")[0].setAttribute("class", " nav-link technology");
        document.getElementsByClassName("sports")[0].setAttribute("class", " nav-link sports");
        document.getElementsByClassName("politics")[0].setAttribute("class", " nav-link politics");

        document.getElementsByClassName("loading")[0].style.display = "block";
        document.getElementsByClassName("search")[0].style.display = "none";
        document.getElementsByClassName('bookmark_yes')[0].style.display = "inline";
        document.getElementsByClassName('bookmark_no')[0].style.display = "none";

        localStorage.setItem("currentTab", "favorites");

        for (let i = 0; i < 3; i++) {
            document.getElementsByClassName("navitem_not_shown")[i].style.display = "none";
        }

        var storage = window.localStorage;
        let num = 0;
        let favorites = [];
        let fav = [];
        for (let i = 0; i < storage.length; i++) {
            let key = storage.key(i);
            if (key.substr(0, 8) === "favorite") {
                num += 1;
                fav.push(JSON.parse(storage.getItem(key)));
            }
            if (num % 4 === 0) {
                if (fav.length !== 0) {
                    favorites.push(fav);
                    fav = [];
                }

            }
        }
        if (fav.length !== 0) {
            favorites.push(fav);
            fav = [];
        }

        this.setState({ cards: favorites });

        document.getElementsByClassName("loading")[0].style.display = "none";
        document.getElementsByClassName("search")[0].style.display = "block";

        if (favorites.length === 0) {
            document.getElementsByClassName('favorites_text')[0].innerHTML = 'You have no saved articles';
            document.getElementsByClassName('favorites_text')[0].setAttribute("class", "center");
        }

        if (localStorage.getItem("message") != null) {
            toast(localStorage.getItem("message"));
            localStorage.removeItem("message");
        }
    }



    render() {
        return (
            <div className="search">
                <ToastContainer className="left" autoClose={false} position="top-center" closeOnClick={true} draggablePercent={60} transition={Zoom} />

                <div className="container-fluid">
                    <h3 className="left favorites_text">Favorites</h3>
                    {
                        this.state.cards.map(
                            (row) => {
                                return <SearchRow key={this.state.row++} row={row} />
                            }
                        )
                    }
                </div>

            </div>
        )
    }
}

export default Favorites;
