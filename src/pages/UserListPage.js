import React, { Component } from 'react';
import UserList from '../components/UserList';
import SearchBar from '../components/SearchBar';
import RangeSlider from '../components/RangeSlider';
import copy from '../copy';
class UserListPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
          searchKey: '',
          min: 0,
          max: 30,
          users: [],
          total: 0,
          page: 1,
          mapView:false
        };
    }
    componentDidMount() {
      this.findUsers();
    }
  searchKeyChangeHandler(searchKey) {
    console.log(searchKey);
        this.setState({searchKey: searchKey, page: 1}, this.findUsers);
    }

    rangeChangeHandler(values) {
        this.setState({min: values[0], max: values[1], page: 1}, this.findUsers);
    }

    findUsers() {
        this.props.getUsers({search: this.state.searchKey, min: this.state.min, max: this.state.max, page: this.state.page})
    }

    nextPageHandler() {
        let p = this.state.page + 1;
        this.setState({page: p}, this.findUsers);
    }

    prevPageHandler() {
        let p = this.state.page - 1;
        this.setState({page: p}, this.findUsers);
    }

    openMap = () => {
      this.setState({
        mapView: true
      });
    }
    closeMap = () => {
      this.setState({
        mapView: false
      });
    }



  render() {
    const {users} = this.props;
    const lang = this.props.settings.languagePref;
    return(
      <div>
        <section className="section">
          <div className='columns'>

            <div className='column'>
              <SearchBar
                searchKey={this.state.searchKey}
                onChange={this.searchKeyChangeHandler.bind(this)}
                placeholder={copy['search-for-user'][lang]}
              />
            </div>


          </div>
        </section>

        <section className='section'>
          <UserList
            users={users.data}
            loading={this.props.users.loading}
            total={users.data.count}
          />
        </section>
      </div>
    )
  }
}

export default UserListPage;
