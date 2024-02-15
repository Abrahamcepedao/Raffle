/* 
  Program that creates that functions that will be used to dispatch actions to the reducer.
*/

import * as t from "./types";

import { Participant } from "./interfaces";

//Function that sets the participants
export const setReduxParticipants = (participants: Array<Participant>) => {
  return { 
    type: t.SET_PARTICIPANTS, 
    payload: participants
  };
}

//Function that sets the isFinal
export const setReduxIsFinal = (isFinal: boolean) => {
  return { 
    type: t.SET_IS_FINAL, 
    payload: isFinal
  };
}

//Function that sets the numPrizes
export const setReduxNumPrize = (numPrizes: number) => {
  console.log("setReduxNumPrize====> ", numPrizes);
  return { 
    type: t.SET_NUM_PRIZE, 
    payload: numPrizes
  };
}