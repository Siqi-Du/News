import React from 'react';
import axios from 'axios';
import Cards from './Cards';
import '../App.css';

class World extends React.Component{
    
    state = {
        cards: [],
        err: ''
    };

    componentDidMount = () => {
        console.log("mount world component");
         
        document.getElementsByClassName("home")[0].setAttribute("class"," nav-link home");
        document.getElementsByClassName("world")[0].setAttribute("class","active nav-link world");
        document.getElementsByClassName("business")[0].setAttribute("class"," nav-link business");
        document.getElementsByClassName("technology")[0].setAttribute("class"," nav-link technology");
        document.getElementsByClassName("sports")[0].setAttribute("class"," nav-link sports");
        document.getElementsByClassName("politics")[0].setAttribute("class"," nav-link politics");
        
        document.getElementsByClassName('bookmark_yes')[0].style.display = "none";
        document.getElementsByClassName('bookmark_no')[0].style.display = "inline";


        document.getElementsByClassName("loading")[0].style.display = "block";
        // document.getElementsByClassName("tab")[0].style.display = "block";

        localStorage.setItem("currentCardsNum","0");
        for(let i = 0; i < 3; i++){
            document.getElementsByClassName("navitem_not_shown")[i].style.display = "block";
        }
        if (localStorage.getItem("currentTab")==="detailed_article"){
            for(let i = 0; i < 3; i++){
                document.getElementsByClassName("navitem_not_shown")[i].style.display = "block";
            }
        }
        localStorage.setItem("currentTab","world");
        document.getElementsByClassName("tab")[0].style.display = "block";

        // axios.get(`http://ec2-54-146-190-253.compute-1.amazonaws.com:5000/world`)
        axios.get('http://ec2-54-146-190-253.compute-1.amazonaws.com:5000/world?source='+localStorage.getItem('source'))
        .then(res => {
            const dataFromServer = res.data;
            this.setState({ cards: dataFromServer });

          if(res.status === 200){
            console.log("World 请求已完成");
            document.getElementsByClassName("loading")[0].style.display = "none";
          }
        })
        .catch(error => {
            this.setState({err:error.message})
        })
        };

    render() {
        return (
            <div className="tab">
                <Cards cards = {this.state.cards} />
            </div>
        )
    }
}
    
export default World
