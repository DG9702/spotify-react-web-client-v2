import { Space } from 'antd';
import ForwardBackwardsButton from './ForwardBackwardsButton';

import { memo } from 'react';

const HistoryNavigation = memo(() => {
  return (
    <Space>
      <div className='flex flex-row items-center gap-2 h-full'>
        <ForwardBackwardsButton flip />
        <ForwardBackwardsButton flip={false} />
      </div>
    </Space>
  );
});

export default HistoryNavigation;
