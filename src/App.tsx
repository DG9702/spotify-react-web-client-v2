/* eslint-disable react-hooks/exhaustive-deps */
import './styles/App.scss';

// Utils
import i18next from 'i18next';
import { FC, Suspense, lazy, memo, useCallback, useEffect, useRef } from 'react';
import { getFromLocalStorageWithExpiry } from './utils/localstorage';

// Components
import { ConfigProvider } from 'antd';
import { AppLayout } from './components/Layout';
import { Spinner } from './components/spinner/spinner';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

// Redux
import { Provider } from 'react-redux';
import { uiActions } from './store/slices/ui';
import { PersistGate } from 'redux-persist/integration/react';
import { authActions, fetchUser, loginToSpotify } from './store/slices/auth';
import { persistor, store, useAppDispatch, useAppSelector } from './store/store';

// Spotify
import WebPlayback, { WebPlaybackProps } from './utils/spotify/webPlayback';

// Pages
import SearchContainer from './pages/Search/Container';
import { playerService } from './services/player';

const Home = lazy(() => import('./pages/Home'));
const Page404 = lazy(() => import('./pages/404'));
const AlbumView = lazy(() => import('./pages/Album'));
const GenrePage = lazy(() => import('./pages/Genre'));
const BrowsePage = lazy(() => import('./pages/Browse'));
const ArtistPage = lazy(() => import('./pages/Artist'));
const PlaylistView = lazy(() => import('./pages/Playlist'));
const ArtistDiscographyPage = lazy(() => import('./pages/Discography'));

const Profile = lazy(() => import('./pages/User/Home'));
const ProfileTracks = lazy(() => import('./pages/User/Songs'));
const ProfileArtists = lazy(() => import('./pages/User/Artists'));
const ProfilePlaylists = lazy(() => import('./pages/User/Playlists'));

const SearchPage = lazy(() => import('./pages/Search/Home'));
const SearchTracks = lazy(() => import('./pages/Search/Songs'));
const LikedSongsPage = lazy(() => import('./pages/LikedSongs'));
const SearchAlbums = lazy(() => import('./pages/Search/Albums'));
const SearchPlaylist = lazy(() => import('./pages/Search/Playlists'));
const SearchPageArtists = lazy(() => import('./pages/Search/Artists'));
const RecentlySearched = lazy(() => import('./pages/Search/RecentlySearched'));

window.addEventListener('resize', () => {
  const vh = window.innerWidth;
  if (vh < 950) {
    store.dispatch(uiActions.collapseLibrary());
  }
});

const SpotifyContainer: FC<{ children: any }> = memo(({ children }) => {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);

  useEffect(() => {
    const token = getFromLocalStorageWithExpiry('access_token');
    if (!token) {
      dispatch(loginToSpotify());
    } else {
      dispatch(authActions.setToken({ token }));
    }
  }, [dispatch]);

  useEffect(() => {
    if (token) {
      dispatch(fetchUser());
    }
  }, [token, dispatch]);

  if (!token) return <Spinner loading />;

  const webPlaybackSdkProps: WebPlaybackProps = {
    playerAutoConnect: true,
    playerInitialVolume: 1.0,
    playerRefreshRateMs: 1000,
    playerName: 'Spotify React Player',
    onPlayerRequestAccessToken: () => Promise.resolve(token!),
    onPlayerLoading: () => {},
    onPlayerWaitingForDevice: () => {
      dispatch(authActions.setPlayerLoaded({ playerLoaded: true }));
      dispatch(authActions.fetchUser());
    },
    onPlayerError: (e) => {
      dispatch(loginToSpotify());
    },
    onPlayerDeviceSelected: () => {
      dispatch(authActions.setPlayerLoaded({ playerLoaded: true }));
    },
  };

  return <WebPlayback {...webPlaybackSdkProps}>{children}</WebPlayback>;
});

