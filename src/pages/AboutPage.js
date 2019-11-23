import React, { Component } from 'react';

class AboutPage extends Component {
  render() {
    return(
      <div>
        <h1 className='title is-1' id='top'>About</h1>
        <ol>
          <li><a href='#what-is'>What Is Urban Applause</a></li>
          <li><a href='#how-it-works'>How It Works</a></li>
          <li><a href='#technology-stack'>Technology Stack</a></li>
        </ol>
        <hr />
        <h2 id='what-is' className='subtitle is-2'>What Is Urban Applause</h2>
        <p>Urban Applause lets you track street artists. You can use it to find awesome art in your neighbourhood, or to track your favorite artists as they move between cities.
          <br/>
          <a href='#top'>Back to top<span className='icon is-medium'><i className='fa fa-arrow-up'/></span></a>
        </p>

        <h2 id='how-it-works' className='subtitle is-2'>How It Works</h2>
        <p>Anyone can upload to Urban Applause. Whether or not you know who the artist is, add photos of great street art you find here. If you do know the artist, you can create a new profile for them.
          <br/>
          <a href='#top'>Back to top<span className='icon is-medium'><i className='fa fa-arrow-up'/></span></a>
</p>

      <h2 id='technology-stack' className='subtitle is-2'>Technology Stack</h2>
         <ul>
           <li><a href='https://reactjs.org/'>ReactJS</a> (Javascript Framework)</li>
           <li><a href='https://redux.js.org/'>Redux</a> (Javascript State Manager)</li>
           <li><a href='https://bulma.io'>Bulma</a> (CSS Framework)</li>
           <li><a href='https://expressjs.com'>Express</a> (NodeJS Server)</li>
           <li><a href='https://jwt.io/'>JWT Web Tokens</a> (Authentication API)</li>
           <li><a href='https://www.postgresql.org/'>PostgreSQL</a> (Database)</li>
           <li><a href='https://www.digitalocean.com'>Digital Ocean</a> (Cloud Server)</li>
         </ul>
          <a href='#top'>Back to top<span className='icon is-medium'><i className='fa fa-arrow-up'/></span></a>
      </div>
    )
  }
}

export default AboutPage;
