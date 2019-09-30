import io from 'socket.io-client';

// From http://nmajor.com/posts/using-socket-io-with-redux-websocket-redux-middleware
export default function socketMiddleware() {
  const socket = io();

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
      ...rest
    } = action;

    if (!event) {
      return next(action);
    }

    if (leave) {
      socket.removeListener(event);
    }

    if (emit) {
      socket.emit(event, payload);
      return;
    }

    let handleEvent = handle;
    console.log('wow');
    if (typeof handleEvent === 'string') {
      console.log('handleEvent');
      handleEvent = (result: any) => dispatch({ type: handle, result, ...rest });
    }
    return socket.on(event, handleEvent);
  }
};
