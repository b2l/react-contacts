import React from 'react';

const DEFAULT_PICTURE = "https://lh3.googleusercontent.com/-cbtokiUUtbw/AAAAAAAAAAI/AAAAAAAAAAA/-fh0xkqQ9A4/s360-c-k-no/photo.jpg"

class ContactShow extends React.Component {
  constructor(props) {
    super(props);
 }

  render() {
    let contact = this.props.contact;
    let pictureUrl = contact.picture ? contact.picture : DEFAULT_PICTURE;
    let emails = contact.emails.map( mail => <li>{mail}</li> );

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
              <button className="action-button" onClick={this.props.onEdit}>Edit</button>
            </h3>

            <div className="modal-content-section-item">
              {contact.firstname} {contact.lastname}
            </div>

            <ul className="modal-content-section-item">
              {emails}
            </ul>
          </section>
        </div>
      </div>
    );
  }
};

ContactShow.propTypes = {
  contact: React.PropTypes.object.isRequired,
  onEdit: React.PropTypes.func.isRequired
};

export default ContactShow;
