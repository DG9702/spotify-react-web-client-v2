/* eslint-disable react-hooks/exhaustive-deps */
// Components
import { Slider } from '../../../Slider';

// Utils
import { msToTime } from '../../../../utils';

// Redux
import { useAppSelector } from '../../../../store/store';
import { playerService } from '../../../../services/player';
import { useEffect, useState } from 'react';

const SongProgressBar = () => {
  const state = useAppSelector((state) => state.spotify.state);

  const [value, setValue] = useState<number>(0);
  const [selecting, setSelecting] = useState<boolean>(false);

  useEffect(() => {
    if (state && !selecting) {
      setValue(
        state?.duration
          ? state.position >= state?.duration
            ? 0
            : state.position / state.duration
          : 0
      );
    }
  }, [state, selecting]);

  return (
    <div className='flex items-center justify-between w-full'>
      <div className='text-white mr-2 text-xs'>
        {state && state.position ? msToTime(state.position) : '0:00'}
      </div>
      <div style={{ width: '100%' }}>
      <Slider
          isEnabled={true}
          value={value}
          onChangeStart={() => setSelecting(true)}
          onChange={(v) => setValue(v)}
          onChangeEnd={(v) => {
            setSelecting(false);
            if (!state) return;
            const newPosition = Math.round(state.duration * v);
            playerService.seekToPosition(newPosition);
          }}
        />
      </div>
      <div className='text-white ml-2 text-xs'>
        {state && state.duration ? msToTime(state.duration) : '0:00'}
      </div>
    </div>
  );
};

export default SongProgressBar;
