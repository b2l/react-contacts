import React from 'react';
import CN from 'classnames';

const PRESET = "contacts";
const CLOUD_NAME = "react-learning-lunch";

class CloudinaryUploadField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {uploading: false};
  }

  componentDidMount() {
    this.$input = $(React.findDOMNode(this.refs.picture));
    this.$input.unsigned_cloudinary_upload(PRESET, {cloud_name: CLOUD_NAME});
    this.$input.on('fileuploadsend', this.onUploadStart.bind(this));
    this.$input.on('cloudinarydone', this.onUploadDone.bind(this));
  }

  componentWillUnmount() {
    this.$input.unsigned_cloudinary_upload('destroy');
    this.$input.off();
    this.$input = null;
  }

  onUploadDone(e, data) {
    console.log('upload done');
    this.props.onUpload(data.result);
    this.setState({uploading: false});
  }

  onUploadStart() {
    console.log('upload start');
    this.setState({uploading: true});
  }

  render() {
    let label = this.props.children || "Upload"
    let inputProps = {
      type: 'file',
      ref: 'picture',
      id: 'picture-field',
      name: 'file',
    }

    return (
      <div className="uploader">
        <input {...inputProps} />
        {this.state.uploading?
          <span className="spinner"></span>
          :
          <label
            htmlFor="picture-field"
            className="placeholder">
            {label}
          </label>}
      </div>
    );
  }
}

CloudinaryUploadField.propTypes = {
  onUpload: React.PropTypes.func.isRequired,
  name: React.PropTypes.string
};

export default CloudinaryUploadField;
