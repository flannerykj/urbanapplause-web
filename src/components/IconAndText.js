// @flow
import React, { Component } from 'react';

type Props = {
  number: number,
  iconName: ?string,
  iconSrc: ?string,
  iconClassName: string,
  onClick: () => void,
  iconWidth: number
}

type State = {
}

class IconAndText extends Component<Props> {
  static defaultProps = {
    iconName: null,
    iconSrc: null,
    iconWidth: 23,
    iconClassName: ''
  };
  render() {
    return (
      <a
        className='icon-and-text'
        onClick={this.props.onClick}>
        <div style={{ marginRight: '16px', display: 'flex', flexDirection: 'row' }}>
          <div className='icon' style={{ marginRight: '5px' }} >
            {this.props.iconName && <i className={`${this.props.iconName} ${this.props.iconClassName}`}/>}
            {this.props.iconSrc &&
            <img className={this.props.iconClassName} src={this.props.iconSrc} />
  }
          </div>
          <div>{this.props.number}</div>
        </div>
      </a>
    )
  }
}

export default IconAndText;
