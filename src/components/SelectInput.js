// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export type SelectionMode = 'unknown' | 'select' | 'create';

type SearchableOption = {
  name: string,
  id: number
}

type Props = {
  createNewText: string,
  placeholder: ?string,
  selectedOption: ?SearchableOption,
  options: SearchableOption[],
  onChangeQuery: (string) => void,
  onSelectCreateNew: () => void
}

type State = {
  query: string,
  highlightedOptionIndex: number,
  isCreatingNew: boolean
}
class SelectInput extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      query: '',
      highlightedOptionIndex: 0,
      matchList: [],
      isCreatingNew: false
    }
  }
  activeElement: any

  shouldShowMatches = () => {
    if (
      this.state.query.length>0 &&
      !this.state.isCreatingNew &&
      this.activeElement==this.refs.input_box.focused
    ) {
      return true
    } else {
      return false;
    }
  }
  onInputChange = (e) => {
    this.props.onChangeQuery(e.target.value);
    this.setState({
      query: e.target.value
    });
  }

  setCreatingNew = () => {
    this.refs.input_box.focus();
    this.props.onChangeSelectionMode('create');
    this.setState({
      isCreatingNew: true
    });
  }

  onKeyDown = (e) => {
    const { options } = this.props;
    const { highlightedOptionIndex } = this.state;
    if (e.keyCode == 13) {
      e.preventDefault();
      if(highlightedOptionIndex == options.length) {
        this.setCreatingNew();
      } else {
        this.onSelectOption(options[highlightedOptionIndex], highlightedOptionIndex);
      }
    }
    if (e.keyCode == 40) { //down key pressed
      console.log('down key pressed ', highlightedOptionIndex);
      if(highlightedOptionIndex < this.props.options.length) {
        this.setState({
          highlightedOptionIndex: this.state.highlightedOptionIndex + 1});
      }
    }
    if (e.keyCode == 38) {
      if (highlightedOptionIndex > 0) {
        this.setState({
          highlightedOptionIndex: highlightedOptionIndex- 1
        })
      }
    }
  }
  onSelectOption = (option: SearchableOption, index: number) => {
    this.props.onSelectOption(option);
  }

  render() {
    const options = this.props.options;
    const showMatches = this.shouldShowMatches();
    return(
       <div className={showMatches==true?"dropdown is-active select-input":"dropdown select-input"} style={{width: '100%'}}>
          <div className='control' style={{width: '100%'}}>
            <div className="dropdown-trigger select-input">
              <input
                  className={`input`}
                  type='text'
                  ref='input_box'
                  value={this.state.query}
                  onChange={this.onInputChange}
                  onKeyDown={this.onKeyDown}
                  placeholder={this.props.placeholder}
                />
              </div>
            </div>
            <div className='dropdown-menu'>
              <div className='dropdown-content'>
                {options.map((option, index) =>
                  <Link
                    key={index}
                    className={(this.state.highlightedOptionIndex==index)?'dropdown-item is-active':'dropdown-item'}
                    onClick={(e) => this.onSelectOption(option, index)}>
                      {options[index].name}
                  </Link>
                )}
                <hr className="dropdown-divider"/>

                <a className={(this.state.highlightedOptionIndex === options.length)?'dropdown-item is-active':'dropdown-item'} onClick={this.props.onSelectCreateNew}>
                  {this.props.createNewText}
                </a>
              </div>
            </div>
        </div>
    )
  }
}

export default SelectInput;
