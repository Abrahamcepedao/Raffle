/* 
  Program that creates that functions that will be used to dispatch actions to the reducer.
*/

import * as t from "./types";


//Function that set the drop depth 
export const setDropDepth = (depth: number) => {
  return { 
    type: t.SET_DROP_DEPTH, 
    payload: depth
  };
}

//Function that set the drop zone
export const setInDropZone = (inDropZone: boolean) => {
  return {
    type: t.SET_IN_DROP_ZONE,
    payload: inDropZone
  }
}