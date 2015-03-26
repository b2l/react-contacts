import React from 'react';
import request from 'superagent';
import App from './components/app';
import Immutable from 'immutable';
import Actions from './contacts_actions';

const CONTACTS_URL = "https://react-learning-lunch-backend.herokuapp.com/contacts";

class AppContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      contacts: Immutable.List(),
      liveUpdate: false
    };

    Actions.saveContact.listen(this.saveContact.bind(this));
    Actions.toggleLiveUpdate.listen(this.onToggleLiveUpdate.bind(this));
  }

  onToggleLiveUpdate() {
    this.setState({liveUpdate: !this.state.liveUpdate})
    if (this.state.liveUpdate)
      this.interval = setInterval(this.fetchContacts.bind(this), 1000);
    else
      clearInterval(this.interval);
  }

  saveContact(contact) {
    let req;
    let contacts;
    if (contact.id) {
      req = request.put(`${CONTACTS_URL}/${contact.id}`);
      contacts = this.state.contacts.mergeDeep([contact]);
    } else {
      req = request.post(`${CONTACTS_URL}`);
      contacts = this.state.contacts.push(contact)
    }

    this.setState({contacts});
    req.send(contact)
      .set('Content-Type', 'application/json')
      .end( (err, res) => {
      });
  }

  fetchContacts() {
    request.get(CONTACTS_URL)
      .set('Content-Type', 'application/json')
      .end( (err, res) => {
        if (!res.ok)
          return this.setState({error: "Unable to fetch contacts"});

        let contacts = this.state.contacts.mergeDeep(res.body)
        if (contacts !== this.state.contacts)
          this.setState({contacts});
      });
  }

  componentWillMount() {
    if (this.state.liveUpdate)
      this.interval = setInterval(this.fetchContacts.bind(this), 1000);
    else
      this.fetchContacts();
  }

  componentWillUnmount() {
    if (this.interval)
      clearInterval(this.interval);
  }

  render() {
    return (
      <App contacts={this.state.contacts.toJS()} />
    );
  }
}

let mountNode = document.getElementById('app-container');
React.render(<AppContainer />, mountNode);
