import React from 'react';
import CardItem from './CardItem';

class Cards extends React.Component{
    render(){
        // console.log("receive props from home：cards in Cards Component");
        // console.log(this.props.cards);
        return (
        this.props.cards.map( (card) => {
            return <CardItem key={card.id} card={card} />
            })
        )
        
    }
}

export default Cards;
