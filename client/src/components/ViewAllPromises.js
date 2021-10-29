import React, { Component } from 'react';

class ViewAllPromises extends Component {
	render() {
		return <div>{this.props.promisesList.length}</div>
	}
}

export default ViewAllPromises;