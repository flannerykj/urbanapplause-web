import React from 'react';

class SearchBar extends React.Component {

    searchKeyChangeHandler(event) {
        let searchKey = event.target.value;
        this.setState({searchKey: searchKey});
        this.props.onChange(searchKey);
    }

  clearText = () => {
        this.setState({searchKey: ""});
        this.props.onChange("");
    }

    render() {
        return (
          <div className="field ">
            <div className='control is-expanded has-icons-left has-icons-right search-bar-field' >
              <input
                 className="input search-bar"
                 type="text"
                 placeholder={this.props.placeholder ||"Enter a work description or artist name"}
                 value={this.props.searchKey}
                 onChange={this.searchKeyChangeHandler.bind(this)}/>
              <span className="icon is-small is-left" >
                <i className="fa fa-search"/>
              </span>
              <span className="icon is-right clear" onClick={this.clearText} >
                <a className='delete' style={{cursor: 'pointer'}} onClick={this.clearText}  />
              </span>
            </div>
          </div>
        );
    }
};

export default SearchBar;

