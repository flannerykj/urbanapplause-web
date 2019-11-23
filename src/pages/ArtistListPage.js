import React, { Component } from 'react';
import ArtistList from '../components/ArtistList';
import SearchBar from '../components/SearchBar';
import RangeSlider from '../components/RangeSlider';
import {Route, Switch} from 'react-router-dom';
import copy from '../copy';

class ArtistListPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchKey: "",
            min: 0,
            max: 30,
            artists: [],
            total: 0,
            page: 1
        }
    }
  componentDidMount() {
      this.findArtists();
    }
    searchKeyChangeHandler(searchKey) {
        this.setState({searchKey: searchKey, page: 1}, this.findArtists);
    }

    rangeChangeHandler(values) {
        this.setState({min: values[0], max: values[1], page: 1}, this.findArtists);
    }

  findArtists() {
        this.props.getArtists({search: this.state.searchKey, min: this.state.min, max: this.state.max, page: this.state.page})
    }

    nextPageHandler() {
        let p = this.state.page + 1;
        this.setState({page: p}, this.findArtists);
    }

    prevPageHandler() {
        let p = this.state.page - 1;
        this.setState({page: p}, this.findArtists);
    }


  render() {
    const { artists } = this.props;
    console.log('artists: ', artists);
    const lang = this.props.settings.languagePref;
    return(
      <div>
            <div>
              <section className="section">
                <div className='columns'>
                  <div className='column'>

                <SearchBar searchKey={this.state.searchKey} onChange={this.searchKeyChangeHandler.bind(this)} placeholder={copy['search-for-artist'][lang]}/>
              </div>
      <div className='column is-narrow'>
              <a className='button is-primary' href='/artists/new'>+ {copy['add-new-artist'][lang]}</a>
            </div>
          </div>
              </section>
              <section>
                <ArtistList
                  artists={artists.data}
                  loading={artists.loading}
                  total={artists.total}
                  hasreceiveddata={artists.hasreceiveddata}
                />
              </section>
            </div>
      </div>
    )
  }
}

export default ArtistListPage;
