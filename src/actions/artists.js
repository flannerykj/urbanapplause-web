import C from '../constants';
let baseURL = C.SERVER_URL;

function requestArtists(values) {
  return {
    type: 'GET_ARTISTS_REQUEST',
  }
}

function receiveArtists(data) {
  console.log('data: ', data);
  return {
    type: 'GET_ARTISTS_SUCCESS',
    artists: data.artists,
    page: data.page,
    pageSize: data.pageSize,
    total: data.total,
    receivedAt: Date.now()
  }
}

function getArtistPosts(artistId: number) {
  return function(dispatch: Dispatch, getState: GetState) {
    dispatch({ type: 'GET_ARTIST_POSTS_REQUEST' });
    const qs = `?ArtistId=${artistId}`;
    const opts = {
      headers: {
        'Content-Type': 'application/json'
      }
    }
    return fetch(baseURL + "/api/posts" + qs, opts)
      .then((res) => {
        return res.json()
      })
      .then((json) => {
        if (json.posts) {
          return dispatch({ type: 'GET_ARTIST_POSTS_SUCCESS', posts: json.posts})
        }
      })
      .catch((error) => {
        dispatch({
          type: 'GET_ARTIST_POSTS_ERROR',
          error
        })
      });
  }
}
function getArtists(values) {
  return function(dispatch){
    dispatch(requestArtists(values));
    let qs = "";
    if (values) {
        qs = Object.keys(values).map(key => {
            return encodeURIComponent(key) + '=' + encodeURIComponent(values[key]);
        }).join('&');
        qs = "?" + qs;
    }
    return fetch(baseURL + "/api/artists" + qs)
      .then(res => res.json())
      .then(data => {
        return dispatch(receiveArtists(data))
      })
      .catch((error) => {
        return dispatch({type: 'GET_ARTISTS_ERROR', error })
      });
  }
}

function submitNewArtist(values) {
  console.log('values: ', values);
  return function(dispatch, getState){
    dispatch({type: C.AWAIT_NEW_ARTIST_RESPONSE});
    return fetch(baseURL + "/api/artists", {method: "POST", body: JSON.stringify({ artist: values }), headers: {'Content-Type': 'application/json'}})
      .then(res => res.json())
      .then((json) => {
          dispatch({type:C.RECEIVE_NEW_ARTIST_RESPONSE, data: json.data});
          dispatch(getArtists());
      })
      .catch((error) => {
        dispatch({type: C.FAILED_NEW_ARTIST_RESPONSE, error });
      })
  }
}

function submitArtistEdit(id, values) {
  return function(dispatch, getState){
    dispatch({type: C.START_ARTIST_EDIT, id: id});
    return fetch(baseURL + "/api/artists/" + id, {
      method: "PUT",
      body: JSON.stringify(values),
      headers: {'Content-Type': 'application/json'}
    })
    .then((res) => res.json())
      .then((json) => {
        if (json.successful ==true) {
        dispatch({type: 'ARTIST_EDIT_SUCCESS', data: json.data});
          dispatch(findById(id));
        } else {
          const errors = {};
          json.errors.map((error, i) => {
            errors[error.param] = {
              msg: error.msg,
              value: error.value
            }
          })
          dispatch({type: C.ARTIST_EDIT_ERROR, errors: errors});
        }
      })
    }
  }



let findById = (id) => {
  return function(dispatch){
    dispatch(requestArtist(id));
    return fetch(baseURL + "/api/artists/" + id)
      .then(res => res.json())
      .then(data => dispatch(receiveArtist(data.artist)));
  }
}
function requestArtist(id) {
  return {
    type: 'GET_ARTIST_REQUEST',
  }
}

function receiveArtist(data) {
  return {
    type: 'GET_ARTIST_SUCCESS',
    artist: data
  }
}

const startArtistEdit = (qid) => {
		return {type:C.START_ARTIST_EDIT,qid};
}

const cancelArtistEdit = (qid) => {
		return {type:C.FINISH_ARTIST_EDIT,qid};
}



export default {
  getArtists,
  findById,
  submitNewArtist,
  startArtistEdit,
  cancelArtistEdit,
  submitArtistEdit,
  getArtistPosts
};
