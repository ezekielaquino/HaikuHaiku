import React, { useState, useEffect, useRef } from 'react';
import { fetchCompositions, closeConnection } from './SanityService';

export const Context = React.createContext({
  activeCompositions: [],
  setActiveCompositions: () => {},
  finishedCompositions: [],
  setFinishedCompositions: () => {},
  remoteSpectators: [],
  setRemoteSpectators: () => {},
  currentlyEditing: false,
  setCurrentlyEditing: () => {},
  isCreating: false,
  setIsCreating: () => {},
});

export function ContextProvider(props) {
  const {
    children,
  } = props;
  const [ activeCompositions, setActiveCompositions ] = useState([]);
  const [ finishedCompositions, setFinishedCompositions ] = useState([]);
  const [ remoteSpectators, setRemoteSpectators ] = useState([]);
  const [ currentlyEditing, setCurrentlyEditing ] = useState(false);
  const [ isCreating, setIsCreating ] = useState(false);
  const [ socket, setSocket ] = useState();
  const [ userId, setUserId ] = useState();
  const [ isAbout, setIsAbout ] = useState();

  const _setCompositions = result => {
    _setActive(result.data, true);
    _setFinished(result.data);
  };

  const setAbout = bool => {
    setIsAbout(bool);
    setCurrentlyEditing(false);
    setIsCreating(false);
  };

  const _setActive = (result, setState) => {
    const active = result.filter(comp => comp.passages.length < 3);
    
    if (setState) return setActiveCompositions(active);

    return active;
  };

  const _setFinished = result => {
    const finished = result.filter(comp => comp.passages.length >= 3);
    setFinishedCompositions(comps => [
      ...finished,
      ...comps,
    ]);
  };

  const _updateCompositions = mutated => {
    let result;

    setActiveCompositions(compositions => {
      if (mutated.transition === 'update') {
        result = compositions.map(c => {
          if (c._id === mutated.documentId) return mutated.result;
          return c;
        });
      } else {
        result = [
          mutated.result,
          ...compositions,
        ];
      }

      return _setActive(result);
    });

    _setFinished(result);
  };

  useEffect(() => {
    const socket = new WebSocket(process.env.GATSBY_SOCKET);

    socket.onopen = event => {
      socket.send(JSON.stringify({
        type: 'register',
      }));
    };

    socket.onmessage = event => {
      const data = JSON.parse(event.data);
  
      if (data.type === 'registrations') {
        setRemoteSpectators(data.clients);
      }

      if (data.type === 'update') {
        _updateCompositions(data.mutation);
      }
    };
  
    fetchCompositions().then(_setCompositions);
    setSocket(socket);

    window.addEventListener('beforeunload', () => {
      socket.close();
      closeConnection();
    }, false);
  }, []);

  const context = {
    activeCompositions,
    setActiveCompositions,
    finishedCompositions,
    setFinishedCompositions,
    remoteSpectators,
    setRemoteSpectators,
    currentlyEditing,
    setCurrentlyEditing,
    isCreating,
    setIsCreating,
    socket,
    userId,
    isAbout,
    setAbout,
  };

  return (
    <Context.Provider value={context}>
      { children }
    </Context.Provider>
  );
}