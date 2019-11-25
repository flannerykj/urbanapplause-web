// @flow
import type { Dispatch, GetState } from '../types/redux';
import imageService from '../services/image-service';

export const addImagesToCache = (images: {[string]: any}) => {
  return function(dispatch: Dispatch, getState: GetState){
    return dispatch({ type: 'ADD_IMAGES', images });
  }
}

