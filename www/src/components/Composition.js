import React, { useMemo, useContext} from 'react';
import styled from '@emotion/styled';
import random from 'random';
import { Context } from './ContextProvider';
import cryptoRandomString from 'crypto-random-string';

function Composition(props) {
  const {
    currentlyEditing,
    setCurrentlyEditing,
    remoteSpectators,
    setIsCreating,
    socket,
  } = useContext(Context);
  const {
    isGradient,
    data,
    isLarge,
  } = props;
  const {
    _id: compositionId,
    passages = [],
  } = data;
  const isEditing = currentlyEditing && currentlyEditing._id === compositionId;
  const isRemotelyEdited = !isEditing && remoteSpectators.map(user => user.editing).filter(Boolean).includes(compositionId);
  const rotation = useMemo(() => 90 * random.int(0, 4), []);
  const bg = useMemo(() => random.int(1, 14),[]);

  const handleEdit = () => {
    socket.send(JSON.stringify({
      type: 'editing',
      compositionId,
    }));

    setIsCreating(false);
    setCurrentlyEditing(data);
  };

  return (
    <Wrap
      bg={bg}
      rotation={rotation}
      isEditing={isEditing}
      isRemotelyEdited={isRemotelyEdited}
      isLarge={isLarge}>
      {(!isEditing && isRemotelyEdited) &&
        <Prompt>
          <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180"><path fill-rule="evenodd" clip-rule="evenodd" d="M90 90l63.786-63.786C137.59 10.018 115.215 0 90.5 0l-.5.001V90zm0 0l63.786 63.786C169.982 137.59 180 115.215 180 90.5l-.001-.5H90zm0 0v89.999l-.5.001c-24.715 0-47.09-10.018-63.286-26.214L90 90zm0 0H.001L0 89.5c0-24.715 10.018-47.09 26.214-63.286L90 90z" fill="url(#paint0_radial)"/><defs><radialGradient id="paint0_radial" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(0 90 -90 0 90 90)"><stop stop-color="#C4C4C4"/><stop offset="1" stop-color="#C4C4C4" stop-opacity="0"/></radialGradient></defs></svg>
        </Prompt>
      }

      <Content isLargePadding={!isGradient}>
        {passages.map(passage => {
          const {
            _key: key,
            content,
          } = passage;

          return (
            <p key={key}>
              { content }
            </p>
          );
        })}

        {(passages.length < 3 && !isRemotelyEdited && !isEditing) &&
          <ButtonAdd onClick={handleEdit}>
            Add a line
          </ButtonAdd>
        }
      </Content>

      <Authors isFinalComp={!isGradient}>
        {passages.map(({ user }) => {
          return (
            <li key={cryptoRandomString({length:10})}>
              { user || 'Anonymous' }
            </li>
          );
        })}
      </Authors>
    </Wrap>
  );
}

const Wrap = styled.div`
  font-family: 'XANO-mincho';
  font-size: 1.5rem;
  margin-bottom: 20px;
  // border: 1px solid #fff;
  line-height: 1.3;
  position: relative;
  // opacity: ${props => props.isRemotelyEdited && 0.5};
  cursor: ${props => props.isRemotelyEdited && 'progress'};
  transition: opacity 1s;

  &:before {
    content: '';
    width: 100%;
    padding-top: 100%;
    display: block;
  }

  &:after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background: ${props => `url('/${props.bg}.svg') no-repeat center center / contain` || '#fff'};
    z-index: -1;
    top: 0;
    left: 0;
    transform: rotate(${props => props.rotation}deg);
  }

  @media (min-width: 1100px) {
    width: ${props => !props.isLarge && `calc(50% - 10px)`};
  }

  @media (max-width: 1100px) {
    width: 100%;
  }
`;

const Content = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  padding: 20%;

  @media (max-width: 720px) {
    padding: 18%;
  }
`;

const Prompt = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  animation: spin 8s linear infinite;

  svg {
    display: block;
  }
`;

const Authors = styled.ul`
  font-size: 14px;
  font-family: 'Arial';
  position: absolute;
  bottom: ${props => props.isFinalComp ? '10vw': '60px'};
  left: ${props => props.isFinalComp ? '10vw': '60px'};
  padding-left: 45px;

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

const ButtonAdd = styled.button`
  width: 100%;
  font: inherit;
  padding: 0;
  color: inherit;
  background: 0;
  border: 0;
  outline: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.25);
  cursor: text;
  text-align: left;
`;

export default React.memo(Composition)
