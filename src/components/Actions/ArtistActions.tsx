import { FC, memo, useMemo } from 'react';

import { Dropdown, MenuProps, message } from 'antd';
import { FollowIcon, UnfollowIcon } from '../Icons';

// Utils
import { useTranslation } from 'react-i18next';

// Interface
import type { Artist, SimpleArtist } from '../../interfaces/artist';

// Redux
import { useAppDispatch, useAppSelector } from '../../store/store';
import { userService } from '../../services/users';
import { yourLibraryActions } from '../../store/slices/yourLibrary';

interface ArtistActionsWrapperProps {
  artist: Artist | Spotify.Track['artists'][0] | SimpleArtist;
  onRefresh?: () => void;
  trigger?: ('contextMenu' | 'click')[];
  children: React.ReactNode | React.ReactNode[];
}

export const ArtistActionsWrapper: FC<ArtistActionsWrapperProps> = memo((props) => {
  const { children, artist } = props;

  const { t } = useTranslation(['playlist']);

  const dispatch = useAppDispatch();
  const myArtists = useAppSelector((state) => state.yourLibrary.myArtists);

  const inLibrary = useMemo(() => {
    // @ts-ignore
    const id = artist.id || artist.uri?.split(':').reverse()[0];
    return myArtists.some((p) => p.id === id);
  }, [myArtists, artist]);

  const items = useMemo(() => {
    const items: MenuProps['items'] = [];
    // @ts-ignore
    const id = artist.id || artist.uri?.split(':').reverse()[0];

    if (inLibrary) {
      items.push({
        key: 'remove',
        label: t('Unfollow'),
        icon: <UnfollowIcon />,
        onClick: async () => {
          userService.unfollowArtists([id]).then(() => {
            message.success(t('Artist unfollowed'));
            dispatch(yourLibraryActions.fetchMyArtists());
          });
        },
      });
    } else {
      items.push({
        key: 'add',
        label: t('Follow'),
        icon: <FollowIcon />,
        onClick: async () => {
          userService.followArtists([id]).then(() => {
            message.success(t('Artist followed'));
            dispatch(yourLibraryActions.fetchMyArtists());
          });
        },
      });
    }

    return items;
  }, [artist, dispatch, inLibrary, t]);

  return (
    <Dropdown menu={{ items }} trigger={props.trigger}>
      {children}
    </Dropdown>
  );
});
