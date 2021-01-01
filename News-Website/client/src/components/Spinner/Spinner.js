import React from "react";
import { css } from "@emotion/core";
import { BounceLoader } from "react-spinners";

// Can be a string as well. Need to ensure each key-value pair ends with ;
const override = css`
  display: block;
  margin: auto auto;
  border-color: blue;
`;

class Spinner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
  }

  render() {
    return (
      <div className="loading">
        <BounceLoader
          css={override}
          size={60}
          color={"#123abc"}
          loading={this.state.loading}
        />
        <p>Loading...</p>
      </div>
    );
  }
}

export default Spinner;