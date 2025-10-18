import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMovieById, fetchMovies } from '../store/slices/movieSlice';
import MovieCard from '../components/MovieCard';

// Dữ liệu mẫu cho comments, reviews, photos
const commentsData = [
  {
    id: 1,
    avatar: '/img/user.svg',
    name: 'John Doe',
    time: '30.08.2018, 17:53',
    text: 'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don\'t look even slightly believable.',
    likes: 12,
    dislikes: 7,
    replies: [
      {
        id: 11,
        avatar: '/img/user.svg',
        name: 'John Doe',
        time: '24.08.2018, 16:41',
        text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
        likes: 8,
        dislikes: 3
      }
    ]
  },
  {
    id: 2,
    avatar: '/img/user.svg',
    name: 'John Doe',
    time: '11.08.2018, 11:11',
    text: 'It has survived not only five centuries, but also the leap into electronic typesetting.',
    likes: 11,
    dislikes: 1,
    isQuote: true,
    quoteText: 'There are many variations of passages of Lorem Ipsum available.'
  }
];

const photosData = [
  { id: 1, src: '/img/gallery/project-1.jpg', caption: 'Some image caption 1' },
  { id: 2, src: '/img/gallery/project-2.jpg', caption: 'Some image caption 2' },
  { id: 3, src: '/img/gallery/project-3.jpg', caption: 'Some image caption 3' },
  { id: 4, src: '/img/gallery/project-4.jpg', caption: 'Some image caption 4' },
  { id: 5, src: '/img/gallery/project-5.jpg', caption: 'Some image caption 5' },
  { id: 6, src: '/img/gallery/project-6.jpg', caption: 'Some image caption 6' },
];

