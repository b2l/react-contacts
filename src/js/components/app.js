import React from 'react';
import cn from 'classnames';
import Actions from '../contacts_actions'
import ContactEditor from './contact_modal';

const ESC = 27;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeContact: null,
      addContact: false
    }
    this.escListener = this.escListener.bind(this);
  }

  addContact() {
    this.setState({addContact: true});
    document.addEventListener('keydown', this.escListener);
  }

  cancelAddContact() {
    this.setState({addContact: false});
    document.removeEventListener('keydown', this.escListener);
  }

  escListener(e) {
    if (e.keyCode === ESC)
      this.cancelAddContact();
  }

  onSaveNewContact(e) {
    e.preventDefault();
    let name = React.findDOMNode(this.refs.fullname).value;
    Actions.saveContact({
      firstname: name.split(' ')[0],
      lastname: name.split(' ')[1]
    });
    this.setState({addContact: false});
  }

  editContact(contact) {
    this.setState({activeContact: contact});
  }

  cancelEdit() {
    this.setState({activeContact: null});
  }

  render() {
    let contacts = this.renderContacts();
    let addContact = this.renderAddContact();
    let editContact = this.renderContactEditor();
    let addContactHandler = this.addContact.bind(this)

    return (
      <div>
        <header className="header">
          <button
            className="action-button pull-right"
            onClick={Actions.toggleLiveUpdate}>Toggle live update</button>
          <h1>Welcome to this React learning lunch</h1>
        </header>
        <div className="sidebar">
        </div>
        <div className="main-pane">
          <div className="contact-list-caption">
            Contacts
            <button className="action-button" onClick={addContactHandler}>
              Add
            </button>
          </div>
          <ul className="contact-list">
            {contacts}
          </ul>
        </div>
        {addContact}
        {editContact}
      </div>
    );
  }

  renderContacts() {
    let contacts = this.props.contacts.map((contact, index) => {
      let onClickHandler = this.editContact.bind(this, contact);
      return <li className="contact-item">
        <span className="contact-item-name" onClick={onClickHandler}>
          {contact.firstname} {contact.lastname}
        </span>
        <span className="contact-item-mail">
          {contact.emails? contact.emails[0] : ''}
        </span>
      </li>
    });
    return (
      {contacts}
    );
  }

  renderContactEditor() {
    let contact = this.state.activeContact;
    if (!contact)
      return '';

    return (
      <ContactEditor contact={contact} onClose={this.cancelEdit.bind(this)}/>
    );
  }

  renderAddContact() {
    if (!this.state.addContact)
      return ''

    return (
      <div className="modal">
        <form onSubmit={this.onSaveNewContact.bind(this)}>
          <div className="form-group">
            <input type="text" placeholder="Enter a name" ref="fullname" />
          </div>
          <footer>
            <button onClick={this.cancelAddContact.bind(this)}>Cancel</button>
            <input type="submit" value="Save" />
          </footer>
        </form>
      </div>
    );
  }
};

App.propTypes = {
  contacts: React.PropTypes.array.isRequired
};

export default App;
