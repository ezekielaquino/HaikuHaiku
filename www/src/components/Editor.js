import React, { useState, useContext, useRef, useEffect } from 'react';
import { Context } from './ContextProvider';
import { updateComposition } from './SanityService';
import styled from '@emotion/styled';
import gibberish from 'gibberish-detector';
import syllable from 'syllable';
import useTimer from './useTimer';

function Editor() {
  const {
    socket,
    currentlyEditing,
    setIsCreating,
    setCurrentlyEditing,
  } = useContext(Context);
  const {
    _id: compositionId,
    passages = [],
  } = currentlyEditing;
  const { remainingTime } = useTimer({
    onTimeout: () => {
      handleEdit();
    },
  });
  const [ validation, setValidation ] = useState();
  const [ isMounted, setMounted ] = useState();
  const formRef = useRef();
  const inputRef = useRef();

  const handleEdit = () => {
    socket.send(JSON.stringify({
      type: 'editing',
      compositionId: false,
    }));

    setTimeout(() => {
      setIsCreating(false);
      setCurrentlyEditing(false);
    }, 100);
  };

  const handleSubmit = e => {
    e.preventDefault();
    setValidation('');

    const formData = new FormData(formRef.current);
    const passage = formData.get('passage');
    const user = formData.get('user') || 'Anonymous';
    const isValid = gibberish.detect(passage) > 0.8 && syllable(passage) < 10 && syllable(passage) >= 2;

    if (!isValid) {
      return setValidation('Your contribution might be too short or too long and might have some gibberish');
    }

    setCurrentlyEditing(false);
  
    updateComposition({
      compositionId,
      passage,
      user,
    })
      .then(() => {  
        socket.send(JSON.stringify({
          type: 'editing',
          compositionId: '',
        }));
      });
  };

  useEffect(() => {
    if (!isMounted) {
      setMounted(true);
    }
  }, []);

  return (
    <Wrap>
      <div>
        <Timer isStarted={remainingTime <= 120}>
          <span>
            Just let it flow
          </span>

          <span>
            { remainingTime }
          </span>
        </Timer>

        <p>
          {passages.map(passage => {
            return (
              <>
                { passage.content }<br/>
              </>
            );
          })}
        </p>
 
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          autocomplete="off">
          <Input
            type="text"
            name="passage"
            placeholder="Your line"
            onChange={() => setValidation('')}
            ref={input => (!isMounted && input) && input.focus()}
            autofocus="true" />
          <Input
            type="text"
            name="user"
            placeholder="Your name" />

          <small>
            { validation }
          </small>
          
          <div>
            <Button type="button" onClick={handleEdit}>
              Cancel
            </Button>

            <Button type="submit">
              Submit
            </Button>
          </div>
        </form>

        <Authors>
          Collaborating with
          {passages.map(passage => {
            return (
              <li>{passage.user}</li>
            );
          })}
        </Authors>
      </div>
    </Wrap>
  )
}

const Wrap = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  font-family: 'XANO-mincho';
  justify-content: center;
  line-height: 1.3;

  > div {
    width: 90vw;
    max-width: 600px;
    font-size: 2rem;
  }

  form {
    -webkit-appearance: none;
  }

  form div {
    margin-top: 30px;
  }

  small {
    font-family: 'Arial';
    font-size: 14px;
  }
`;

const Timer = styled.div`
  font-family: 'Arial';
  font-size: 1.2rem;
  height: 1.2rem;
  margin-bottom: 30px;
  position: relative;

  span:nth-of-type(1) {
    opacity: ${props => props.isStarted ? 0 : 1};
    transition: opacity 1s;
    position: absolute;
    left: 0;
    top: 0;
  }

  span:nth-of-type(2) {
    opacity: ${props => props.isStarted ? 1 : 0};
    transition: opacity 1s;
    position: absolute;
    left: 0;
    top: 0;
  }
`;

const Input = styled.input`
  font: inherit;
  background: none;
  border: 0;
  width: 100%;
  border-bottom: 1px solid rgba(255, 255, 255, 0.25);
  outline: none;
  padding: 5px;
  color: inherit;
  -webkit-appearance: none;

  &:focus {
    border: 0;
    box-shadow: 0px 0px 40px #fff;
    border-radius: 6px;
  }

  &:last-of-type {
    margin-bottom: 15px;
  }

  &::placeholder {
    color: rgba(var(--colorRgb), 0.4);
  }
`;

const Authors = styled.ul`
  font-size: 14px;
  font-family: 'Arial';
  padding-left: 45px;
  margin-top: 90px;

  li {
    position: relative;
  }

  li:nth-of-type(1):before {
    content: '';
    position: absolute;
    width: 30px;
    height: 1px;
    background-color: var(--color);
    left: -38px;
    top: 50%;
  }
`;

const Button = styled.button`
  font: inherit;
  color: inherit;
  background: none;
  border: 1px solid rgba(255, 255, 255, 0.25);
  outline: none;
  cursor: pointer;
  padding: 10px 30px;
  border-radius: 30px;

  & + & {
    margin-left: 10px;
  }

  &:hover {
    background: var(--color);
    color: var(--bg);
  }
`;

export default React.memo(Editor)
