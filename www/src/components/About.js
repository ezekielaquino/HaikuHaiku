import React from 'react';
import styled from '@emotion/styled';
import Brand from './Brand';

function About(props) {
  const {
    view,
  } = props;

  return (
    <Wrap view={view}>
      <header>
        <div>
          <Brand />
        </div>
      </header>

      <Main>
        <p>
          is a website where people can collaborate to create images with words (actual images, coming soon).
        </p>

        <p>
          An experiment by <a href="https://ezekielaquino.com" target="_blank">Ezekiel Aquino/Public Service</a> (2019). <a href="mailto: ezekielaquino@gmail.com">You can send me a mail</a>.
        </p>

        <ul>
          <li>Deployed on Heroku/Netlify</li>
          <li>Data management by Sanity</li>
          <li>Build by Gatsby</li>
          <li>Fonts: Arial and XANO Mincho</li>
          <li>
            <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
              <input type="hidden" name="cmd" value="_s-xclick" />
              <input type="hidden" name="hosted_button_id" value="K7PWJ4AB3U9TQ" />
              <Donate type="submit" src="https://www.paypalobjects.com/en_US/NL/i/btn/btn_donateCC_LG.gif" border="0" name="submit" value="Contribute to my personal development fund™" />
              <img alt="" border="0" src="https://www.paypal.com/en_NL/i/scr/pixel.gif" width="1" height="1" />
            </form>
          </li>
        </ul>
      </Main>
    </Wrap>
  )
}

const Wrap = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(162, 162, 162, 0.8);
  color: var(--color);
  overflow-y: auto;

  header div {
    padding: 10px;
  }

  @media (min-width: 720px) {
    header {
      display: flex;

      div {
        width: 50%;
      }
    }
  }

  @media (max-width: 720px) {
    padding-left: ${props => props.view === 'completed' && '15vw'};
    padding-right: ${props => props.view === 'create' && '15vw'};
  }
`;

const Donate = styled.input`
  font: inherit;
  appearance: none;
  background: none;
  border: 0;
  color: inherit;
  padding: 10px 15px;
  border-radius: 30px;
  margin-top: 30px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  white-space: normal;
  text-align: left;
  cursor: pointer;
`;

const Main = styled.main`
  padding: 0 10px;

  p + p {
    margin-top: 30px;
  }

  ul {
    margin-top: 30px;
  }

  a {
    color: inherit;
  }

  @media (min-width: 720px) {
    width: 50%;
    margin-left: auto;
    font-size: 2.5vw;

    ul {
      font-size: 1.5rem;
      line-height: 1;
    }
  }

  @media (max-width: 720px) {
    font-size: 4vw;

    ul {
      font-size: 1rem;
    }
  }
`;

export default About
