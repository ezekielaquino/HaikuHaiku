import React, { useContext, useState } from 'react';
import styled from '@emotion/styled';
import { Helmet } from 'react-helmet';
import { Context } from '../components/ContextProvider';
import Composition from '../components/Composition';
import GradientBg from '../components/GradientBg';
import Editor from '../components/Editor';
import NewEditor from '../components/NewEditor';
import About from '../components/About';
import Brand from '../components/Brand';

function Index() {
  const {
    activeCompositions,
    finishedCompositions,
    currentlyEditing,
    setCurrentlyEditing,
    isCreating,
    remoteSpectators,
    setIsCreating,
    isAbout,
    setAbout,
  } = useContext(Context);
  const [ view, setView ] = useState('completed');

  const handleCreate = () => {
    setAbout(false);
    setCurrentlyEditing(false);
    setIsCreating(true);
  };

  return (
    <>
      <Helmet>
        <title>Haiku-Haiku</title>
        <meta name="keywords" content="haiku" />
        <meta name="robots" content="index, follow" />
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="language" content="English" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://haiku-haiku.netlify.com/" />
        <meta property="og:title" content="Haiku-Haiku" />
        <meta property="og:description" content="Collaborative Haiku Writing ✿" />
        <meta property="og:image" content="https://haiku-haiku.netlify.com/screenshot.png" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://haiku-haiku.netlify.com/" />
        <meta property="twitter:title" content="Haiku-Haiku" />
        <meta property="twitter:description" content="Collaborative Haiku Writing ✿" />
        <meta property="twitter:image" content="https://haiku-haiku.netlify.com/screenshot.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </Helmet>

      <GradientBg />

      <Buttons>
        <ButtonNew onClick={handleCreate}>
          New Haiku
        </ButtonNew>

        <ButtonNew onClick={() => setAbout(!isAbout)}>
          {isAbout ? 'Back' : 'About' }
        </ButtonNew>
      </Buttons>

      <Main view={view}>
        <Column>
          <Brand id="headerBrand" isGradient />

          <div>
            {view !== 'create' &&
              <ToggleCreate 
                onClick={() => setView('create')}
                onTouchStart={() => setView('create')} />
            }

            <Grid>
              {activeCompositions.map(composition => {
                return (
                  <Composition
                    key={composition._rev}
                    data={composition}
                    isGradient />
                );
              })}
            </Grid>
          </div>
        </Column>

        <Column>
          <Brand />
          
          <div>
            {view !== 'completed' &&
              <ToggleView
                onClick={() => setView('completed')}
                onTouchStart={() => setView('completed')} />
            }

            <Intro>
              <div>
                {remoteSpectators.length !== 0 &&
                  <>
                    { remoteSpectators.length } authors online
                  </>
                }
                <br/>

                {/* <p>
                  a collaborative platform to create impressions together
                </p> */}

                <span>
                  &larr; Add a line to currently unfinished Haikus
                </span>
              </div>

              <footer>
                {finishedCompositions.length} Completed Haikus<br/>
                &darr;
              </footer>
            </Intro>

            <div>
              {finishedCompositions.map(composition => {
                return (
                  <Composition
                    key={composition._rev}
                    data={composition}
                    isLarge />
                );
              })}
            </div>
          </div>
        </Column>
      </Main>

      {currentlyEditing &&
        <Editor />
      }

      {isCreating &&
        <NewEditor />
      }

      {isAbout &&
        <About view={view} />
      }
    </>
  )
}

const Header = styled.header`
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99;
`;

const Main = styled.main`
  position: fixed;
  width: 100%;
  height: 100%;
  bottom: 0;
  left: 0;
  display: flex;

  @media (max-width: 720px) {
    width: 170vw;
    transition: transform 1s;
    will-change: transform;
    transform: translate3d(${props => props.view === 'create' ? 0 : -70}vw, 0, 0);
  }
`;

const Buttons = styled.div`
  position: fixed;
  bottom: 10px;
  z-index: 9;
  
  @media (min-width: 720px) {
    left: 10px;
  }

  @media (max-width: 720px) {
    right: 10px;
  }
`;

const ButtonNew = styled.button`
  display: inline-block;
  font-family: 'Arial';
  border: 0;
  background-color: rgba(var(--colorRgb), 0.7);
  font-size: 4vw;
  padding: 10px 15px;
  border-radius: 50px;
  color: #fff;
  outline: none;
  cursor: pointer;
  -webkit-tap-highlight-color: rgba(0,0,0,0);

  & + & {
    margin-left: 10px;
  }

  @media (min-width: 720px) {
    font-size: 2.5vw;
    padding: 10px 30px;
  }
`;

const ToggleCreate = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  width: 15vw;
  height: 100%;
  background: none;
  border: 0;
  outline: none;
  display: none;
  z-index: 9999;

  -webkit-tap-highlight-color: rgba(0,0,0,0);

  @media (max-width: 720px) {
    display: block;
  }
`;

const ToggleView = styled.button`
  position: absolute;
  top: 0;
  left: 0;
  width: 15vw;
  height: 100%;
  background: none;
  border: 0;
  outline: none;
  display: none;
  z-index: 9999;

  -webkit-tap-highlight-color: rgba(0,0,0,0);

  @media (max-width: 720px) {
    display: block;
  }
`;

const Intro = styled.div`
  width: 100%;
  padding-bottom: 25px;
  color: var(--color);
  font-size: 2.5vw;
  line-height: 1.1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  span {
    position: relative;
    display: inline-block;
    background: -webkit-linear-gradient(var(--color), rgba(var(--colorRgb), 0));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  footer {
    text-align: center;
  }

  @media (min-width: 720px) {
    height: 12.5vw;
  }

  @media (max-width: 720px) {
    font-size: 4vw;
  }
`;

const Grid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const Column = styled.div`
  width: 100%;
  height: 100%;
  padding: 10px;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    width: 0px;
  }

  > div {
    position: relative;
    padding-bottom: 60px;
  }

  svg {
    position: sticky;
    top: calc((50vw * (100/269) * -1) / 2);
    padding-bottom: 10px;
    z-index: 99;
    display: block;
  }

  stop {
    stop-color: var(--color);
  }

  .solid {
    fill: var(--color);
  }
`;

export default Index
