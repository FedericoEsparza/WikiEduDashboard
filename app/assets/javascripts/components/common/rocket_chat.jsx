import React from 'react';
import ChatActions from '../../actions/chat_actions.js';
import ChatStore from '../../stores/chat_store.js';

const RocketChat = React.createClass({
  displayName: 'RocketChat',

  mixins: [ChatStore.mixin],

  getInitialState() {
    return {
      showChat: false,
      channel: '11200', // TODO: Get the course id, which is used as the channel name.
      authToken: ChatStore.getAuthToken()
    };
  },

  componentWillMount() {
    if (!this.state.authToken) {
      ChatActions.requestAuthToken();
    }
  },

  storeDidChange() {
    this.setState({
      authToken: ChatStore.getAuthToken(),
      showChat: true
    });
  },

  login() {
    // this.setState({ showChat: true });

    // TODO:
    // If possible, start by checking if the user is already logged in to RocketChat.
    // If not, proceed with login flow.
    // First, request auth token from dashboard server

    // On success, use that token to log in:
    document.querySelector('iframe').contentWindow.postMessage({
      externalCommand: 'login-with-token',
      token: this.state.authToken
    }, '*');
    // Verify login success
    this.setState({ loggedIn: true });
  },

  render() {
    let chatFrame;
    // TODO: Hide chat until login succeeds.
    if (this.state.showChat) {
      const chatUrl = `https://dashboardchat.wmflabs.org/channel/${this.state.channel}?layout=embedded`;
      chatFrame = <iframe id="chat" style={{ display: 'block', width: '100%', height: '1000px' }} src={chatUrl} />;
    }

    return (
      <div className="modal">
        <button className="button dark" onClick={this.login} >Login!</button>
        {chatFrame}
      </div>
    );
  }
});

export default RocketChat;
