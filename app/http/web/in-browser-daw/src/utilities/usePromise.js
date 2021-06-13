import { useEffect, useReducer, useRef } from 'react';

const states = {
  pending: 'pending',
  rejected: 'rejected',
  resolved: 'resolved'
};

const defaultState = {
  error: undefined,
  result: undefined,
  state: states.pending
};

function reducer(state, action) {
  switch (action.type) {
    case states.pending:
      return defaultState;

    case states.resolved:
      return {
        error: undefined,
        result: action.payload,
        state: states.resolved
      };

    case states.rejected:
      return {
        error: action.payload,
        result: undefined,
        state: states.rejected
      };

    /* istanbul ignore next */
    default:
      return state;
  }
}

function usePromise(promiseIn, inputs) {
  const [{ error, result, state }, dispatch] = useReducer(reducer, defaultState);
  const promise = useRef(promiseIn)

  useEffect(() => {
    if (!promise.current) {
      return;
    }

    let canceled = false;

    dispatch({ type: states.pending });

    promise.current.then(
      result => !canceled && dispatch({
        payload: result,
        type: states.resolved
      }),
      error => !canceled && dispatch({
        payload: error,
        type: states.rejected
      })
    );

    return () => {
      canceled = true;
    };
  }, [inputs]);

  return [result, error, state];
}

export default usePromise;
