import React from 'react';
import Actions from '../contacts_actions';
import CloudinaryUploadField from './cloudinary_upload_field';

const DEFAULT_PICTURE = "https://lh3.googleusercontent.com/-cbtokiUUtbw/AAAAAAAAAAI/AAAAAAAAAAA/-fh0xkqQ9A4/s360-c-k-no/photo.jpg"

class ContactEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      picture: this.props.contact.picture,
      name: this.props.contact.name,
      emails: this.props.contact.emails || []
    }
  }

  save() {
    let fullname = React.findDOMNode(this.refs.name).value;
    this.props.contact.firstname = fullname.split(' ')[0];
    this.props.contact.lastname = fullname.split(' ')[1];
    this.props.contact.picture = this.state.picture;
    this.props.contact.emails = this.state.emails;
    Actions.saveContact(this.props.contact);
    this.props.onDone();
  }

  onPictureUploaded(payload) {
    this.setState({picture: payload.url});
  }

  onMailChange(index, newValue) {
    let emails = this.state.emails;
    emails[index] = newValue;
    this.setState({emails});
  }

  addEmail(e) {
    e.preventDefault();
    this.props.contact.emails |= [];
    let emailField = React.findDOMNode(this.refs.newEmail);
    let emails = this.state.emails;
    emails.push(emailField.value)
    this.setState({emails});
    emailField.value = '';
  }

  removePicture() {
    this.setState({picture: null});
  }

  render() {
    let contact = this.props.contact;
    let fullname = `${contact.firstname} ${contact.lastname}`;
    let pictureUrl = this.state.picture || DEFAULT_PICTURE;
    let pictureLabel =  this.state.picture ? <img width="100" src={pictureUrl} /> : "Add photo";
    let mails = this.renderEmails();

    return (
      <div className="modal">
        <aside className="modal-aside">
          <img className="contact-picture" src={pictureUrl} alt={"${contact.firstname} picture"} />
          <h3>
            {contact.firstname} {contact.lastname}
          </h3>
        </aside>
        <div className="modal-content">
          <section className="modal-content-section">
            <h3>
              Contact information
              <button className="action-button" onClick={this.props.onDone}>Cancel</button>
              <button className="action-button" onClick={this.save.bind(this)}>Save</button>
            </h3>

            <div className="modal-content-section-item">
              <div className="form-group">
                <label htmlFor="name-field">Name</label>
                <input type="text" ref="name" id="name-field" defaultValue={fullname} />
              </div>
              <div className="form-group">
                <CloudinaryUploadField
                  name="picture"
                  onUpload={this.onPictureUploaded.bind(this)}
                >
                  {pictureLabel}
                </CloudinaryUploadField>
                <button className="pull-right" onClick={this.removePicture.bind(this)}>X</button>
              </div>
              {mails}
            </div>
          </section>
        </div>
      </div>
    );
  }

  renderEmails() {
    let emails = this.state.emails.map((mail, index) => {
      let onMailChange = (e) => {
        this.onMailChange(index, e.target.value);
      }
      let removeEmail = (e) => {
        let emails = this.state.emails;
        emails.splice(index, 1);
        this.setState({emails});
      }
      return <div className="form-group">
          <label htmlFor={`email-${index}`}>Email</label>
          <input type="text" onChange={onMailChange.bind(this)} defaultValue={mail}/>
          <button className="pull-right" onClick={removeEmail.bind(this)}>X</button>
        </div>
    });

    return (
      <div>
        {emails}
        <form onSubmit={this.addEmail.bind(this)}>
          <div className="form-group">
            <label htmlFor="new-email"></label>
            <input type="text" ref="newEmail" />
            <input type="submit" value="+" />
          </div>
        </form>
      </div>
    );
  }
};

ContactEditor.propTypes = {
  contact: React.PropTypes.object.isRequired,
  onDone: React.PropTypes.func.isRequired
}

export default ContactEditor;
