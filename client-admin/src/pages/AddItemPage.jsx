import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addNewMovie, addNewTVSeries } from '../redux/itemsSlice';

const AddItemPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { status, error } = useSelector((state) => state.items);
  const isSubmitting = status === 'loading';

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    coverImage: null,
    backgroundLink: '',
    quality: 'FullHD',
    age: '',
    genres: [],
    runningTime: '',
    release_year: '',
    country: [],
    directors: [],
    actors: [],
    itemType: 'movie',
    video: null,
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
          video: null
        }]
      }
    ]
  });

  const slimSelects = useRef({});

  useEffect(() => {
    if (window.SlimSelect) {
      const getMultiValues = (options) => options.map(option => option.value);

      slimSelects.current.quality = new window.SlimSelect({
        select: '#sign__quality',
        settings: { showSearch: false },
        events: {
          afterChange: (newVal) => setFormData(prev => ({ ...prev, quality: newVal[0]?.value || 'FullHD' }))
        }
      });
      slimSelects.current.genres = new window.SlimSelect({
        select: '#sign__genre',
        events: {
          afterChange: (newVal) => setFormData(prev => ({ ...prev, genres: getMultiValues(newVal) }))
        }
      });
      slimSelects.current.country = new window.SlimSelect({
        select: '#sign__country',
        events: {
          afterChange: (newVal) => setFormData(prev => ({ ...prev, country: getMultiValues(newVal) }))
        }
      });
      slimSelects.current.directors = new window.SlimSelect({
        select: '#sign__director',
        events: {
          afterChange: (newVal) => setFormData(prev => ({ ...prev, directors: getMultiValues(newVal) }))
        }
      });
      slimSelects.current.actors = new window.SlimSelect({
        select: '#sign__actors',
        events: {
          afterChange: (newVal) => setFormData(prev => ({ ...prev, actors: getMultiValues(newVal) }))
        }
      });
    }

    return () => {
      Object.values(slimSelects.current).forEach(select => select && select.destroy());
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e, fieldName) => {
    const file = e.target.files[0];
    setFormData(prev => ({ ...prev, [fieldName]: file }));
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
            video: null
          }]
        }
      ]
    }));
  };

  const removeSeason = (seasonIndex) => {
    const updatedSeasons = formData.seasons.filter((_, index) => index !== seasonIndex);
    const renumberedSeasons = updatedSeasons.map((season, index) => ({
      ...season,
      season_number: index + 1
    }));
    setFormData(prev => ({ ...prev, seasons: renumberedSeasons }));
  };

  const addEpisode = (seasonIndex) => {
    const newSeasons = formData.seasons.map((season, index) => {
      if (index !== seasonIndex) {
        return season;
      }
      return {
        ...season,
        episodes: [
          ...season.episodes,
          {
            episode_number: season.episodes.length + 1,
            title: '',
            airDate: '',
            video: null
          }
        ]
      };
    });
    setFormData(prev => ({ ...prev, seasons: newSeasons }));
  };

  const removeEpisode = (seasonIndex, episodeIndex) => {
    const newSeasons = formData.seasons.map((season, sIdx) => {
      if (sIdx !== seasonIndex) {
        return season;
      }
      const updatedEpisodes = season.episodes.filter((_, eIdx) => eIdx !== episodeIndex);
      const renumberedEpisodes = updatedEpisodes.map((episode, index) => ({
        ...episode,
        episode_number: index + 1
      }));
      return {
        ...season,
        episodes: renumberedEpisodes
      };
    });
    setFormData(prev => ({ ...prev, seasons: newSeasons }));
  };

  const handleSeasonChange = (seasonIndex, field, value) => {
  const newSeasons = formData.seasons.map((season, index) => {
    if (index !== seasonIndex) {
      return season;
    }
    return { ...season, [field]: value };
  });
  setFormData(prev => ({ ...prev, seasons: newSeasons }));
};

  const handleEpisodeChange = (seasonIndex, episodeIndex, field, value) => {
    const newSeasons = formData.seasons.map((season, sIdx) => {
      if (sIdx !== seasonIndex) {
        return season;
      }
      const newEpisodes = season.episodes.map((episode, eIdx) => {
        if (eIdx !== episodeIndex) {
          return episode;
        }
        return { ...episode, [field]: value };
      });
      return { ...season, episodes: newEpisodes };
    });
    setFormData(prev => ({ ...prev, seasons: newSeasons }));
  };

  const handleEpisodeFileChange = (seasonIndex, episodeIndex, file) => {
    const newSeasons = formData.seasons.map((season, sIdx) => {
      if (sIdx !== seasonIndex) {
        return season;
      }
      const newEpisodes = season.episodes.map((episode, eIdx) => {
        if (eIdx !== episodeIndex) {
          return episode;
        }
        return { ...episode, video: file };
      });
      return { ...season, episodes: newEpisodes };
    });
    setFormData(prev => ({ ...prev, seasons: newSeasons }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.itemType === 'movie') {
        await dispatch(addNewMovie(formData)).unwrap();
      } else {
        await dispatch(addNewTVSeries(formData)).unwrap();
      }
      alert('Item added successfully!');
      navigate('/admin/catalog');
    } catch (err) {
      console.error('Failed to save the item: ', err);
      alert(`Error: ${err.message || 'An unknown error occurred'}`);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="main__title">
            <h2>Add new item</h2>
          </div>
        </div>

        <div className="col-12">
          <form onSubmit={handleSubmit} className="sign__form sign__form--add">
            <div className="row">
              <div className="col-12 col-xl-7">
                <div className="row">
                  <div className="col-12">
                    <div className="sign__group">
                      <input type="text" className="sign__input" placeholder="Title" name="title" value={formData.title} onChange={handleInputChange} required />
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="sign__group">
                      <textarea id="text" name="description" className="sign__textarea" placeholder="Description" value={formData.description} onChange={handleInputChange} required ></textarea>
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <div className="sign__group">
                      <div className="sign__gallery">
                        <label id="gallery1" htmlFor="sign__gallery-upload"> Upload cover (240x340) {formData.coverImage && ` - ${formData.coverImage.name}`} </label>
                        <input data-name="#gallery1" id="sign__gallery-upload" name="coverImage" className="sign__gallery-upload" type="file" accept=".png, .jpg, .jpeg" onChange={(e) => handleFileUpload(e, 'coverImage')} />
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <div className="sign__group">
                      <input type="text" className="sign__input" placeholder="Link to the background (1920x1280)" name="backgroundLink" value={formData.backgroundLink} onChange={handleInputChange} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12 col-xl-5">
                <div className="row">
                  <div className="col-12 col-md-6">
                    <div className="sign__group">
                      <select className="sign__selectjs" id="sign__quality" name="quality">
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
                      <label htmlFor="sign__genre" className="sign__label">Genres</label>
                      <select className="sign__selectjs" id="sign__genre" multiple>
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
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <div className="sign__group">
                      <input
                        type="number"
                        className="sign__input"
                        placeholder="Running time (minutes)"
                        name="runningTime"
                        value={formData.runningTime}
                        onChange={handleInputChange}
                        min="1"
                      />
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
                        required
                      />
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="sign__group">
                      <label htmlFor="sign__country" className="sign__label">Country</label>
                      <select className="sign__selectjs" id="sign__country" multiple>
                        <option value="United States">United States</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Canada">Canada</option>
                        <option value="Australia">Australia</option>
                        <option value="Germany">Germany</option>
                        <option value="France">France</option>
                        <option value="Japan">Japan</option>
                        <option value="South Korea">South Korea</option>
                        <option value="India">India</option>
                        <option value="China">China</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              {/* Directors and Actors */}
              <div className="col-12 col-md-6 col-xl-4">
                <div className="sign__group">
                  <label className="sign__label">Directors</label>
                  <select className="sign__selectjs" id="sign__director" multiple>
                    <option value="Matt Jones">Matt Jones</option>
                    <option value="Gene Graham">Gene Graham</option>
                    <option value="Rosa Lee">Rosa Lee</option>
                    <option value="Brian Cranston">Brian Cranston</option>
                    <option value="Tess Harper">Tess Harper</option>
                  </select>
                </div>
              </div>
              <div className="col-12 col-md-6 col-xl-8">
                <div className="sign__group">
                  <label className="sign__label">Actors</label>
                  <select className="sign__selectjs" id="sign__actors" multiple>
                    <option value="Matt Jones">Matt Jones</option>
                    <option value="Gene Graham">Gene Graham</option>
                    <option value="Rosa Lee">Rosa Lee</option>
                    <option value="Brian Cranston">Brian Cranston</option>
                    <option value="Tess Harper">Tess Harper</option>
                  </select>
                </div>
              </div>

              {/* Item Type */}
              <div className="col-12">
                <div className="sign__group">
                  <label className="sign__label">Item type:</label>
                  <ul className="sign__radio">
                    <li> <input id="type1" type="radio" name="itemType" value="movie" checked={formData.itemType === 'movie'} onChange={handleInputChange} /> <label htmlFor="type1">Movie</label> </li>
                    <li> <input id="type2" type="radio" name="itemType" value="tvSeries" checked={formData.itemType === 'tvSeries'} onChange={handleInputChange} /> <label htmlFor="type2">TV Series</label> </li>
                  </ul>
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

              {/* Movie Upload */}
              {formData.itemType === 'movie' && (
                <div className="col-12">
                  <div className="sign__video">
                    <label id="movie1" htmlFor="sign__video-upload"> Upload video {formData.video && ` - ${formData.video.name}`} </label>
                    <input data-name="#movie1" id="sign__video-upload" name="video" className="sign__video-upload" type="file" accept="video/mp4,video/x-m4v,video/*" onChange={(e) => handleFileUpload(e, 'video')} />
                  </div>
                </div>
              )}

              {/* TV Series Seasons */}
              {formData.itemType === 'tvSeries' && (
                <div className="col-12">
                  {formData.seasons.map((season, seasonIndex) => (
                    <div key={seasonIndex} className="sign__season">
                      <div className="sign__season-head">
                        <div className="row">
                          <div className="col-12 col-md-8 col-xl-6">
                            <div className="sign__group">
                              <input type="text" className="sign__input" placeholder={`Season ${season.season_number} title`} value={season.title} onChange={(e) => handleSeasonChange(seasonIndex, 'title', e.target.value)} />
                            </div>
                          </div>
                          <div className="col-12 col-sm-6 col-md-4 col-xl-4">
                            <div className="sign__group">
                              <input
                                type="text"
                                className="sign__input"
                                placeholder="Season info"
                                value={season.info}
                                onChange={(e) => handleSeasonChange(seasonIndex, 'info', e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="col-12 col-md-4 col-xl-2">
                            {formData.seasons.length > 1 && (
                              <button className="sign__delete" type="button" onClick={() => removeSeason(seasonIndex)}>
                                <i className="ti ti-x"></i>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {season.episodes.map((episode, episodeIndex) => (
                        <div key={episodeIndex} className="sign__episode">
                          <div className="row">
                            <div className="col-12">
                              <span className="sign__episode-title">Episode #{episode.episode_number}</span>
                              {season.episodes.length > 1 && (
                                <button className="sign__delete" type="button" onClick={() => removeEpisode(seasonIndex, episodeIndex)}>
                                  <i className="ti ti-x"></i>
                                </button>
                              )}
                            </div>
                            <div className="col-12 col-md-6">
                              <div className="sign__group">
                                <input type="text" className="sign__input" placeholder={`Episode title ${episode.episode_number}`} value={episode.title} onChange={(e) => handleEpisodeChange(seasonIndex, episodeIndex, 'title', e.target.value)} />
                              </div>
                            </div>
                            <div className="col-12 col-md-6">
                              <div className="sign__group">
                                <input
                                  type="date"
                                  className="sign__input"
                                  placeholder="Air date"
                                  value={episode.airDate}
                                  onChange={(e) =>
                                    handleEpisodeChange(seasonIndex, episodeIndex, 'airDate', e.target.value)
                                  }
                                />
                              </div>
                            </div>
                            <div className="col-12 col-sm-8 col-md-9 col-xl-10">
                              <div className="sign__video">
                                <label id={`s${seasonIndex}e${episodeIndex}`} htmlFor={`sign__video-upload-${seasonIndex}-${episodeIndex}`}>
                                  Upload episode {episode.episode_number}
                                  {episode.video && ` - ${episode.video.name}`}
                                </label>
                                <input data-name={`#s${seasonIndex}e${episodeIndex}`} id={`sign__video-upload-${seasonIndex}-${episodeIndex}`} type="file" accept="video/mp4,video/x-m4v,video/*" onChange={(e) => handleEpisodeFileChange(seasonIndex, episodeIndex, e.target.files[0])} />
                              </div>
                            </div>
                            {episodeIndex === season.episodes.length - 1 && (
                              <div className="col-12 col-sm-4 col-md-3 col-xl-2">
                                <button type="button" className="sign__btn sign__btn--add" onClick={() => addEpisode(seasonIndex)}>
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
                  <span>{isSubmitting ? 'Publishing...' : 'Publish'}</span>
                </button>
              </div>
              {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddItemPage;