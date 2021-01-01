import React from "react";
import _ from "lodash";
import AsyncSelect from 'react-select/async';
import { withRouter } from 'react-router-dom';


class Select extends React.Component {
  state = {
    inputValue: '',
    results: [],
    selectedResult: ''
  }

  handleSearchChange = async (event) => {
    var value = this.state.inputValue;

    try {
      // https://siqidu.cognitiveservices.azure.com/bing/v7.0/suggestions?q key:b05390fd41ef469b9489d857cb87297c
      const response = await fetch(
        `https://api.bing.microsoft.com/v7.0/Suggestions?q=` + value,
        {
          headers: {
            "Ocp-Apim-Subscription-Key": "775886a0c92a44c996051a3d62e3374b"
          }
        }
      );
      const data = await response.json();
      const resultsRaw = data.suggestionGroups[0].searchSuggestions;
      const results = resultsRaw.map(result => ({ value: result.displayText, label: result.displayText }));
      this.setState({ results: results });
      return this.state.results;
    } catch (error) {
      console.error(`Error fetching search ${value}`);
    }
  };

  handleInputChange = (newValue) => {
    this.setState({ inputValue: newValue });
  }

  getSearchResult = (option) => {
    let value = option['value'];
    this.setState({ selectedResult: option })
    localStorage.setItem("searchQuery", value);
    this.props.history.push('/search/' + value);
  }
  clearValues = () => {
    this.setState({ selectedResult: '' });
  }

  render() {
    return (
      <AsyncSelect className="select"
        placeholder="Enter Keyword..."
        cacheOptions
        loadOptions={_.debounce(this.handleSearchChange, 1000, { leading: true })}
        defaultOptions
        onInputChange={this.handleInputChange}
        onChange={this.getSearchResult}
        value={this.state.selectedResult}
        onBlur={this.clearValues} />
    )
  }
}

export default withRouter(Select);
