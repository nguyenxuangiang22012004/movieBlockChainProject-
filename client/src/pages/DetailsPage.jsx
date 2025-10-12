import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMovieById, fetchMovies } from '../store/slices/movieSlice';
import MovieCard from '../components/MovieCard';

// Dữ liệu mẫu cho comments, reviews, photos (thay bằng thực sau)
const commentsData = [
  {
    id: 1,
    avatar: '/img/user.svg',
    name: 'John Doe',
    time: '30.08.2018, 17:53',
    text: 'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don\'t look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn\'t anything embarrassing hidden in the middle of text.',
    likes: 12,
    dislikes: 7,
    replies: [
      {
        id: 11,
        avatar: '/img/user.svg',
        name: 'John Doe',
        time: '24.08.2018, 16:41',
        text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
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
    text: 'It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
    likes: 11,
    dislikes: 1,
    isQuote: true,
    quoteText: 'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don\'t look even slightly believable.'
  },
  {
    id: 3,
    avatar: '/img/user.svg',
    name: 'John Doe',
    time: '07.08.2018, 14:33',
    text: 'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don\'t look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn\'t anything embarrassing hidden in the middle of text.',
    likes: 99,
    dislikes: 35
  },
  {
    id: 4,
    avatar: '/img/user.svg',
    name: 'John Doe',
    time: '02.08.2018, 15:24',
    text: 'Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for \'lorem ipsum\' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).',
    likes: 74,
    dislikes: 13
  }
];

const reviewsData = [
  {
    id: 1,
    avatar: '/img/user.svg',
    title: 'Best Marvel movie in my opinion',
    name: 'John Doe',
    time: '24.08.2018, 17:53',
    rating: 6,
    ratingClass: 'reviews__rating--yellow',
    text: 'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don\'t look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn\'t anything embarrassing hidden in the middle of text.'
  },
  {
    id: 2,
    avatar: '/img/user.svg',
    title: 'Best Marvel movie in my opinion',
    name: 'John Doe',
    time: '24.08.2018, 17:53',
    rating: 9,
    ratingClass: 'reviews__rating--green',
    text: 'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don\'t look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn\'t anything embarrassing hidden in the middle of text.'
  },
  {
    id: 3,
    avatar: '/img/user.svg',
    title: 'Best Marvel movie in my opinion',
    name: 'John Doe',
    time: '24.08.2018, 17:53',
    rating: 5,
    ratingClass: 'reviews__rating--red',
    text: 'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don\'t look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn\'t anything embarrassing hidden in the middle of text.'
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
  const [activeTab, setActiveTab] = useState('tab-1');
  const [selectedSeason, setSelectedSeason] = useState(0);
  const [selectedEpisode, setSelectedEpisode] = useState(0);
  const [slimSelectInstances, setSlimSelectInstances] = useState([]);
  const [selectedQuality, setSelectedQuality] = useState('auto');
  const [currentTime, setCurrentTime] = useState(0);
  const [videoQualities, setVideoQualities] = useState([]);
  const [currentQuality, setCurrentQuality] = useState('auto');


  useEffect(() => {
    if (!currentMovie || currentMovie._id !== movieId) {
      dispatch(fetchMovieById(movieId));
    }
    if (movies.length === 0) {
      dispatch(fetchMovies());
    }
  }, [dispatch, movieId, currentMovie, movies.length]);
  const getVideoUrl = (quality = selectedQuality) => {
    if (!currentMovie) return '';

    let baseCid = '';

    if (currentMovie.category === 'Movie') {
      baseCid = currentMovie.video_source?.cid;
    } else if (currentMovie.category === 'TVSeries' && currentMovie.seasons?.[selectedSeason]?.episodes?.[selectedEpisode]) {
      const episode = currentMovie.seasons[selectedSeason].episodes[selectedEpisode];
      baseCid = episode.video_source?.cid;
    }

    if (!baseCid) return '';

    return `http://127.0.0.1:8080/ipfs/${baseCid}`;
  };

  const videoUrl = getVideoUrl();
  useEffect(() => {
  let playerInstance = null;
  if (window.Plyr && playerRef.current) {
    playerInstance = new window.Plyr(playerRef.current, {
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
        'fullscreen'
      ],
      settings: ['quality', 'speed', 'loop'],
      clickToPlay: true,
      quality: {
        default: 1080,
        options: [2160, 1440, 1080, 720, 480, 360],
        forced: true,
        onChange: (quality) => {
          setCurrentQuality(quality);
        }
      },
      i18n: {
        qualityLabel: {
          2160: '4K',
          1440: '2K',
          1080: 'HD',
          720: 'HD',
          480: 'SD',
          360: 'SD'
        }
      }
    });

    // Move event listeners here
    playerInstance.on('play', () => {
      console.log('Video is playing');
    });

    playerInstance.on('pause', () => {
      console.log('Video is paused');
    });

    if (videoUrl) {
      playerInstance.source = {
        type: 'video',
        sources: [
          {
            src: videoUrl,
            type: 'video/mp4',
            size: 1080
          },
          {
            src: videoUrl,
            type: 'video/mp4',
            size: 720
          },
          {
            src: videoUrl,
            type: 'video/mp4',
            size: 480
          },
          {
            src: videoUrl,
            type: 'video/mp4',
            size: 360
          }
        ]
      };
    }
  }


  return () => {
    if (playerInstance) {
      playerInstance.destroy();
    }
  };
}, [videoUrl]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const getRelatedMovies = () => {
    return movies.filter(m => m._id !== movieId).sort(() => 0.5 - Math.random()).slice(0, 6);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!currentMovie) return <div>Movie not found</div>;

  return (
    <>
      {/* details background */}
      <div className="section__details-bg" data-bg="img/bg/details__bg.jpg"></div>
      {/* end details background */}

      {/* details */}
      <section className="section section--details">
        <div className="container">
          <div className="row">
            {/* title */}
            <div className="col-12">
              <h1 className="section__title section__title--head">{currentMovie.title}</h1>
            </div>
            {/* end title */}

            {/* content */}
            <div className="col-12 col-xl-6">
              <div className="item item--details">
                <div className="row">
                  {/* card cover */}
                  <div className="col-12 col-sm-5 col-md-5 col-lg-4 col-xl-6 col-xxl-5">
                    <div className="item__cover">
                      <img src={currentMovie.cover_image_url || '/img/covers/cover1.jpg'} alt={currentMovie.title} />
                      <span className="item__rate item__rate--green">{currentMovie.imdb_rating || currentMovie.rating || 0}</span>
                      <button className="item__favorite item__favorite--static" type="button">
                        <i className="ti ti-bookmark"></i>
                      </button>
                    </div>
                  </div>
                  {/* end card cover */}

                  {/* card content */}
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
                  {/* end card content */}
                </div>
              </div>
            </div>
            {/* end content */}

            {/* player */}
            <div className="col-12 col-xl-6">
              <div className="section__player">
                {videoUrl ? (
                  <video
                    key={videoUrl}
                    ref={playerRef}
                    controls
                    crossOrigin="anonymous"
                    playsInline
                    poster={currentMovie.cover_image_url}
                    id="player"
                    className="plyr-video"
                  >
                    <source src={videoUrl} size="1080" type="video/mp4" />
                    <source src={videoUrl} size="720" type="video/mp4" />
                    <source src={videoUrl} size="480" type="video/mp4" />
                    <source src={videoUrl} size="360" type="video/mp4" />
                    {currentMovie.subtitles?.map((sub, index) => (
                      <track
                        key={index}
                        kind="subtitles"
                        srcLang={sub.lang}
                        label={sub.label}
                        src={sub.url}
                      />
                    ))}
                  </video>
                ) : null}
              </div>

              {currentMovie.category === 'TVSeries' && currentMovie.seasons && (
                <div className="section__item-filter">
                  <select className="section__item-select" name="season" id="filter__season">
                    {currentMovie.seasons.map((season, index) => (
                      <option key={index} value={index}>
                        Season {season.season_number}: {season.title}
                      </option>
                    ))}
                  </select>

                  <select className="section__item-select" name="series" id="filter__series">
                    {currentMovie.seasons[selectedSeason]?.episodes?.map((episode, index) => (
                      <option key={index} value={index}>
                        Episode {episode.episode_number}: {episode.title}
                      </option>
                    ))}
                  </select>

                  <select className="section__item-select" name="sync" id="filter__sync">
                    <option value="0">Eng.Original</option>
                    <option value="1">NewStudio</option>
                    <option value="2">LostFilm</option>
                    <option value="3">HotFlix</option>
                  </select>
                </div>
              )}
            </div>
            {/* end player */}
          </div>
        </div>
      </section>
      {/* end details */}

      {/* content */}
      <section className="content">
        <div className="content__head content__head--mt">
          <div className="container">
            <div className="row">
              <div className="col-12">
                {/* content title */}
                <h2 className="content__title">Discover</h2>
                {/* end content title */}

                {/* content tabs nav */}
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
              {/* content tabs */}
              <div className="tab-content">
                {/* Comments Tab */}
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

                                {/* Render replies in a separate list */}
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
                          {/* paginator mobile */}
                          <div className="paginator-mob paginator-mob--comments">
                            <span className="paginator-mob__pages">5 of 628</span>

                            <ul className="paginator-mob__nav">
                              <li>
                                <a href="#">
                                  <i className="ti ti-chevron-left"></i>
                                  <span>Prev</span>
                                </a>
                              </li>
                              <li>
                                <a href="#">
                                  <span>Next</span>
                                  <i className="ti ti-chevron-right"></i>
                                </a>
                              </li>
                            </ul>
                          </div>
                          {/* end paginator mobile */}

                          {/* paginator desktop */}
                          <ul className="paginator paginator--comments">
                            <li className="paginator__item paginator__item--prev">
                              <a href="#"><i className="ti ti-chevron-left"></i></a>
                            </li>
                            <li className="paginator__item"><a href="#">1</a></li>
                            <li className="paginator__item paginator__item--active"><a href="#">2</a></li>
                            <li className="paginator__item"><a href="#">3</a></li>
                            <li className="paginator__item"><a href="#">4</a></li>
                            <li className="paginator__item"><span>...</span></li>
                            <li className="paginator__item"><a href="#">36</a></li>
                            <li className="paginator__item paginator__item--next">
                              <a href="#"><i className="ti ti-chevron-right"></i></a>
                            </li>
                          </ul>
                          {/* end paginator desktop */}

                          <form action="#" className="sign__form sign__form--comments">
                            <div className="sign__group">
                              <textarea id="text" name="text" className="sign__textarea" placeholder="Add comment"></textarea>
                            </div>
                            <button type="button" className="sign__btn sign__btn--small">Send</button>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Reviews Tab */}
                {activeTab === 'tab-2' && (
                  <div className="tab-pane fade show active">
                    <div className="row">
                      <div className="col-12">
                        <div className="reviews">
                          <ul className="reviews__list">
                            {reviewsData.map(review => (
                              <li key={review.id} className="reviews__item">
                                <div className="reviews__autor">
                                  <img className="reviews__avatar" src={review.avatar} alt="" />
                                  <span className="reviews__name">{review.title}</span>
                                  <span className="reviews__time">by {review.name}, {review.time}</span>
                                  <span className={`reviews__rating ${review.ratingClass}`}>
                                    {review.rating}
                                  </span>
                                </div>
                                <p className="reviews__text">{review.text}</p>
                              </li>
                            ))}
                          </ul>

                          {/* paginator mobile */}
                          <div className="paginator-mob paginator-mob--comments">
                            <span className="paginator-mob__pages">5 of 628</span>

                            <ul className="paginator-mob__nav">
                              <li>
                                <a href="#">
                                  <i className="ti ti-chevron-left"></i>
                                  <span>Prev</span>
                                </a>
                              </li>
                              <li>
                                <a href="#">
                                  <span>Next</span>
                                  <i className="ti ti-chevron-right"></i>
                                </a>
                              </li>
                            </ul>
                          </div>
                          {/* end paginator mobile */}

                          {/* paginator desktop */}
                          <ul className="paginator paginator--comments">
                            <li className="paginator__item paginator__item--prev">
                              <a href="#"><i className="ti ti-chevron-left"></i></a>
                            </li>
                            <li className="paginator__item"><a href="#">1</a></li>
                            <li className="paginator__item paginator__item--active"><a href="#">2</a></li>
                            <li className="paginator__item"><a href="#">3</a></li>
                            <li className="paginator__item"><a href="#">4</a></li>
                            <li className="paginator__item"><span>...</span></li>
                            <li className="paginator__item"><a href="#">36</a></li>
                            <li className="paginator__item paginator__item--next">
                              <a href="#"><i className="ti ti-chevron-right"></i></a>
                            </li>
                          </ul>
                          {/* end paginator desktop */}

                          <form action="#" className="sign__form sign__form--comments">
                            <div className="sign__group">
                              <input type="text" className="sign__input" placeholder="Title" />
                            </div>

                            <div className="sign__group">
                              <select className="sign__select" name="rating" id="rating">
                                <option value="0">Rating</option>
                                <option value="1">1 star</option>
                                <option value="2">2 stars</option>
                                <option value="3">3 stars</option>
                                <option value="4">4 stars</option>
                                <option value="5">5 stars</option>
                                <option value="6">6 stars</option>
                                <option value="7">7 stars</option>
                                <option value="8">8 stars</option>
                                <option value="9">9 stars</option>
                                <option value="10">10 stars</option>
                              </select>
                            </div>

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

                {/* Photos Tab */}
                {activeTab === 'tab-3' && (
                  <div className="tab-pane fade show active">
                    {/* project gallery */}
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
                    {/* end project gallery */}
                  </div>
                )}
              </div>
              {/* end content tabs */}
            </div>

            {/* sidebar */}
            <div className="col-12 col-lg-4">
              <div className="row">
                {/* section title */}
                <div className="col-12">
                  <h2 className="section__title section__title--sidebar">You may also like...</h2>
                </div>
                {/* end section title */}

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
            {/* end sidebar */}
          </div>
        </div>
      </section>
      {/* end content */}

      {/* PhotoSwipe */}
      <div className="pswp" tabIndex="-1" role="dialog" aria-hidden="true">
        <div className="pswp__bg"></div>
        <div className="pswp__scroll-wrap">
          <div className="pswp__container">
            <div className="pswp__item"></div>
            <div className="pswp__item"></div>
            <div className="pswp__item"></div>
          </div>
          <div className="pswp__ui pswp__ui--hidden">
            <div className="pswp__top-bar">
              <div className="pswp__counter"></div>
              <button className="pswp__button pswp__button--close" title="Close (Esc)"></button>
              <button className="pswp__button pswp__button--fs" title="Toggle fullscreen"></button>
              <div className="pswp__preloader">
                <div className="pswp__preloader__icn">
                  <div className="pswp__preloader__cut">
                    <div className="pswp__preloader__donut"></div>
                  </div>
                </div>
              </div>
            </div>
            <button className="pswp__button pswp__button--arrow--left" title="Previous (arrow left)"></button>
            <button className="pswp__button pswp__button--arrow--right" title="Next (arrow right)"></button>
            <div className="pswp__caption">
              <div className="pswp__caption__center"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DetailsPage;