import { GlobalStyles, css } from 'ui';

export function GlobalStyle() {
  return (
    <GlobalStyles
      styles={css`
        html {
          font-family: 'Noto Sans KR', sans-serif;
        }
        html,
        body,
        #root {
          width: 100%;
          height: 100%;
        }

        a {
          color: inherit;
          text-decoration: none;
        }
      `}
    />
  );
}
