import io from 'socket.io-client';

// From http://nmajor.com/posts/using-socket-io-with-redux-websocket-redux-middleware
export default function socketMiddleware() {
  let socket = io(window.location.origin);

  function refreshSocket() {
    socket = io({'forceNew': true });
  }

  return ({ dispatch }: { dispatch: any }) => (next: any) => (action: any) => {
    if (typeof action === 'function') {
      return next(action);
    }

    const {
      event,
      leave,
      emit,
      payload,
      handle,
      update,
      ...rest
    } = action;

    // console.log(action);

    if (update) {
      refreshSocket();
      return;
    }

    if (!event) {
      return next(action);
    }

    if (leave) {
      socket.removeAllListeners();
    }

    if (emit) {
      socket.emit(event, payload);
      return;
    }

    let handleEvent = handle;
    if (typeof handleEvent === 'string') {
      handleEvent = (result: any) => dispatch({ type: handle, result, ...rest });
    }

    return socket.on(event, handleEvent);
  }
};
