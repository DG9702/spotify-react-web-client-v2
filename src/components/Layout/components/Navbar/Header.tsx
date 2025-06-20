import { Space } from 'antd';
import { Link } from 'react-router-dom';

// Redux
import { useAppSelector } from '../../../../store/store';
import { ARTISTS_DEFAULT_IMAGE } from '../../../../constants/spotify';

const Header = ({ opacity }: { opacity: number; title?: string }) => {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <div
      className={`flex r-0 w-full flex-row items-center justify-between bg-gray-900 rounded-t-md z-10`}
      style={{ backgroundColor: `rgba(12, 12, 12, ${opacity}%)` }}
    >
      <div className='flex flex-row items-center'>
        <Space>

          {/*
          <div className='news'>
            <News />
          </div> */}

          <div className='avatar-container'>
            <Link to={`/users/${user!.id}`}>
              <img
                className='avatar'
                id='user-avatar'
                alt='User Avatar'
                style={{ marginTop: -1 }}
                src={
                  user?.images && user.images.length ? user.images[0].url : ARTISTS_DEFAULT_IMAGE
                }
              />
            </Link>
          </div>
        </Space>
      </div>
    </div>
  );
};

export default Header;
