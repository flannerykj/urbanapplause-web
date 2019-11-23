// @flow

import React, { Component } from 'react';
import copy from '../copy';

type Props = {
  label: ?string,
  children: ?any,
  value: ?string,
  emptyText: string
}
class InfoField extends Component<Props> {
  static defaultProps = {
    value: null,
    emptyText: 'None provided',
    children: null
  }
  render() {
    const { label, value, children, emptyText }  = this.props;
    return(
      <div>
        {label && <label className='label'>{label}</label>}
        {value && <p>{value}</p>}
        {children && <p>{children}</p>}
        {!children && !value &&<p> <i>{emptyText}</i></p>}
        <br />
      </div>
      )
  }
}

export default InfoField;

