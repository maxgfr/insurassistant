import React, { Component } from 'react';
import shave from 'shave';

import './ConversationListItem.css';

export default class ConversationListItem extends Component {

  componentDidMount() {
    shave('.conversation-snippet', 20);
  }

  render() {
    const { name, name_simple } = this.props.data;

    return (
      <div className="conversation-list-item" onClick={this.props.onClickItem}>
        <img className="conversation-photo" src={'https://robohash.org/'+name+'.png'} alt="conversation" />
        <h1 className="conversation-title">{ name_simple } {this.props.actif ? '(ACTIF)' : '(EN ATTENTE)'}</h1>
      </div>
    );
  }
}
