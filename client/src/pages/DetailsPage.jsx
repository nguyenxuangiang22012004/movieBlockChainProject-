import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMovieById, fetchMovies } from '../store/slices/movieSlice';
import MovieCard from '../components/MovieCard';
import VideoPlayer from '../components/VideoPlayer';
import { postComment, getComments } from '../services/commentService';
import { toast } from 'react-toastify';
import MovieCardSidebar from '../components/MovieCardSidebar';

function DetailsPage() {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { currentMovie, movies, loading, error } = useSelector((state) => state.movies);
  const [activeTab, setActiveTab] = useState('tab-1');
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');


  // ✅ Đọc từ URL (1-based) và chuyển thành index (0-based)
  const seasonFromUrl = parseInt(searchParams.get('season')) || 1; // Default 1
  const episodeFromUrl = parseInt(searchParams.get('episode')) || 1; // Default 1

  // ✅ State lưu index thực tế (0-based) để truy xuất mảng
  const [selectedSeasonIndex, setSelectedSeasonIndex] = useState(seasonFromUrl - 1);
  const [selectedEpisodeIndex, setSelectedEpisodeIndex] = useState(episodeFromUrl - 1);
  const [selectedQuality, setSelectedQuality] = useState('1080p');
  const [selectedSync, setSelectedSync] = useState('0');
  const [isLoadingMovie, setIsLoadingMovie] = useState(true);
  const videoKey = useRef(0);

  // ✅ Sync state với URL khi URL thay đổi
  useEffect(() => {
    setSelectedSeasonIndex(seasonFromUrl - 1);
    setSelectedEpisodeIndex(episodeFromUrl - 1);
  }, [seasonFromUrl, episodeFromUrl]);

  useEffect(() => {
    setIsLoadingMovie(true);
    videoKey.current = Date.now();
    dispatch(fetchMovieById(movieId))
      .then(() => setIsLoadingMovie(false))
      .catch((error) => {
        setIsLoadingMovie(false);
      });

    if (movies.length === 0) {
      dispatch(fetchMovies());
    }
  }, [dispatch, movieId, movies.length]);

  // ✅ Reset episode về 1 khi chuyển season
  useEffect(() => {
    if (currentMovie?.category?.toLowerCase() === 'tvseries') {
      setSelectedEpisodeIndex(0);
      videoKey.current += 1;
      navigate(`/details/${movieId}?season=${selectedSeasonIndex + 1}&episode=1`, { replace: true });
    } else {
      navigate(`/details/${movieId}`, { replace: true });
    }
  }, [selectedSeasonIndex, currentMovie, movieId, navigate]);

  // Force re-render video khi đổi episode
  useEffect(() => {
    videoKey.current += 1;
  }, [selectedEpisodeIndex]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const handleSeasonChange = (e) => {
    if (currentMovie?.category?.toLowerCase() !== 'tvseries') return;
    const seasonIndex = parseInt(e.target.value); // Đây là 0-based index
    setSelectedSeasonIndex(seasonIndex);
    // URL hiển thị +1 (1-based)
    navigate(`/details/${movieId}?season=${seasonIndex + 1}&episode=1`, { replace: true });
  };

  const handleEpisodeChange = (e) => {
    if (currentMovie?.category?.toLowerCase() !== 'tvseries') return;
    const episodeIndex = parseInt(e.target.value); // Đây là 0-based index
    setSelectedEpisodeIndex(episodeIndex);
    // URL hiển thị +1 (1-based)
    navigate(`/details/${movieId}?season=${selectedSeasonIndex + 1}&episode=${episodeIndex + 1}`, { replace: true });
  };

  const handleQualityChange = (e) => {
    setSelectedQuality(e.target.value);
  };

  const handleSyncChange = (e) => {
    setSelectedSync(e.target.value);
  };

  const handlePlayerReady = (quality) => {
    setSelectedQuality(`${quality}p`);
  };

  const getRelatedMovies = () => {
    return movies.filter(m => m._id !== movieId).sort(() => 0.5 - Math.random()).slice(0, 6);
  };

  useEffect(() => {
    if (!movieId) return;

    const fetchComments = async () => {
      try {
        const data = await getComments(movieId);
        setComments(data.comments || []);
      } catch (error) {
        console.error('Lỗi khi tải bình luận:', error);
      }
    };

    fetchComments();
  }, [movieId]);
  const handleSendComment = async () => {
    if (!newComment.trim()) {
      toast?.warn?.("Vui lòng nhập nội dung bình luận!");
      return;
    }

    try {
      const res = await postComment(movieId, currentMovie.category, newComment);
      if (res.success) {
        setComments([res.comment, ...comments]);
        setNewComment('');
        toast?.success?.("Bình luận thành công!");
      }
    } catch (err) {
      console.error("Lỗi khi gửi bình luận:", err);
      toast?.error?.(err.response?.data?.message || "Không thể gửi bình luận");
    }
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
                              <Link key={`actor-${index}`} to="/actor">{actor}</Link>
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
                        <li>
                          <span>Premiere:</span>{" "}
                          {currentMovie.release_year
                            ? new Date(currentMovie.release_year).toLocaleDateString("vi-VN")
                            : "N/A"}
                        </li>
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
              <VideoPlayer
                currentMovie={currentMovie}
                isLoadingMovie={isLoadingMovie}
                selectedSeason={selectedSeasonIndex}
                selectedEpisode={selectedEpisodeIndex}
                selectedQuality={selectedQuality}
                videoKey={videoKey.current}
                onPlayerReady={handlePlayerReady}
              />
              {currentMovie.category === 'TVSeries' && currentMovie.seasons && (
                <div className="section__item-filter">
                  <select
                    className="section__item-select"
                    name="season"
                    id="filter__season"
                    value={selectedSeasonIndex}
                    onChange={handleSeasonChange}
                  >
                    {currentMovie.seasons.map((season, index) => (
                      <option key={`season-${index}`} value={index}>
                        Season {index + 1}: {season.title}
                      </option>
                    ))}
                  </select>

                  <select
                    className="section__item-select"
                    name="series"
                    id="filter__series"
                    value={selectedEpisodeIndex}
                    onChange={handleEpisodeChange}
                  >
                    {currentMovie.seasons[selectedSeasonIndex]?.episodes?.map((episode, index) => (
                      <option key={`episode-${index}`} value={index}>
                        Episode {index + 1}: {episode.title}
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
                            {comments.length === 0 ? (
                              <p>Chưa có bình luận nào. Hãy là người đầu tiên!</p>
                            ) : (
                              comments.map((comment) => (
                                <li key={comment._id} className="comments__item">
                                  <div className="comments__autor">
                                    <span className="comments__name">{comment.user_id?.username || 'Người dùng'}</span>
                                    <span className="comments__time">
                                      {new Date(comment.createdAt).toLocaleString('vi-VN')}
                                    </span>
                                  </div>
                                  <p className="comments__text">{comment.content}</p>
                                  <div className="comments__actions">
                                    <div className="comments__rate">
                                      <button type="button"><i className="ti ti-thumb-up"></i>{comment.likes}</button>
                                      <button type="button">{comment.dislikes}<i className="ti ti-thumb-down"></i></button>
                                    </div>
                                    <button type="button"><i className="ti ti-arrow-forward-up"></i>Reply</button>
                                  </div>
                                </li>
                              ))
                            )}
                          </ul>

                          <form onSubmit={(e) => e.preventDefault()} className="sign__form sign__form--comments">
                            <div className="sign__group">
                              <textarea
                                id="textreview"
                                name="textreview"
                                className="sign__textarea"
                                placeholder="Nhập bình luận của bạn..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                              ></textarea>
                            </div>
                            <button
                              type="button"
                              className="sign__btn sign__btn--small"
                              onClick={handleSendComment}
                            >
                              Send
                            </button>
                          </form>
                        </div>
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
                    <MovieCardSidebar movie={{
                      id: movie._id || movie.id,
                      cover_image_url: movie.cover_image_url,
                      rating: movie.imdb_rating || movie.rating || 0,
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