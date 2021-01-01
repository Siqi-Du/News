import React from "react";
import {withRouter} from 'react-router-dom';
import {IoMdTrash} from 'react-icons/io';
// import { ToastContainer, toast,cssTransition,Zoom } from 'react-toastify';


class Trash extends React.Component{
//   state = {
//     inputValue: '',
//     results: [], 
//     selectedResult: ''
// }
  componentDidMount(){
    if (localStorage.getItem("currentTab") === "search"){
      let trashes = document.getElementsByClassName("trash");
      for (let i=0; i< trashes.length;i++){
        trashes[i].style.display = "none";
      }
    }

    if (localStorage.getItem("currentTab") === "favorites"){
      let trashes = document.getElementsByClassName("trash");
      for (let i=0; i< trashes.length;i++){
        trashes[i].style.display = "inline";
      }
    }
  }

  render(){

    let deleteFavorite = (event) => {
      event.stopPropagation();
      event.preventDefault();
      localStorage.removeItem("favorite-" + this.props.card.article_id);
      let message = "Removing " + this.props.card.title;
      localStorage.setItem("message",message);
      this.props.history.push('/fav');  
    }

      return (
        <IoMdTrash className="card_share trash" onClick={deleteFavorite}/>
      )
  }
  
}

export default withRouter(Trash);
