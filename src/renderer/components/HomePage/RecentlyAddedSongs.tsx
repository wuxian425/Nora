/* eslint-disable react/jsx-no-useless-fragment */
import React, { ForwardedRef } from 'react';
import { AppUpdateContext } from 'renderer/contexts/AppUpdateContext';
import useSelectAllHandler from 'renderer/hooks/useSelectAllHandler';
import SongCard from '../SongsPage/SongCard';
import DefaultSongCover from '../../../../assets/images/webp/song_cover_default.webp';
import SecondaryContainer from '../SecondaryContainer';
import Button from '../Button';

type Props = { latestSongs: AudioInfo[]; noOfVisibleSongs: number };

const RecentlyAddedSongs = React.forwardRef(
  (props: Props, ref: ForwardedRef<HTMLDivElement>) => {
    const { changeCurrentActivePage } = React.useContext(AppUpdateContext);

    const { latestSongs, noOfVisibleSongs = 6 } = props;
    const MAX_SONG_LIMIT = 30;

    const selectAllHandler = useSelectAllHandler(
      latestSongs,
      'songs',
      'songId'
    );

    const latestSongComponents = React.useMemo(
      () =>
        latestSongs.length > 0 && latestSongs[0] !== null
          ? latestSongs
              .filter((_, i) => i < (noOfVisibleSongs || MAX_SONG_LIMIT))
              .map((song, index) => {
                const songData = song as AudioInfo;
                return (
                  <SongCard
                    index={index}
                    key={songData.songId}
                    title={songData.title}
                    artworkPath={
                      songData.artworkPaths?.artworkPath || DefaultSongCover
                    }
                    path={songData.path}
                    songId={songData.songId}
                    artists={songData.artists}
                    album={songData.album}
                    palette={songData.palette}
                    isAFavorite={songData.isAFavorite}
                    isBlacklisted={songData.isBlacklisted}
                    selectAllHandler={selectAllHandler}
                  />
                );
              })
          : [],
      [latestSongs, noOfVisibleSongs, selectAllHandler]
    );

    return (
      <SecondaryContainer
        className="recently-added-songs-container appear-from-bottom h-fit max-h-full flex-col pb-8 pl-8"
        focusable
        onKeyDown={(e) => {
          if (e.ctrlKey && e.key === 'a') {
            e.stopPropagation();
            selectAllHandler();
          }
        }}
        ref={ref}
      >
        {latestSongs.length > 0 && latestSongs[0] !== null && (
          <>
            <div className="title-container my-4 flex items-center justify-between text-2xl font-medium text-font-color-highlight dark:text-dark-font-color-highlight">
              Recently Added Songs
              <Button
                label="Show All"
                tooltipLabel="Opens 'Songs' with 'Newest' sort option."
                iconName="apps"
                className="show-all-btn text-sm font-normal"
                clickHandler={() =>
                  changeCurrentActivePage('Songs', {
                    sortingOrder: 'dateAddedAscending',
                  })
                }
              />
            </div>
            <div
              style={{
                gridTemplateColumns: `repeat(${Math.floor(
                  (noOfVisibleSongs < 6
                    ? 6
                    : noOfVisibleSongs < MAX_SONG_LIMIT
                    ? noOfVisibleSongs
                    : MAX_SONG_LIMIT) / 2
                )},1fr)`,
              }}
              className="songs-container grid grid-rows-2 gap-2 pr-2"
            >
              {latestSongComponents}
            </div>
          </>
        )}
      </SecondaryContainer>
    );
  }
);

RecentlyAddedSongs.displayName = 'RecentlyAddedSongs';
export default RecentlyAddedSongs;
