import React from "react";
import {withRouter} from 'react-router-dom';


class Blank extends React.Component{

    componentDidMount = () => {
        this.props.history.push('/favorites');    
    }

    render() {
        return null;
    }
}

export default withRouter(Blank);