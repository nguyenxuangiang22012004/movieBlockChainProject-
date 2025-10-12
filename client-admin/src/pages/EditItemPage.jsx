import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchItems, updateItem } from '../redux/itemsSlice';
import { transformFormData } from "../tranforms/editCatalog/editCatalogTransform";

const EditItemPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const slimSelectsRef = useRef({});

  const { data: items, status } = useSelector((state) => state.items);
  const itemToEdit = React.useMemo(
    () => items.find((i) => String(i.id || i._id) === String(id)),
    [items, id]
  );
  const isSubmitting = status === 'loading';
  
  const [showMovieUpload, setShowMovieUpload] = useState({
    '1080p': false,
    '720p': false,
    '480p': false,
    'hls': false
  });
  
  const [showEpisodeUpload, setShowEpisodeUpload] = useState({});
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    coverImage: null,
    backgroundLink: '',
    quality: '',
    age: '',
    genres: [],
    runningTime: '',
    release_year: '',
    country: '',
    director: '',
    directors: [],
    actors: [],
    itemType: 'movie',
    videoSources: {
      '1080p': null,
      '720p': null,
      '480p': null,
      'hls': null
    },
    status: 'Visible',
    seasons: [
      {
        season_number: 1,
        title: '',
        info: '',
        episodes: [{
          episode_number: 1,
          title: '',
          airDate: '',
          videoSources: {
            '1080p': null,
            '720p': null,
            '480p': null,
            'hls': null
          }
        }]
      }
    ]
  });

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchItems());
    }
  }, [status, dispatch]);

  useEffect(() => {
    if (itemToEdit) {
      const getSanitizedSeasons = (seasonsData) => {
        if (!seasonsData || seasonsData.length === 0) {
          return [{
            season_number: 1,
            title: '',
            info: '',
            episodes: [{
              episode_number: 1,
              title: '',
              airDate: '',
              videoSources: {
                '1080p': null,
                '720p': null,
                '480p': null,
                'hls': null
              }
            }]
          }];
        }

        return seasonsData.map((season, sIdx) => ({
          season_number: season.season_number || sIdx + 1,
          title: season.title || '',
          info: season.info || '',
          episodes: (Array.isArray(season.episodes) && season.episodes.length > 0)
            ? season.episodes.map((episode, eIdx) => ({
              episode_number: episode.episode_number || eIdx + 1,
              title: episode.title || '',
              airDate: episode.air_date || episode.airDate || '',
              videoSources: {
                '1080p': null,
                '720p': null,
                '480p': null,
                'hls': null
              },
              existingVideoSource: episode.video_source // Lưu video source hiện tại
            }))
            : [{
              episode_number: 1,
              title: '',
              airDate: '',
              videoSources: {
                '1080p': null,
                '720p': null,
                '480p': null,
                'hls': null
              }
            }]
        }));
      };

      const sanitizedSeasons = getSanitizedSeasons(itemToEdit.seasons);
      const isMovie = itemToEdit.category === 'Movie' || !itemToEdit.seasons || itemToEdit.seasons.length === 0;

      setFormData({
        title: itemToEdit.title || '',
        description: itemToEdit.description || '',
        coverImage: null,
        backgroundLink: itemToEdit.background_image_url || '',
        quality: itemToEdit.quality || 'FullHD',
        age: itemToEdit.age_rating || '',
        genres: Array.isArray(itemToEdit.genres) ? [...itemToEdit.genres] : [],
        runningTime: itemToEdit.running_time || '',
        release_year: itemToEdit.release_year || '',
        country: isMovie 
          ? (typeof itemToEdit.country === 'string' ? itemToEdit.country : '')
          : (Array.isArray(itemToEdit.country) ? itemToEdit.country : []),
        director: isMovie
          ? (typeof itemToEdit.director === 'string' ? itemToEdit.director : '')
          : '',
        directors: !isMovie && Array.isArray(itemToEdit.directors) ? [...itemToEdit.directors] : [],
        actors: Array.isArray(itemToEdit.actors) ? [...itemToEdit.actors] : [],
        itemType: isMovie ? 'movie' : 'tvSeries',
        videoSources: {
          '1080p': null,
          '720p': null,
          '480p': null,
          'hls': null
        },
        existingVideoSource: itemToEdit.video_source, // Lưu video source hiện tại
        status: itemToEdit.status || 'Visible',
        seasons: sanitizedSeasons
      });

      setShowMovieUpload({
        '1080p': false,
        '720p': false,
        '480p': false,
        'hls': false
      });
      setShowEpisodeUpload({});
    }
  }, [itemToEdit]);

  useEffect(() => {
    if (!itemToEdit || !window.SlimSelect) {
      return;
    }

    slimSelectsRef.current.quality = new window.SlimSelect({ 
      select: '#quality', 
      settings: { showSearch: false } 
    });
    slimSelectsRef.current.genres = new window.SlimSelect({ select: '#genres' });
    slimSelectsRef.current.countries = new window.SlimSelect({ select: '#countries' });
    slimSelectsRef.current.director = new window.SlimSelect({ select: '#director' });
    slimSelectsRef.current.actors = new window.SlimSelect({ select: '#actors' });

    return () => {
      Object.values(slimSelectsRef.current).forEach(instance => {
        if (instance && instance.select && typeof instance.destroy === 'function') {
          instance.destroy();
        }
      });
      slimSelectsRef.current = {};
    };
  }, [itemToEdit]);

  useEffect(() => {
    if (!itemToEdit) return;

    if (slimSelectsRef.current.quality) {
      slimSelectsRef.current.quality.setSelected(formData.quality);
    }
    if (slimSelectsRef.current.genres) {
      slimSelectsRef.current.genres.setSelected(formData.genres);
    }
    if (slimSelectsRef.current.countries) {
      slimSelectsRef.current.countries.setSelected(
        formData.itemType === 'movie' ? [formData.country] : formData.country
      );
    }
    if (slimSelectsRef.current.director) {
      slimSelectsRef.current.director.setSelected(
        formData.itemType === 'movie' ? [formData.director] : formData.directors
      );
    }
    if (slimSelectsRef.current.actors) {
      slimSelectsRef.current.actors.setSelected(formData.actors);
    }
  }, [itemToEdit, formData.quality, formData.genres, formData.country, formData.director, formData.directors, formData.actors, formData.itemType]);

  const handleShowMovieUpload = (quality) => {
    setShowMovieUpload(prev => ({ ...prev, [quality]: true }));
  };

  const handleShowEpisodeUpload = (sIdx, eIdx, quality) => {
    const key = `s${sIdx}e${eIdx}-${quality}`;
    setShowEpisodeUpload(prev => ({ ...prev, [key]: true }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, field) => {
    setFormData(prev => ({ ...prev, [field]: e.target.files[0] }));
  };

  const handleVideoSourceUpload = (quality, file) => {
    setFormData(prev => ({
      ...prev,
      videoSources: {
        ...prev.videoSources,
        [quality]: file
      }
    }));
  };

  const handleEpisodeVideoSourceUpload = (sIdx, eIdx, quality, file) => {
    const seasons = [...formData.seasons];
    seasons[sIdx].episodes[eIdx].videoSources[quality] = file;
    setFormData(prev => ({ ...prev, seasons }));
  };

  const handleMultiSelectChange = (e, field) => {
    const selected = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prev => ({ ...prev, [field]: selected }));
  };

  const addSeason = () => {
    setFormData(prev => ({
      ...prev,
      seasons: [
        ...prev.seasons,
        {
          season_number: prev.seasons.length + 1,
          title: '',
          info: '',
          episodes: [{
            episode_number: 1,
            title: '',
            airDate: '',
            videoSources: {
              '1080p': null,
              '720p': null,
              '480p': null,
              'hls': null
            }
          }]
        }
      ]
    }));
  };

  const removeSeason = (sIdx) => {
    const updatedSeasons = formData.seasons.filter((_, index) => index !== sIdx);
    const renumberedSeasons = updatedSeasons.map((season, index) => ({
      ...season,
      season_number: index + 1
    }));
    setFormData(prev => ({ ...prev, seasons: renumberedSeasons }));
  };

  const addEpisode = (sIdx) => {
    const seasons = [...formData.seasons];
    seasons[sIdx].episodes.push({
      episode_number: seasons[sIdx].episodes.length + 1,
      title: '',
      airDate: '',
      videoSources: {
        '1080p': null,
        '720p': null,
        '480p': null,
        'hls': null
      }
    });
    setFormData(prev => ({ ...prev, seasons }));
  };

  const removeEpisode = (sIdx, eIdx) => {
    const seasons = [...formData.seasons];
    seasons[sIdx].episodes.splice(eIdx, 1);
    const renumberedEpisodes = seasons[sIdx].episodes.map((ep, idx) => ({
      ...ep,
      episode_number: idx + 1
    }));
    seasons[sIdx].episodes = renumberedEpisodes;
    setFormData(prev => ({ ...prev, seasons }));
  };

  const handleSeasonChange = (sIdx, field, value) => {
    const seasons = [...formData.seasons];
    seasons[sIdx][field] = value;
    setFormData(prev => ({ ...prev, seasons }));
  };

  const handleEpisodeChange = (sIdx, eIdx, field, value) => {
    const seasons = [...formData.seasons];
    seasons[sIdx].episodes[eIdx][field] = value;
    setFormData(prev => ({ ...prev, seasons }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = await transformFormData(formData, itemToEdit);
      await dispatch(updateItem({ id: itemToEdit._id || itemToEdit.id, data: payload })).unwrap();

      alert("Item updated successfully!");
      navigate("/admin/catalog", { replace: true });
      dispatch(fetchItems());

    } catch (err) {
      alert(`Error: ${err.message || "Unknown error"}`);
    }
  };

  if (!itemToEdit) {
    return <div>Loading item data...</div>;
  }

  const qualities = ['1080p', '720p', '480p', 'hls'];

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="main__title">
            <h2>Edit Item</h2>
          </div>
        </div>

        <div className="col-12">
          <form onSubmit={handleSubmit} className="sign__form sign__form--add">
            <div className="row">
              {/* Left Column */}
              <div className="col-12 col-xl-7">
                <div className="row">
                  <div className="col-12">
                    <div className="sign__group">
                      <input type="text" className="sign__input" placeholder="Title" name="title" value={formData.title} onChange={handleInputChange} required />
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="sign__group">
                      <textarea id="text" name="description" className="sign__textarea" placeholder="Description" value={formData.description} onChange={handleInputChange} required></textarea>
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <div className="sign__group">
                      <div className="sign__gallery">
                        <label id="gallery1" htmlFor="sign__gallery-upload">
                          Upload cover (240x340)
                          {formData.coverImage && ` - ${formData.coverImage.name}`}
                        </label>
                        <input data-name="#gallery1" id="sign__gallery-upload" name="coverImage" className="sign__gallery-upload" type="file" accept=".png, .jpg, .jpeg" onChange={(e) => handleFileChange(e, 'coverImage')} />
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <div className="sign__group">
                      <input
                        type="text"
                        className="sign__input"
                        placeholder="Link to the background (1920x1280)"
                        name="backgroundLink"
                        value={formData.backgroundLink}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="col-12 col-xl-5">
                <div className="row">
                  <div className="col-12 col-md-6">
                    <div className="sign__group">
                      <select className="sign__selectjs" id="quality" name="quality" value={formData.quality} onChange={handleInputChange}>
                        <option value="FullHD">FullHD</option>
                        <option value="HD 1080">HD 1080</option>
                        <option value="HD 720">HD 720</option>
                        <option value="DVD">DVD</option>
                        <option value="TS">TS</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <div className="sign__group">
                      <input type="text" className="sign__input" placeholder="Age" name="age" value={formData.age} onChange={handleInputChange} />
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="sign__group">
                      <select className="sign__selectjs" id="genres" multiple value={formData.genres} onChange={(e) => handleMultiSelectChange(e, 'genres')}>
                        <option value="Action">Action</option>
                        <option value="Animation">Animation</option>
                        <option value="Comedy">Comedy</option>
                        <option value="Crime">Crime</option>
                        <option value="Drama">Drama</option>
                        <option value="Fantasy">Fantasy</option>
                        <option value="Historical">Historical</option>
                        <option value="Horror">Horror</option>
                        <option value="Romance">Romance</option>
                        <option value="Science-fiction">Science-fiction</option>
                        <option value="Thriller">Thriller</option>
                        <option value="Western">Western</option>
                      </select>
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <div className="sign__group">
                      <input type="text" className="sign__input" placeholder="Running time" name="runningTime" value={formData.runningTime} onChange={handleInputChange} />
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <div className="sign__group">
                      <input
                        type="date"
                        className="sign__input"
                        placeholder="Premiere date"
                        name="release_year"
                        value={
                          formData.release_year
                            ? new Date(formData.release_year).toISOString().split("T")[0]
                            : ""
                        }
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="sign__group">
                      <label htmlFor="countries" className="sign__label">
                        Country {formData.itemType === 'movie' && '(Single)'}
                      </label>
                      <select
                        className="sign__selectjs"
                        id="countries"
                        name="country"
                        value={formData.country}
                        onChange={formData.itemType === 'movie' ? handleInputChange : (e) => handleMultiSelectChange(e, 'country')}
                        multiple={formData.itemType === 'tvSeries'}
                      >
                        <option value="United States">United States</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Canada">Canada</option>
                        <option value="Vietnam">Vietnam</option>
                        <option value="Japan">Japan</option>
                        <option value="South Korea">South Korea</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Item Type */}
              <div className="col-12">
                <div className="sign__group">
                  <label className="sign__label">Item type:</label>
                  <ul className="sign__radio">
                    <li>
                      <input id="type1" type="radio" name="itemType" value="movie" checked={formData.itemType === 'movie'} onChange={handleInputChange} disabled />
                      <label htmlFor="type1">Movie</label>
                    </li>
                    <li>
                      <input id="type2" type="radio" name="itemType" value="tvSeries" checked={formData.itemType === 'tvSeries'} onChange={handleInputChange} disabled />
                      <label htmlFor="type2">TV Series</label>
                    </li>
                  </ul>
                  <p style={{ fontSize: '12px', color: '#999', marginTop: '5px' }}>
                    Item type cannot be changed when editing
                  </p>
                </div>
              </div>

              {/* Directors and Actors */}
              <div className="col-12 col-md-6 col-xl-4">
                <div className="sign__group">
                  <label className="sign__label">
                    {formData.itemType === 'movie' ? 'Director (Single)' : 'Directors (Multiple)'}
                  </label>
                  <select 
                    className="sign__selectjs" 
                    id="director" 
                    name={formData.itemType === 'movie' ? 'director' : 'directors'}
                    value={formData.itemType === 'movie' ? formData.director : formData.directors}
                    onChange={formData.itemType === 'movie' ? handleInputChange : (e) => handleMultiSelectChange(e, 'directors')}
                    multiple={formData.itemType === 'tvSeries'}
                  >
                    <option value="Matt Jones">Matt Jones</option>
                    <option value="Gene Graham">Gene Graham</option>
                    <option value="Rosa Lee">Rosa Lee</option>
                    <option value="Brian Cranston">Brian Cranston</option>
                  </select>
                </div>
              </div>

              <div className="col-12 col-md-6 col-xl-8">
                <div className="sign__group">
                  <label className="sign__label">Actors (Multiple)</label>
                  <select className="sign__selectjs" id="actors" multiple value={formData.actors} onChange={(e) => handleMultiSelectChange(e, 'actors')}>
                    <option value="Matt Jones">Matt Jones</option>
                    <option value="Gene Graham">Gene Graham</option>
                    <option value="Rosa Lee">Rosa Lee</option>
                    <option value="Brian Cranston">Brian Cranston</option>
                    <option value="Tess Harper">Tess Harper</option>
                  </select>
                </div>
              </div>

              {/* Status */}
              <div className='col-12'>
                <div className='sign__group'>
                  <label className="sign__label">Status</label>
                  <select
                    className="sign__select"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="Visible">Visible</option>
                    <option value="Hidden">Hidden</option>
                  </select>
                </div>
              </div>

              {/* Movie Upload - Multiple Qualities */}
              {formData.itemType === 'movie' && (
                <div className="col-12">
                  <div className="sign__group">
                    <label className="sign__label">Video Sources (Multiple Qualities)</label>
                    <p style={{ fontSize: '14px', color: '#999', marginBottom: '15px' }}>
                      Update or add videos in different qualities
                    </p>
                  </div>

                  <div className="row">
                    {qualities.map((quality) => {
                      const hasExisting = formData.existingVideoSource?.sources?.[quality];
                      const showUpload = showMovieUpload[quality];

                      return (
                        <div key={quality} className="col-12 col-md-6 col-lg-3">
                          {hasExisting && !showUpload ? (
                            <div className="sign__group" style={{ marginBottom: '15px' }}>
                              <p style={{ margin: '0 0 10px 0', fontSize: '14px' }}>
                                <strong>{quality.toUpperCase()}</strong>: Uploaded ✓
                              </p>
                              <button 
                                type="button" 
                                className="sign__btn sign__btn--small" 
                                onClick={() => handleShowMovieUpload(quality)}
                                style={{ width: '100%' }}
                              >
                                <span>Change</span>
                              </button>
                            </div>
                          ) : (
                            <div className="sign__video">
                              <label id={`movie-${quality}`} htmlFor={`sign__video-upload-${quality}`}>
                                {quality.toUpperCase()}
                                {formData.videoSources[quality] && ` - ${formData.videoSources[quality].name}`}
                              </label>
                              <input 
                                data-name={`#movie-${quality}`} 
                                id={`sign__video-upload-${quality}`} 
                                className="sign__video-upload" 
                                type="file" 
                                accept={quality === 'hls' ? '.m3u8,application/x-mpegURL' : 'video/mp4,video/x-m4v,video/*'}
                                onChange={(e) => handleVideoSourceUpload(quality, e.target.files[0])} 
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TV Series Seasons */}
              {formData.itemType === 'tvSeries' && (
                <div className="col-12">
                  {formData.seasons.map((season, sIdx) => (
                    <div key={sIdx} className="sign__season">
                      <div className="sign__season-head">
                        <div className="row">
                          <div className="col-12 col-md-8 col-xl-6">
                            <div className="sign__group">
                              <input type="text" className="sign__input" placeholder={`Season ${season.season_number} title`} value={season.title} onChange={(e) => handleSeasonChange(sIdx, 'title', e.target.value)} />
                            </div>
                          </div>
                          <div className="col-12 col-sm-6 col-md-4 col-xl-4">
                            <div className="sign__group">
                              <input type="text" className="sign__input" placeholder="Season info" value={season.info} onChange={(e) => handleSeasonChange(sIdx, 'info', e.target.value)} />
                            </div>
                          </div>
                          <div className="col-12 col-md-4 col-xl-2">
                            {formData.seasons.length > 1 && (
                              <button className="sign__delete" type="button" onClick={() => removeSeason(sIdx)}>
                                <i className="ti ti-x"></i>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {season.episodes.map((ep, eIdx) => (
                        <div key={eIdx} className="sign__episode">
                          <div className="row">
                            <div className="col-12">
                              <span className="sign__episode-title">Episode #{ep.episode_number}</span>
                              {season.episodes.length > 1 && (
                                <button className="sign__delete" type="button" onClick={() => removeEpisode(sIdx, eIdx)}>
                                  <i className="ti ti-x"></i>
                                </button>
                              )}
                            </div>
                            <div className="col-12 col-md-6">
                              <div className="sign__group">
                                <input type="text" className="sign__input" placeholder={`Episode title ${ep.episode_number}`} value={ep.title} onChange={(e) => handleEpisodeChange(sIdx, eIdx, 'title', e.target.value)} />
                              </div>
                            </div>
                            <div className="col-12 col-md-6">
                              <div className="sign__group">
                                <input
                                  type="date"
                                  className="sign__input"
                                  placeholder="Air date"
                                  value={ep.airDate ? new Date(ep.airDate).toISOString().split("T")[0] : ""}
                                  onChange={(e) => handleEpisodeChange(sIdx, eIdx, "airDate", e.target.value)}
                                />
                              </div>
                            </div>

                            {/* Episode Videos - Multiple Qualities */}
                            <div className="col-12">
                              <label className="sign__label" style={{ fontSize: '14px', marginBottom: '10px' }}>
                                Episode Videos (Multiple Qualities)
                              </label>
                            </div>

                            {qualities.map((quality) => {
                              const uploadKey = `s${sIdx}e${eIdx}-${quality}`;
                              const hasExisting = ep.existingVideoSource?.sources?.[quality];
                              const showUpload = showEpisodeUpload[uploadKey];

                              return (
                                <div key={quality} className="col-12 col-sm-6 col-md-3">
                                  {hasExisting && !showUpload ? (
                                    <div className="sign__group" style={{ marginBottom: '15px' }}>
                                      <p style={{ margin: '0 0 5px 0', fontSize: '12px' }}>
                                        <strong>{quality.toUpperCase()}</strong>: ✓
                                      </p>
                                      <button 
                                        type="button" 
                                        className="sign__btn sign__btn--small" 
                                        onClick={() => handleShowEpisodeUpload(sIdx, eIdx, quality)}
                                        style={{ width: '100%', padding: '5px' }}
                                      >
                                        <span style={{ fontSize: '12px' }}>Change</span>
                                      </button>
                                    </div>
                                  ) : (
                                    <div className="sign__video">
                                      <label id={uploadKey} htmlFor={`sign__video-upload-${uploadKey}`}>
                                        {quality.toUpperCase()}
                                        {ep.videoSources[quality] && ` ✓`}
                                      </label>
                                      <input 
                                        data-name={`#${uploadKey}`} 
                                        id={`sign__video-upload-${uploadKey}`} 
                                        type="file" 
                                        accept={quality === 'hls' ? '.m3u8,application/x-mpegURL' : 'video/mp4,video/x-m4v,video/*'}
                                        onChange={(e) => handleEpisodeVideoSourceUpload(sIdx, eIdx, quality, e.target.files[0])} 
                                      />
                                    </div>
                                  )}
                                </div>
                              );
                            })}

                            {eIdx === season.episodes.length - 1 && (
                              <div className="col-12" style={{ marginTop: '15px' }}>
                                <button type="button" className="sign__btn sign__btn--add" onClick={() => addEpisode(sIdx)}>
                                  <span>add episode</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                  <div className="col-12">
                    <button type="button" className="sign__btn sign__btn--add" onClick={addSeason}>
                      <span>add season</span>
                    </button>
                  </div>
                </div>
              )}

              <div className="col-12">
                <button type="submit" className="sign__btn sign__btn--small" disabled={isSubmitting}>
                  <span>{isSubmitting ? 'Updating...' : 'Update Item'}</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditItemPage;