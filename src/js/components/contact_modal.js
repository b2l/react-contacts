import React from 'react';
import ContactEditor from './contact_editor';
import ContactInfo from './contact_info';


class ContactModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editing: false
    };

    this.onEsc = this.onEsc.bind(this);
  }

  edit() {
    this.setState({editing: true});
  }

  cancelEdit() {
    this.setState({editing: false});
  }

  close() {
    this.props.onClose();
  }

  onEsc(e) {
    if (e.keyCode === 27)
      this.close();
  }

  componentWillMount() {
    document.addEventListener('keydown', this.onEsc);
    document.body.classList.add('overlay');
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.onEsc);
    document.body.classList.remove('overlay');
  }

  render() {
    let contact = this.props.contact;
    if (this.state.editing)
      return <ContactEditor contact={contact} onDone={this.cancelEdit.bind(this)}/>
    else
      return <ContactInfo contact={contact} onEdit={this.edit.bind(this)} />
  }
};

ContactModal.propTypes = {
  contact: React.PropTypes.object.isRequired
};

export default ContactModal;
