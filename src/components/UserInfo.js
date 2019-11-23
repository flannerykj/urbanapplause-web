// @flow
import React, { Component } from 'react';
import {getMonthName} from '../services/utils';
import copy from '../copy';
import moment from 'moment';
// import 'moment/locale/fr';
import InfoField from './InfoField';
import type { User } from '../types/user';

type Props = {
  user: {
    data: ?User,
    error: ?string,
    loading: boolean
  },
  lang: string
}
type State = {
}
class UserInfo extends Component<Props, State> {

  constructor(props: Props){
    super(props);

  }
  componentWillReceiveProps(nextProps: Props){
    if (nextProps.user.data != this.props.user.data) {
      this.forceUpdate();
    }
    // moment().locale(this.props.lang);
  }

  render() {
    const lang = this.props.lang;
    const user = this.props.user.data;
    if (this.props.user.loading) {
      return (<span>Loading</span>);
    }
    if (this.props.user.error) {
      return <p className='is-danger'>{this.props.user.error}</p>
    }
    if (user) {
      const date_joined = this.props.user.data ? moment(user.createdAt) : null;
      return(
        <div>
          <InfoField
            label={copy['username'][lang]}
            value={user.username}
          />

          {date_joined && <InfoField
            label={copy['member-since'][lang]}
            value={date_joined.format('YYYY/MM/DD')}
          />}

          <InfoField
            label={copy['bio'][lang]}
            value={user.bio}
            emptyText={copy.none_provided[lang]}
          />
        </div>
      )
    }
    return <p>Something went wrong</p>
  }
}

export default UserInfo;
