import type { AppContext, AppProps } from 'next/app';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import theme from 'utils/theme';
import { useEffect } from 'react';
import { CacheProvider, EmotionCache } from '@emotion/react';
import createEmotionCache from 'utils/createEmotionCache';
import Head from 'next/head';
import {
  SSRKeycloakProvider,
  SSRCookies,
  getKeycloakInstance,
} from '@react-keycloak/ssr';
import { KEYCLOAK_PUBLIC_CONFIG } from 'utils/auth';
import { parseCookies } from 'utils/cookies';
import { keycloakEvents$ } from '../utils/http';
import { TenantProvider } from 'components/TenantProvider';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
  cookies: any;
}

function MyApp(props: MyAppProps) {
  const {
    Component,
    emotionCache = clientSideEmotionCache,
    pageProps,
    cookies,
  } = props;

  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    jssStyles?.parentElement?.removeChild(jssStyles);
  }, []);

  return (
    <SSRKeycloakProvider
      keycloakConfig={KEYCLOAK_PUBLIC_CONFIG}
      persistor={SSRCookies(cookies)}
      initOptions={{
        onLoad: 'check-sso',
        promiseType: 'native',
        redirect_uri:
          typeof window !== 'undefined'
            ? `${window.location.origin}/silent-check-sso.html`
            : null,
        checkLoginIframe: true,
        // enableBearerInterceptor: true,
        // bearerExcludedUrls: ['/assets'],
        flow: 'standard',
        silentCheckSsoFallback: false,
        silentCheckSsoRedirectUri:
          typeof window !== 'undefined'
            ? `${window.location.origin}/silent-check-sso.html`
            : null,
      }}
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onEvent={async (event, error) => {
        if (event === 'onAuthSuccess') {
          keycloakEvents$.next({
            type: 'success',
          });
        }
        if (event === 'onAuthError') {
          keycloakEvents$.next({
            type: 'error',
          });
        }
        if (event === 'onTokenExpired') {
          console.log('onTokenExpired');
          await getKeycloakInstance(null as any).updateToken(30);
        }
      }}
    >
      <TenantProvider>
        <CacheProvider value={emotionCache}>
          <Head>
            <meta
              name="viewport"
              content="initial-scale=1, width=device-width"
            />
          </Head>

          <ThemeProvider theme={theme}>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />

            <Component {...pageProps} />
          </ThemeProvider>
        </CacheProvider>
      </TenantProvider>
    </SSRKeycloakProvider>
  );
}

MyApp.getInitialProps = async (appContext: AppContext) => {
  return {
    cookies: parseCookies(appContext.ctx.req),
  };
};

export default MyApp;
