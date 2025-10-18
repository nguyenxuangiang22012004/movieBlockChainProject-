import React, { useEffect, useRef } from 'react';

function VideoPlayer({ 
  currentMovie, 
  isLoadingMovie, 
  selectedSeason, 
  selectedEpisode,
  videoKey,
  onPlayerReady 
}) {
  const playerRef = useRef(null);
  const playerInstanceRef = useRef(null);

  // Cleanup toàn bộ player khi component unmount
  useEffect(() => {
    return () => {
      if (playerInstanceRef.current) {
        try {
          if (typeof playerInstanceRef.current.destroy === 'function') {
            playerInstanceRef.current.destroy();
          }
        } catch (error) {
          console.error('Error destroying player on unmount:', error);
        } finally {
          playerInstanceRef.current = null;
        }
      }
    };
  }, []);

  // Init Plyr player
  useEffect(() => {
    if (!isLoadingMovie && currentMovie && window.Plyr && playerRef.current) {
      // Destroy player cũ trước
      if (playerInstanceRef.current) {
        try {
          if (typeof playerInstanceRef.current.destroy === 'function') {
            playerInstanceRef.current.destroy();
          }
        } catch (error) {
          console.error('Error destroying old player:', error);
        }
        playerInstanceRef.current = null;
      }

      // Đợi DOM render xong
      const timeoutId = setTimeout(() => {
        if (!playerRef.current) return;

        let videoSource = null;
        if (currentMovie.category === 'Movie') {
          videoSource = currentMovie.video_source;
        } else if (currentMovie.category === 'TVSeries' && 
                   currentMovie.seasons?.[selectedSeason]?.episodes?.[selectedEpisode]) {
          videoSource = currentMovie.seasons[selectedSeason].episodes[selectedEpisode].video_source;
        }

        if (videoSource?.sources) {
          const sources = videoSource.sources;
          const availableQualities = Object.keys(sources)
            .map((key) => ({
              src: `http://127.0.0.1:8080/ipfs/${sources[key]}`,
              type: 'video/mp4',
              size: parseInt(key.replace('p', '')),
            }))
            .sort((a, b) => b.size - a.size); // Sort descending

          try {
            playerInstanceRef.current = new window.Plyr(playerRef.current, {
              controls: [
                'play-large',
                'play',
                'progress',
                'current-time',
                'duration',
                'mute',
                'volume',
                'settings',
                'pip',
                'airplay',
                'fullscreen',
              ],
              settings: ['quality', 'speed', 'loop'],
              clickToPlay: true,
              quality: {
                default: availableQualities[0]?.size || 1080,
                options: availableQualities.map(q => q.size),
                forced: true,
                onChange: (quality) => {
                  if (onPlayerReady) {
                    onPlayerReady(quality);
                  }
                },
              },
            });

            playerInstanceRef.current.source = {
              type: 'video',
              sources: availableQualities,
            };
          } catch (error) {
            console.error('Error initializing Plyr:', error);
          }
        }
      }, 150); // Tăng delay lên 150ms

      return () => clearTimeout(timeoutId);
    }
  }, [currentMovie, isLoadingMovie, selectedSeason, selectedEpisode, videoKey, onPlayerReady]);

  const getVideoKey = () => {
    return `video-${currentMovie?._id}-s${selectedSeason}-e${selectedEpisode}-${videoKey}`;
  };

  const getVideoSource = () => {
    if (!currentMovie) return null;
    
    if (currentMovie.category === 'Movie') {
      return currentMovie.video_source;
    } else if (currentMovie.category === 'TVSeries' && 
               currentMovie.seasons?.[selectedSeason]?.episodes?.[selectedEpisode]) {
      return currentMovie.seasons[selectedSeason].episodes[selectedEpisode].video_source;
    }
    return null;
  };

  if (isLoadingMovie) {
    return (
      <div className="section__player">
        <div className="error-message">Loading video...</div>
      </div>
    );
  }

  if (!currentMovie) {
    return (
      <div className="section__player">
        <div className="error-message">Video không khả dụng.</div>
      </div>
    );
  }

  const videoSource = getVideoSource();

  return (
    <div className="section__player">
      <video
        key={getVideoKey()}
        ref={playerRef}
        controls
        crossOrigin="anonymous"
        playsInline
        poster={currentMovie.cover_image_url}
        className="plyr-video"
      >
        {!videoSource?.sources ? (
          <div>Không tìm thấy nguồn video.</div>
        ) : (
          Object.entries(videoSource.sources).map(([quality, cid], index) => (
            <source
              key={`${quality}-${index}`}
              src={`http://127.0.0.1:8080/ipfs/${cid}`}
              type="video/mp4"
              size={parseInt(quality.replace('p', ''))}
            />
          ))
        )}
        {currentMovie.subtitles?.map((sub, index) => (
          <track
            key={`subtitle-${index}`}
            kind="subtitles"
            srcLang={sub.lang}
            label={sub.label}
            src={sub.url}
          />
        ))}
      </video>
    </div>
  );
}

export default VideoPlayer;