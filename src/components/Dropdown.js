import React, { Component } from 'react';

class Dropdown extends Component {
  constructor(props){
    super(props);
    this.state = {
      isActive: false
    }
  }
  toggleDropdown = () => {
    this.setState({
      isActive: !this.state.isActive
    });
  }
  handleClickOutside= (e) => {
    console.log(this.refs.dropdown.contains(e.target));
    if (this.refs.dropdown.contains(e.target)==false) {
      console.log('true');
      this.closeDropdown();
        }
  }
  closeDropdown = () => {
    this.setState({
      isActive: false
    });
  }
  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  render() {
    return(
      <div className={`dropdown ${this.state.isActive==true ? 'is-active' : ''}`} ref="dropdown" style={styles.dropdown}>

        <div className="dropdown-trigger">
          <button className="button" aria-haspopup="true" aria-controls="dropdown-menu" onClick={this.toggleDropdown}>
          {this.props.activeOption }
            &#9660;
          </button>
        </div>
        <div className="dropdown-menu" id="dropdown-menu" role="menu">
          <div className="dropdown-content" onClick={this.closeDropdown}>
            {this.props.options.map((option, i) => (
              <a
                name={[option]}
                onClick={this.props.onSelect}
                className="dropdown-item"
                key={i}>
                {option}
              </a>
            ))}
          </div>
        </div>
      </div>
    )
  }
}

const styles = {
  dropdown: {
    textAlign: 'left'
  }
}

export default Dropdown;