const RootComponent = () => {
  const container = useRef<HTMLDivElement>(null);
  const user = useAppSelector((state) => state.auth.user);
  const language = useAppSelector((state) => state.language.language);

  const playing = useAppSelector((state) => !state.spotify.state?.paused);
  const song = useAppSelector((state) => state.spotify.state?.track_window.current_track);

  useEffect(() => {
    document.documentElement.setAttribute('lang', language);
    i18next.changeLanguage(language);
  }, [language]);

  useEffect(() => {
    document.title =
      song && playing ? `${song.name} • ${song.artists[0].name}` : 'Spotify Web Player';
  }, [song, playing]);

  const handleSpaceBar = useCallback(
    (e: KeyboardEvent) => {
      // @ts-ignore
      if (e.target?.tagName?.toUpperCase() === 'INPUT') return;
      if (playing === undefined) return;
      e.stopPropagation();
      if (e.key === ' ' || e.code === 'Space' || e.keyCode === 32) {
        e.preventDefault();
        const request = !playing ? playerService.startPlayback() : playerService.pausePlayback();
        request.then().catch(() => {});
      }
    },
    [playing]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleSpaceBar);
    return () => {
      document.removeEventListener('keydown', handleSpaceBar);
    };
  }, [handleSpaceBar]);

  useEffect(() => {
    const handleContextMenu = (e: any) => {
      e.preventDefault();
    };
    document.addEventListener('contextmenu', handleContextMenu);
    return () => {
      document.removeEventListener('keydown', handleContextMenu);
    };
  }, []);

  const routes = [
    { path: '', element: <Home container={container} /> },
    { path: '/collection/tracks', element: <LikedSongsPage container={container} /> },
    { path: '/playlist/:playlistId', element: <PlaylistView container={container} /> },
    { path: '/album/:albumId', element: <AlbumView container={container} /> },
    {
      path: '/artist/:artistId/discography',
      element: <ArtistDiscographyPage container={container} />,
    },
    { path: '/artist/:artistId', element: <ArtistPage container={container} /> },
    { path: '/users/:userId/artists', element: <ProfileArtists container={container} /> },
    { path: '/users/:userId/playlists', element: <ProfilePlaylists container={container} /> },
    { path: '/users/:userId/tracks', element: <ProfileTracks container={container} /> },
    { path: '/users/:userId', element: <Profile container={container} /> },
    { path: '/genre/:genreId', element: <GenrePage /> },
    { path: '/search', element: <BrowsePage /> },
    { path: '/recent-searches', element: <RecentlySearched /> },
    {
      path: '/search/:search',
      element: <SearchContainer container={container} />,
      children: [
        {
          path: 'artists',
          element: <SearchPageArtists container={container} />,
        },
        {
          path: 'albums',
          element: <SearchAlbums container={container} />,
        },
        {
          path: 'playlists',
          element: <SearchPlaylist container={container} />,
        },
        {
          path: 'tracks',
          element: <SearchTracks container={container} />,
        },
        {
          path: '',
          element: <SearchPage container={container} />,
        },
      ],
    },
    { path: '*', element: <Page404 /> },
  ];

  return (
    <Spinner loading={!user}>
      <Router>
        <AppLayout>
          <div className='Main-section' ref={container}>
            <div style={{ minHeight: 'calc(100vh - 230px)', width: '100%' }}>
              <Routes>
                {routes.map((route) => (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={<Suspense>{route.element}</Suspense>}
                  >
                    {route?.children
                      ? route.children.map((child) => (
                          <Route
                            key={child.path}
                            path={child.path}
                            element={<Suspense>{child.element}</Suspense>}
                          />
                        ))
                      : undefined}
                  </Route>
                ))}
              </Routes>
            </div>
          </div>
        </AppLayout>
      </Router>
    </Spinner>
  );
};

function App() {
  return (
    <ConfigProvider theme={{ token: { fontFamily: 'SpotifyMixUI' } }}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <SpotifyContainer>
            <RootComponent />
          </SpotifyContainer>
        </PersistGate>
      </Provider>
    </ConfigProvider>
  );
}

export default App;
