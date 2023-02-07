/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable promise/always-return */
/* eslint-disable react/no-array-index-key */
/* eslint-disable promise/catch-or-return */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/self-closing-comp */
/* eslint-disable import/prefer-default-export */
import React, { useContext } from 'react';
import { AppUpdateContext } from 'renderer/contexts/AppUpdateContext';
import { AppContext } from 'renderer/contexts/AppContext';
import LyricLine from './LyricLine';
import NoLyricsImage from '../../../../assets/images/svg/Sun_Monochromatic.svg';
import FetchingLyricsImage from '../../../../assets/images/svg/Waiting_Monochromatic.svg';
import NoInternetImage from '../../../../assets/images/svg/Network _Monochromatic.svg';
import LyricsSource from './LyricsSource';
import NoLyrics from './NoLyrics';
import MainContainer from '../MainContainer';
import Button from '../Button';

export const syncedLyricsRegex = /^\[\d+:\d{1,2}\.\d{1,3}]/gm;

// document.addEventListener('lyrics/scrollIntoView', () =>
//   console.log('scroll into view')
// );

export const LyricsPage = () => {
  const { currentSongData } = useContext(AppContext);
  const { addNewNotifications } = React.useContext(AppUpdateContext);

  const [lyrics, setLyrics] = React.useState(
    null as SongLyrics | undefined | null
  );

  const lyricsLinesContainerRef = React.useRef<HTMLDivElement>(null);
  const [isAutoScrolling, setIsAutoScrolling] = React.useState(true);

  const copyright = React.useMemo(() => {
    if (lyrics?.copyright) return lyrics.copyright;
    if (lyrics?.lyrics?.copyright) return lyrics?.lyrics?.copyright;
    return undefined;
  }, [lyrics]);

  React.useEffect(() => {
    if (navigator.onLine) {
      setLyrics(null);
      addNewNotifications([
        {
          id: 'fetchLyrics',
          delay: 5000,
          content: (
            <span>
              Fetching lyrics for &apos;{currentSongData.title}&apos;...
            </span>
          ),
          icon: (
            <span className="material-icons-round-outlined !text-xl">mic</span>
          ),
        },
      ]);
      window.api
        .getSongLyrics({
          songTitle: currentSongData.title,
          songArtists: Array.isArray(currentSongData.artists)
            ? currentSongData.artists.map((artist) => artist.name)
            : [],
          songId: currentSongData.songId,
          duration: currentSongData.duration,
        })
        .then((res) => {
          setLyrics(res);
        });
    }
  }, [
    addNewNotifications,
    currentSongData.artists,
    currentSongData.duration,
    currentSongData.songId,
    currentSongData.title,
  ]);

  const lyricsComponents = React.useMemo(() => {
    if (lyrics && lyrics?.lyrics) {
      const { isSynced, lyrics: unsyncedLyrics, syncedLyrics } = lyrics.lyrics;

      if (syncedLyrics) {
        return syncedLyrics.map((lyric, index) => {
          const { text, end, start } = lyric;
          return (
            <LyricLine
              key={index}
              index={index}
              lyric={text}
              syncedLyrics={{ start, end }}
              isAutoScrolling={isAutoScrolling}
            />
          );
        });
      }
      if (!isSynced) {
        return unsyncedLyrics.map((line, index) => {
          return (
            <LyricLine
              key={index}
              index={index}
              lyric={line}
              isAutoScrolling={isAutoScrolling}
            />
          );
        });
      }
    }
    return [];
  }, [isAutoScrolling, lyrics]);

  const showOnlineLyrics = React.useCallback(
    (_: unknown, setIsDisabled: (state: boolean) => void) => {
      setIsDisabled(true);
      window.api
        .getSongLyrics(
          {
            songTitle: currentSongData.title,
            songArtists: Array.isArray(currentSongData.artists)
              ? currentSongData.artists.map((artist) => artist.name)
              : [],
            songId: currentSongData.songId,
            duration: currentSongData.duration,
          },
          'ANY',
          'ONLINE_ONLY'
        )
        .then((res) => setLyrics(res))
        .finally(() => setIsDisabled(false));
    },
    [
      currentSongData.artists,
      currentSongData.duration,
      currentSongData.songId,
      currentSongData.title,
    ]
  );

  const showOfflineLyrics = React.useCallback(
    (_: unknown, setIsDisabled: (state: boolean) => void) => {
      setIsDisabled(true);
      window.api
        .getSongLyrics(
          {
            songTitle: currentSongData.title,
            songArtists: Array.isArray(currentSongData.artists)
              ? currentSongData.artists.map((artist) => artist.name)
              : [],
            songId: currentSongData.songId,
            duration: currentSongData.duration,
          },
          'ANY',
          'OFFLINE_ONLY'
        )
        .then((res) => setLyrics(res))
        .finally(() => setIsDisabled(false));
    },
    [
      currentSongData.artists,
      currentSongData.duration,
      currentSongData.songId,
      currentSongData.title,
    ]
  );

  const saveOnlineLyrics = React.useCallback(
    (_: unknown, setIsDisabled: (state: boolean) => void) => {
      if (lyrics) {
        setIsDisabled(true);
        window.api
          .saveLyricsToSong(currentSongData.songId, lyrics)
          .then(() => {
            setLyrics((prevData) => {
              if (prevData) {
                return {
                  ...prevData,
                  source: 'in_song_lyrics',
                } as SongLyrics;
              }
              return undefined;
            });
            addNewNotifications([
              {
                id: 'lyricsUpdateSuccessful',
                delay: 5000,
                content: <span>Lyrics successfully updated.</span>,
                icon: (
                  <span className="material-icons-round-outlined !text-xl">
                    check
                  </span>
                ),
              },
            ]);
          })
          .finally(() => setIsDisabled(false));
      }
    },
    [addNewNotifications, currentSongData.songId, lyrics]
  );

  return (
    <MainContainer
      noDefaultStyles
      className={`lyrics-container relative flex h-full flex-col ${
        lyrics && navigator.onLine
          ? 'justify-start'
          : 'items-center justify-center'
      }`}
    >
      <>
        {navigator.onLine ? (
          lyrics ? (
            <>
              <div className="title-container relative flex w-full items-center justify-between py-2 pl-8 pr-2 text-2xl text-font-color-highlight dark:text-dark-font-color-highlight">
                <div className="flex max-w-[50%] items-center">
                  <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                    {lyrics.source === 'in_song_lyrics' ? 'Offline' : 'Online'}{' '}
                    Lyrics for '{currentSongData.title}'
                  </span>
                  {lyrics.source !== 'in_song_lyrics' && (
                    <span
                      className="material-icons-round-outlined ml-4 cursor-pointer text-base"
                      title="No offline lyrics found in the song."
                    >
                      help
                    </span>
                  )}
                </div>
                <div className="buttons-container flex">
                  {lyrics?.lyrics?.isSynced && (
                    <Button
                      key={5}
                      label={
                        lyrics && lyrics.source === 'in_song_lyrics'
                          ? isAutoScrolling
                            ? 'Stop Auto Scrolling'
                            : 'Enable auto scrolling'
                          : undefined
                      }
                      tooltipLabel={
                        lyrics && lyrics.source !== 'in_song_lyrics'
                          ? isAutoScrolling
                            ? 'Stop Auto Scrolling'
                            : 'Enable auto scrolling'
                          : undefined
                      }
                      pendingAnimationOnDisabled
                      className="show-online-lyrics-btn !text-sm md:text-lg md:[&>.button-label-text]:hidden md:[&>.icon]:mr-0"
                      iconName={isAutoScrolling ? 'flash_off' : 'flash_on'}
                      clickHandler={() =>
                        setIsAutoScrolling((prevState) => !prevState)
                      }
                    />
                  )}
                  {lyrics && lyrics.source === 'in_song_lyrics' && (
                    <Button
                      key={3}
                      label="Show online lyrics"
                      pendingAnimationOnDisabled
                      className="show-online-lyrics-btn text-sm md:text-lg md:[&>.button-label-text]:hidden md:[&>.icon]:mr-0"
                      iconName="language"
                      clickHandler={showOnlineLyrics}
                    />
                  )}
                  {lyrics && lyrics.source !== 'in_song_lyrics' && (
                    <>
                      <Button
                        key={3}
                        label="Show saved lyrics"
                        pendingAnimationOnDisabled
                        className="show-online-lyrics-btn text-sm md:text-lg md:[&>.button-label-text]:hidden md:[&>.icon]:mr-0"
                        iconName="visibility"
                        clickHandler={showOfflineLyrics}
                      />
                      <Button
                        key={4}
                        label="Save lyrics"
                        pendingAnimationOnDisabled
                        className="save-lyrics-btn text-sm md:text-lg md:[&>.button-label-text]:hidden md:[&>.icon]:mr-0"
                        iconName="save"
                        clickHandler={saveOnlineLyrics}
                      />
                    </>
                  )}
                </div>
              </div>
              <div
                className="lyrics-lines-container flex h-full flex-col items-center overflow-y-auto px-8 py-4"
                ref={lyricsLinesContainerRef}
                // onScroll={(e) => console.log('scrolling', e)}
              >
                {lyricsComponents}
                <LyricsSource
                  source={lyrics.source}
                  link={lyrics.link}
                  copyright={copyright}
                />
              </div>
            </>
          ) : lyrics === undefined ? (
            <NoLyrics
              artworkPath={NoLyricsImage}
              content="We couldn't find any lyrics for this song."
            />
          ) : (
            <NoLyrics
              artworkPath={FetchingLyricsImage}
              content="Hang on... We are looking everywhere"
            />
          )
        ) : (
          <NoLyrics
            artworkPath={NoInternetImage}
            content="You are not connected to the internet."
          />
        )}
      </>
    </MainContainer>
  );
};
