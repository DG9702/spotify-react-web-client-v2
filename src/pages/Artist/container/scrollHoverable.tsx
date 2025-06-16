import { FC, memo } from 'react';
import { PageHeader } from '../../../components/Layout/components/Header';
import { useAppSelector } from '../../../store/store';
import { PlayCircleButton } from './controls/playCircle';
import { Space } from 'antd';

interface ArtistPageProps {
  color: string;
  container: React.RefObject<HTMLDivElement | null>;
  sectionContainer: React.RefObject<HTMLDivElement | null>;
}

export const ArtistHoverableMenu: FC<ArtistPageProps> = memo((props) => {
  const artist = useAppSelector((state) => state.artist.artist);
  return (
    <PageHeader {...props} activeHeider={270} activeContentHeight={320}>
      <Space>
        <PlayCircleButton size={20} />
        <h1 className='playlist-header'>{artist?.name}</h1>
      </Space>
    </PageHeader>
  );
});

export default ArtistHoverableMenu;
