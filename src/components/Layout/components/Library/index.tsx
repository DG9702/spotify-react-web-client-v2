import YourLibrary from './list';

// Redux
import { useAppDispatch } from '../../../../store/store';
import { yourLibraryActions } from '../../../../store/slices/yourLibrary';

// Interfaces
import { useEffect, type FC } from 'react';

interface LibraryProps {}

export const Library: FC<LibraryProps> = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(yourLibraryActions.fetchMyAlbums());
    dispatch(yourLibraryActions.fetchMyArtists());
    dispatch(yourLibraryActions.fetchMyPlaylists());
  }, [dispatch]);

  return (
    <div style={{ height: '100%' }}>
      <YourLibrary />
    </div>
  );
};

export default Library;
