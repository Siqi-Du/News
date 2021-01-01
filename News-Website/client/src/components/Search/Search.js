import React from 'react';
import axios from 'axios';
import SearchRow from './SearchRow';

class Search extends React.Component {

  state = {
    cards: [],
    err: '',
    row: 0

  };

  componentWillReceiveProps(nextProps) {
    let q = nextProps.match.params.q;
    console.log("in search", window.location.href);
    // console.log(document.getElementsByClassName("w")[0].setAttribute("value",q));

    document.getElementsByClassName("loading")[0].style.display = "block";
    document.getElementsByClassName("search")[0].style.display = "none";

    //ec2-54-146-190-253.compute-1.amazonaws.com:5000
    axios.get('http://ec2-54-146-190-253.compute-1.amazonaws.com:5000/search?q=' + q)
      .then(res => {
        const dataFromServer = res.data;

        if (res.status === 200) {
          console.log(dataFromServer);
          // console.log("search request done");
          document.getElementsByClassName("loading")[0].style.display = "none";
          document.getElementsByClassName("search")[0].style.display = "block";

          if (dataFromServer.length === 0) {
            console.log("no data");
            document.getElementsByClassName("search_text")[0].innerHTML = "No results found";
          }
        }
        this.setState({ cards: dataFromServer });
      })
      .catch(error => {
        this.setState({ err: error.message })
      })
  }

  componentDidMount = () => {

    console.log("mount search componnet");

    document.getElementsByClassName("home")[0].setAttribute("class", "nav-link home");
    document.getElementsByClassName("world")[0].setAttribute("class", " nav-link world");
    document.getElementsByClassName("business")[0].setAttribute("class", " nav-link business");
    document.getElementsByClassName("technology")[0].setAttribute("class", " nav-link technology");
    document.getElementsByClassName("sports")[0].setAttribute("class", " nav-link sports");
    document.getElementsByClassName("politics")[0].setAttribute("class", " nav-link politics");

    document.getElementsByClassName("loading")[0].style.display = "block";
    document.getElementsByClassName("search")[0].style.display = "none";
    document.getElementsByClassName('bookmark_yes')[0].style.display = "none";
    document.getElementsByClassName('bookmark_no')[0].style.display = "inline";

    localStorage.setItem("currentTab", "search");

    for (let i = 0; i < 3; i++) {
      document.getElementsByClassName("navitem_not_shown")[i].style.display = "none";
    }

    let searchQuery = localStorage.getItem("searchQuery");
    console.log("request:" + searchQuery + " will send request to server in search tab");

    // axios.get(`http://ec2-54-146-190-253.compute-1.amazonaws.com:5000/`)
    axios.get('http://ec2-54-146-190-253.compute-1.amazonaws.com:5000/search?q=' + searchQuery)
      .then(res => {
        const dataFromServer = res.data;
        if (res.status === 200) {
          console.log("search请求已完成");
          document.getElementsByClassName("loading")[0].style.display = "none";
          document.getElementsByClassName("search")[0].style.display = "block";
          if (dataFromServer.length === 0) {
            console.log("no data");
            document.getElementsByClassName("search_text")[0].innerHTML = "No results found";
          }

          console.log(searchQuery);


        }
        this.setState({ cards: dataFromServer });
      })
      .catch(error => {
        this.setState({ err: error.message })
      })
  }


  render() {
    return (
      <div className="search">

        <div className="container-fluid">
          <h3 className="left search_text">Results</h3>
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

export default Search;
