import React, { Component } from 'react';
import moment from 'moment';
// import 'moment/locale/fr';
import UserLink from '../../UserLink';
import OptionsMenu from '../../OptionsMenu';
class EditableComment extends Component {
  constructor(props){
    super(props);
    this.state = {
      isEditing: false,
      editedText: null
    }
  }
  componentWillReceiveProps(nextProps){
    this.setState({
      editedText: this.props.comment.text
    });
    // moment.locale(nextProps.lang);
  }
  startEdit = () => {
    this.setState({
      isEditing: true,
      editedText: this.props.comment.content
    });
  }
  cancelEdit = () => {
    this.setState({
      isEditing: false,
      editedText: this.props.comment.text
    });
  }
  saveEdit = () => {
    this.setState({
      isEditing: false
    });
    this.props.submitEdit(this.state.editedText);
  }
  onChangeText = (e) => {
    this.setState({
      editedText: e.target.value
    });
  }
  handleDelete = () => {
    var comment = this.props.comment;
    this.props.onDelete(comment.id, comment.work_id);
  }
  render() {
    const {comment, auth, authUser } = this.props;
    console.log('up comment: ', comment);
    // moment().locale(this.props.lang);
    var date = moment(new Date(comment.createdAt)).calendar()
    if (this.state.isEditing == true) {
      return (
        <div>
          <input type='text' value={this.state.editedText} onChange={this.onChangeText} className='input'/>
          <button className='button' onClick={this.saveEdit}>{this.props.saveEditCopy}</button>
          <button className='button' onClick={this.cancelEdit}>{this.props.cancelEditCopy}</button>
        </div>)
    } else {
    return(
      <div>
        <div className='columns'>
          <div className='column is-narrow'>
          <UserLink user_id={comment.UserId} username={comment.User && comment.User.username} />
          <small> {date}</small>:
          <div>{comment.content}</div>
          </div>
          { authUser && (authUser.id == comment.UserId) ?  (
              <div className='column ' style={{float: 'right'}}>
                <OptionsMenu
                  onEdit={this.startEdit}
                  onDelete={this.handleDelete}
                />
              </div>
            ) : ''}
        </div>
      </div>
    )
    }
  }
}

export default EditableComment;
