import React from 'react';
import ChatActions from '../../actions/chat_actions.js';
import ChatStore from '../../stores/chat_store.js';

const RocketChat = React.createClass({
  displayName: 'RocketChat',

  propTypes: {
    course: React.PropTypes.object,
    current_user: React.PropTypes.object
  },

  mixins: [ChatStore.mixin],

  getInitialState() {
    return {
      authToken: ChatStore.getAuthToken(),
      showChat: false
    };
  },

  componentWillMount() {
    if (Features.enableChat && !this.state.authToken) {
      ChatActions.requestAuthToken();
    }
  },

  storeDidChange() {
    this.setState({
      authToken: ChatStore.getAuthToken()
    });
    this.loginOnFrameLoad();
  },

  loginOnFrameLoad() {
    document.querySelector('iframe').onload = this.login;
  },

  login() {
    document.querySelector('iframe').contentWindow.postMessage({
      externalCommand: 'login-with-token',
      token: this.state.authToken
    }, '*');
    this.setState({ showChat: true });
  },

  render() {
    if (!(this.props.course && this.props.course.flags && this.props.course.flags.enable_chat)) {
      return <div />;
    }
    // Rocket.Chat appears to double-encode the channel name to produce the URI.
    const room = encodeURIComponent(encodeURIComponent(this.props.course.slug));
    const chatUrl = `https://dashboardchat.wmflabs.org/group/${room}?layout=embedded`;
    let chatClass = 'iframe';
    if (!this.state.showChat) {
      chatClass += ' hidden';
    }
    const chatFrame = <iframe id="chat" className={chatClass} src={chatUrl} />;

    return (
      <div className="rocket-chat">
        {chatFrame}
      </div>
    );
  }
});

export default RocketChat;
