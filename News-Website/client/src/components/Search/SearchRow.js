import React from 'react';
import SearchCardItem from './SearchCardItem';


class SearchRow extends React.Component {
    render() {

        return (
            <div className="row">
                {
                    this.props.row.map(
                        (card) => {
                            return <SearchCardItem key={card.id} card={card} />
                        }
                    )
                }
            </div>
        )
    }
}

export default SearchRow;