function DetailsPage() {
  const { movieId } = useParams();
  const dispatch = useDispatch();
  const { currentMovie, movies, loading, error } = useSelector((state) => state.movies);
  const playerRef = useRef(null);
  const playerInstanceRef = useRef(null);
  const [activeTab, setActiveTab] = useState('tab-1');
  const [selectedSeason, setSelectedSeason] = useState(0);
  const [selectedEpisode, setSelectedEpisode] = useState(0);
  const [selectedQuality, setSelectedQuality] = useState('1080p');
  const [selectedSync, setSelectedSync] = useState('0');
  const [isLoadingMovie, setIsLoadingMovie] = useState(true);
  const videoKey = useRef(0); // Để force re-render video element

  useEffect(() => {
    setIsLoadingMovie(true);
    dispatch(fetchMovieById(movieId))
      .then(() => setIsLoadingMovie(false))
      .catch((error) => {
        console.error('Lỗi khi tải phim:', error);
        setIsLoadingMovie(false);
      });

    if (movies.length === 0) {
      dispatch(fetchMovies());
    }
  }, [dispatch, movieId, movies.length]);

  // Reset episode khi chuyển season
  useEffect(() => {
    setSelectedEpisode(0);
    videoKey.current += 1; // Force re-render video
  }, [selectedSeason]);

  // Force re-render video khi đổi episode
  useEffect(() => {
    videoKey.current += 1;
  }, [selectedEpisode]);

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
                  setSelectedQuality(`${quality}p`);
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
  }, [currentMovie, isLoadingMovie, selectedSeason, selectedEpisode, videoKey.current]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const handleSeasonChange = (e) => {
    const seasonIndex = parseInt(e.target.value);
    setSelectedSeason(seasonIndex);
  };

  const handleEpisodeChange = (e) => {
    const episodeIndex = parseInt(e.target.value);
    setSelectedEpisode(episodeIndex);
  };

  const handleQualityChange = (e) => {
    setSelectedQuality(e.target.value);
  };

  const handleSyncChange = (e) => {
    setSelectedSync(e.target.value);
  };

  const getRelatedMovies = () => {
    return movies.filter(m => m._id !== movieId).sort(() => 0.5 - Math.random()).slice(0, 6);
  };

  if (loading && !currentMovie) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!currentMovie) return <div>Movie not found</div>;

  return (
    <>
      <div className="section__details-bg" data-bg="img/bg/details__bg.jpg"></div>

      <section className="section section--details">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h1 className="section__title section__title--head">{currentMovie.title}</h1>
            </div>

            <div className="col-12 col-xl-6">
              <div className="item item--details">
                <div className="row">
                  <div className="col-12 col-sm-5 col-md-5 col-lg-4 col-xl-6 col-xxl-5">
                    <div className="item__cover">
                      <img src={currentMovie.cover_image_url || '/img/covers/cover1.jpg'} alt={currentMovie.title} />
                      <span className="item__rate item__rate--green">{currentMovie.imdb_rating || currentMovie.rating || 0}</span>
                      <button className="item__favorite item__favorite--static" type="button">
                        <i className="ti ti-bookmark"></i>
                      </button>
                    </div>
                  </div>

                  <div className="col-12 col-md-7 col-lg-8 col-xl-6 col-xxl-7">
                    <div className="item__content">
                      <ul className="item__meta">
                        <li><span>Director:</span> <Link to="/actor">{currentMovie.director || 'Unknown'}</Link></li>
                        <li>
                          <span>Cast:</span>
                          {currentMovie.actors?.map((actor, index) => (
                            <React.Fragment key={index}>
                              <Link to="/actor">{actor}</Link>
                              {index < currentMovie.actors.length - 1 ? ' ' : ''}
                            </React.Fragment>
                          )) || 'Unknown'}
                        </li>
                        <li>
                          <span>Genre:</span>
                          {currentMovie.genres?.map((genre, index) => (
                            <React.Fragment key={index}>
                              <Link to="/catalog">{genre}</Link>
                              {index < currentMovie.genres.length - 1 ? ' ' : ''}
                            </React.Fragment>
                          ))}
                        </li>
                        <li><span>Premiere:</span> {currentMovie.release_year}</li>
                        <li><span>Running time:</span> {currentMovie.running_time} min</li>
                        <li><span>Country:</span> <Link to="/catalog">{currentMovie.country}</Link></li>
                      </ul>

                      <div className="item__description">
                        <p>{currentMovie.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-xl-6">
              <div className="section__player">
                {isLoadingMovie ? (
                  <div className="error-message">Loading video...</div>
                ) : currentMovie ? (
                  <video
                    key={`video-${movieId}-s${selectedSeason}-e${selectedEpisode}-${videoKey.current}`}
                    ref={playerRef}
                    controls
                    crossOrigin="anonymous"
                    playsInline
                    poster={currentMovie.cover_image_url}
                    className="plyr-video"
                  >
                    {(() => {
                      let videoSource = null;
                      if (currentMovie.category === 'Movie') {
                        videoSource = currentMovie.video_source;
                      } else if (currentMovie.category === 'TVSeries' && 
                                 currentMovie.seasons?.[selectedSeason]?.episodes?.[selectedEpisode]) {
                        videoSource = currentMovie.seasons[selectedSeason].episodes[selectedEpisode].video_source;
                      }
                      
                      if (!videoSource?.sources) {
                        return <div>Không tìm thấy nguồn video.</div>;
                      }

                      return Object.entries(videoSource.sources).map(([quality, cid], index) => (
                        <source
                          key={`${quality}-${index}`}
                          src={`http://127.0.0.1:8080/ipfs/${cid}`}
                          type="video/mp4"
                          size={parseInt(quality.replace('p', ''))}
                        />
                      ));
                    })()}
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
                ) : (
                  <div className="error-message">Video không khả dụng.</div>
                )}
              </div>
              
              {currentMovie.category === 'TVSeries' && currentMovie.seasons && (
                <div className="section__item-filter">
                  <select 
                    className="section__item-select" 
                    name="season" 
                    id="filter__season"
                    value={selectedSeason}
                    onChange={handleSeasonChange}
                  >
                    {currentMovie.seasons.map((season, index) => (
                      <option key={`season-${index}`} value={index}>
                        Season {season.season_number}: {season.title}
                      </option>
                    ))}
                  </select>

                  <select 
                    className="section__item-select" 
                    name="series" 
                    id="filter__series"
                    value={selectedEpisode}
                    onChange={handleEpisodeChange}
                  >
                    {currentMovie.seasons[selectedSeason]?.episodes?.map((episode, index) => (
                      <option key={`episode-${index}`} value={index}>
                        Episode {episode.episode_number}: {episode.title}
                      </option>
                    ))}
                  </select>

                  <select 
                    className="section__item-select" 
                    name="sync" 
                    id="filter__sync"
                    value={selectedSync}
                    onChange={handleSyncChange}
                  >
                    <option value="0">Eng.Original</option>
                    <option value="1">NewStudio</option>
                    <option value="2">LostFilm</option>
                    <option value="3">HotFlix</option>
                  </select>

                  <select
                    className="section__item-select"
                    name="quality"
                    id="filter__quality"
                    value={selectedQuality}
                    onChange={handleQualityChange}
                  >
                    {(() => {
                      let videoSource = null;
                      if (currentMovie.seasons?.[selectedSeason]?.episodes?.[selectedEpisode]) {
                        videoSource = currentMovie.seasons[selectedSeason].episodes[selectedEpisode].video_source;
                      }
                      return videoSource?.sources ? (
                        Object.keys(videoSource.sources).map((quality) => (
                          <option key={`quality-${quality}`} value={quality}>
                            {quality}
                          </option>
                        ))
                      ) : null;
                    })()}
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="content">
        <div className="content__head content__head--mt">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <h2 className="content__title">Discover</h2>

                <ul className="nav nav-tabs content__tabs" id="content__tabs" role="tablist">
                  <li className="nav-item" role="presentation">
                    <button
                      className={activeTab === 'tab-1' ? 'active' : ''}
                      onClick={() => handleTabChange('tab-1')}
                    >
                      Comments
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className={activeTab === 'tab-2' ? 'active' : ''}
                      onClick={() => handleTabChange('tab-2')}
                    >
                      Reviews
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className={activeTab === 'tab-3' ? 'active' : ''}
                      onClick={() => handleTabChange('tab-3')}
                    >
                      Photos
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="row">
            <div className="col-12 col-lg-8">
              <div className="tab-content">
                {activeTab === 'tab-1' && (
                  <div className="tab-pane fade show active">
                    <div className="row">
                      <div className="col-12">
                        <div className="comments">
                          <ul className="comments__list">
                            {commentsData.map(comment => (
                              <React.Fragment key={comment.id}>
                                <li className={`comments__item ${comment.isQuote ? 'comments__item--quote' : ''}`}>
                                  <div className="comments__autor">
                                    <img className="comments__avatar" src={comment.avatar} alt="" />
                                    <span className="comments__name">{comment.name}</span>
                                    <span className="comments__time">{comment.time}</span>
                                  </div>
                                  <p className="comments__text">
                                    {comment.isQuote ? (
                                      <>
                                        <span>{comment.quoteText}</span>
                                        {comment.text}
                                      </>
                                    ) : (
                                      comment.text
                                    )}
                                  </p>
                                  <div className="comments__actions">
                                    <div className="comments__rate">
                                      <button type="button"><i className="ti ti-thumb-up"></i>{comment.likes}</button>
                                      <button type="button">{comment.dislikes}<i className="ti ti-thumb-down"></i></button>
                                    </div>
                                    <button type="button"><i className="ti ti-arrow-forward-up"></i>Reply</button>
                                    <button type="button"><i className="ti ti-quote"></i>Quote</button>
                                  </div>
                                </li>

                                {comment.replies && comment.replies.length > 0 && (
                                  <ul className="comments__replies">
                                    {comment.replies.map(reply => (
                                      <li key={reply.id} className="comments__item comments__item--answer">
                                        <div className="comments__autor">
                                          <img className="comments__avatar" src={reply.avatar} alt="" />
                                          <span className="comments__name">{reply.name}</span>
                                          <span className="comments__time">{reply.time}</span>
                                        </div>
                                        <p className="comments__text">{reply.text}</p>
                                        <div className="comments__actions">
                                          <div className="comments__rate">
                                            <button type="button"><i className="ti ti-thumb-up"></i>{reply.likes}</button>
                                            <button type="button">{reply.dislikes}<i className="ti ti-thumb-down"></i></button>
                                          </div>
                                          <button type="button"><i className="ti ti-arrow-forward-up"></i>Reply</button>
                                          <button type="button"><i className="ti ti-quote"></i>Quote</button>
                                        </div>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </React.Fragment>
                            ))}
                          </ul>

                          <form action="#" className="sign__form sign__form--comments">
                            <div className="sign__group">
                              <textarea id="textreview" name="textreview" className="sign__textarea" placeholder="Add review"></textarea>
                            </div>
                            <button type="button" className="sign__btn sign__btn--small">Send</button>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'tab-3' && (
                  <div className="tab-pane fade show active">
                    <div className="gallery" itemScope>
                      <div className="row">
                        {photosData.map(photo => (
                          <figure key={photo.id} className="col-12 col-sm-6 col-xl-4" itemProp="associatedMedia" itemScope>
                            <a href={photo.src} itemProp="contentUrl" data-size="1920x1280">
                              <img src={photo.src} itemProp="thumbnail" alt={photo.caption} />
                            </a>
                            <figcaption itemProp="caption description">{photo.caption}</figcaption>
                          </figure>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="col-12 col-lg-4">
              <div className="row">
                <div className="col-12">
                  <h2 className="section__title section__title--sidebar">You may also like...</h2>
                </div>

                {getRelatedMovies().map(movie => (
                  <div key={movie._id} className="col-6 col-sm-4 col-lg-6">
                    <MovieCard movie={{
                      id: movie._id,
                      cover: movie.cover_image_url,
                      rate: movie.imdb_rating || movie.rating || 0,
                      title: movie.title,
                      categories: movie.genres || [],
                    }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default DetailsPage;