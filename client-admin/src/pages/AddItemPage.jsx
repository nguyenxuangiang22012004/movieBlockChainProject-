import React, { useState, useEffect, useRef } from 'react';
import { create } from 'kubo-rpc-client';
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
    premiereDate: '',
    countries: [],
    directors: [],
    actors: [],
    itemType: 'movie',
    video: null,
    seasons: [
      {
        title: '',
        info: '',
        episodes: [
          {
            title: '',
            airDate: '',
            video: null
          }
        ]
      }
    ]
  });

  // Refs để lưu trữ các instance của SlimSelect
  const qualitySelectRef = useRef(null);
  const genreSelectRef = useRef(null);
  const countrySelectRef = useRef(null);
  const directorSelectRef = useRef(null);
  const actorsSelectRef = useRef(null);

  useEffect(() => {
    // Khởi tạo tất cả các select của SlimSelect
    if (window.SlimSelect) {
      qualitySelectRef.current = new window.SlimSelect({
        select: '#sign__quality',
        settings: { showSearch: false }
      });
      genreSelectRef.current = new window.SlimSelect({ select: '#sign__genre' });
      countrySelectRef.current = new window.SlimSelect({ select: '#sign__country' });
      directorSelectRef.current = new window.SlimSelect({ select: '#sign__director' });
      actorsSelectRef.current = new window.SlimSelect({ select: '#sign__actors' });
    }

    // Hàm dọn dẹp để hủy các instance khi component unmount
    return () => {
      if (qualitySelectRef.current) qualitySelectRef.current.destroy();
      if (genreSelectRef.current) genreSelectRef.current.destroy();
      if (countrySelectRef.current) countrySelectRef.current.destroy();
      if (directorSelectRef.current) directorSelectRef.current.destroy();
      if (actorsSelectRef.current) actorsSelectRef.current.destroy();
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = (e, fieldName) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      [fieldName]: file
    }));
  };

  const handleMultiSelectChange = (e, fieldName) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prev => ({
      ...prev,
      [fieldName]: selectedOptions
    }));
  };


  const addSeason = () => {
    setFormData(prev => ({
      ...prev,
      seasons: [
        ...prev.seasons,
        {
          title: '',
          info: '',
          episodes: [
            {
              title: '',
              airDate: '',
              video: null
            }
          ]
        }
      ]
    }));
  };

  const addEpisode = (seasonIndex) => {
    const updatedSeasons = [...formData.seasons];
    updatedSeasons[seasonIndex].episodes.push({
      title: '',
      airDate: '',
      video: null
    });

    setFormData(prev => ({
      ...prev,
      seasons: updatedSeasons
    }));
  };

  const removeEpisode = (seasonIndex, episodeIndex) => {
    const updatedSeasons = [...formData.seasons];
    updatedSeasons[seasonIndex].episodes.splice(episodeIndex, 1);

    setFormData(prev => ({
      ...prev,
      seasons: updatedSeasons
    }));
  };

  const handleSeasonChange = (seasonIndex, field, value) => {
    const updatedSeasons = [...formData.seasons];
    updatedSeasons[seasonIndex][field] = value;

    setFormData(prev => ({
      ...prev,
      seasons: updatedSeasons
    }));
  };

  const handleEpisodeChange = (seasonIndex, episodeIndex, field, value) => {
    const updatedSeasons = [...formData.seasons];
    updatedSeasons[seasonIndex].episodes[episodeIndex][field] = value;

    setFormData(prev => ({
      ...prev,
      seasons: updatedSeasons
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submissionData = { ...formData };

    try {
      if (submissionData.itemType === 'movie') {
        // Nếu là movie, gọi thunk addNewMovie
        await dispatch(addNewMovie(submissionData)).unwrap();
      } else {
        // Nếu là TV Series, gọi thunk addNewTVSeries
        await dispatch(addNewTVSeries(submissionData)).unwrap();
      }

      alert('Item added successfully!');
      navigate('/admin/catalog');

    } catch (err) {
      // err bây giờ sẽ là payload từ rejectWithValue
      console.error('Failed to save the item: ', err);
      // Hiển thị lỗi một cách thân thiện hơn
      alert(`Error: ${err || 'An unknown error occurred'}`);
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
              {/* Left Column */}
              <div className="col-12 col-xl-7">
                <div className="row">
                  <div className="col-12">
                    <div className="sign__group">
                      <input
                        type="text"
                        className="sign__input"
                        placeholder="Title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="sign__group">
                      <textarea
                        id="text"
                        name="description"
                        className="sign__textarea"
                        placeholder="Description"
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                      ></textarea>
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <div className="sign__group">
                      <div className="sign__gallery">
                        <label id="gallery1" htmlFor="sign__gallery-upload">
                          Upload cover (240x340)
                          {formData.coverImage && ` - ${formData.coverImage.name}`}
                        </label>
                        <input
                          data-name="#gallery1"
                          id="sign__gallery-upload"
                          name="coverImage"
                          className="sign__gallery-upload"
                          type="file"
                          accept=".png, .jpg, .jpeg"
                          onChange={(e) => handleFileUpload(e, 'coverImage')}
                        />
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
                      <select
                        className="sign__selectjs"
                        id="sign__quality"
                        name="quality"
                        value={formData.quality}
                        onChange={handleInputChange}
                      >
                        <option value="FULLHD">FULLHD</option>
                        <option value="HD 1080">HD 1080</option>
                        <option value="HD 720">HD 720</option>
                        <option value="DVD">DVD</option>
                        <option value="TS">TS</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <div className="sign__group">
                      <input
                        type="text"
                        className="sign__input"
                        placeholder="Age"
                        name="age"
                        value={formData.age}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="sign__group">
                      <select
                        className="sign__selectjs"
                        id="sign__genre"
                        multiple
                        value={formData.genres}
                        onChange={(e) => handleMultiSelectChange(e, 'genres')}
                      >
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
                        type="text"
                        className="sign__input"
                        placeholder="Running time"
                        name="runningTime"
                        value={formData.runningTime}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <div className="sign__group">
                      <input
                        type="text"
                        className="sign__input"
                        placeholder="Premiere date"
                        name="premiereDate"
                        value={formData.premiereDate}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="sign__group">
                      <select
                        className="sign__selectjs"
                        id="sign__country"
                        multiple
                        value={formData.countries}
                        onChange={(e) => handleMultiSelectChange(e, 'countries')}
                      >
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
                  <select
                    className="sign__selectjs"
                    id="sign__director"
                    multiple
                    value={formData.directors}
                    onChange={(e) => handleMultiSelectChange(e, 'directors')}
                  >
                    <option value="Matt Jones">Matt Jones</option>
                    <option value="Gene Graham">Gene Graham</option>
                    <option value="Rosa Lee">Rosa Lee</option>
                    <option value="Brian Cranston">Brian Cranston</option>
                    <option value="Tess Harper">Tess Harper</option>
                    <option value="Eliza Josceline">Eliza Josceline</option>
                    <option value="Otto Bree">Otto Bree</option>
                    <option value="Kathie Corl">Kathie Corl</option>
                    <option value="Georgiana Patti">Georgiana Patti</option>
                    <option value="Cong Duong">Cong Duong</option>
                    <option value="Felix Autumn">Felix Autumn</option>
                    <option value="Sophie Moore">Sophie Moore</option>
                  </select>
                </div>
              </div>

              <div className="col-12 col-md-6 col-xl-8">
                <div className="sign__group">
                  <label className="sign__label">Actors</label>
                  <select
                    className="sign__selectjs"
                    id="sign__actors"
                    multiple
                    value={formData.actors}
                    onChange={(e) => handleMultiSelectChange(e, 'actors')}
                  >
                    <option value="Matt Jones">Matt Jones</option>
                    <option value="Gene Graham">Gene Graham</option>
                    <option value="Rosa Lee">Rosa Lee</option>
                    <option value="Brian Cranston">Brian Cranston</option>
                    <option value="Tess Harper">Tess Harper</option>
                    <option value="Eliza Josceline">Eliza Josceline</option>
                    <option value="Otto Bree">Otto Bree</option>
                    <option value="Kathie Corl">Kathie Corl</option>
                    <option value="Georgiana Patti">Georgiana Patti</option>
                    <option value="Cong Duong">Cong Duong</option>
                    <option value="Felix Autumn">Felix Autumn</option>
                    <option value="Sophie Moore">Sophie Moore</option>
                  </select>
                </div>
              </div>

              {/* Item Type */}
              <div className="col-12">
                <div className="sign__group">
                  <label className="sign__label">Item type:</label>
                  <ul className="sign__radio">
                    <li>
                      <input
                        id="type1"
                        type="radio"
                        name="itemType"
                        value="movie"
                        checked={formData.itemType === 'movie'}
                        onChange={handleInputChange}
                      />
                      <label htmlFor="type1">Movie</label>
                    </li>
                    <li>
                      <input
                        id="type2"
                        type="radio"
                        name="itemType"
                        value="tvSeries"
                        checked={formData.itemType === 'tvSeries'}
                        onChange={handleInputChange}
                      />
                      <label htmlFor="type2">TV Series</label>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Movie Upload */}
              {formData.itemType === 'movie' && (
                <div className="col-12">
                  <div className="sign__video">
                    <label id="movie1" htmlFor="sign__video-upload">
                      Upload video
                      {formData.video && ` - ${formData.video.name}`}
                    </label>
                    <input
                      data-name="#movie1"
                      id="sign__video-upload"
                      name="video"
                      className="sign__video-upload"
                      type="file"
                      accept="video/mp4,video/x-m4v,video/*"
                      onChange={(e) => handleFileUpload(e, 'video')}
                    />
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
                          <div className="col-12">
                            <span className="sign__episode-title">Season #{seasonIndex + 1}</span>
                          </div>

                          <div className="col-12 col-sm-6 col-md-5 col-xl-6">
                            <div className="sign__group">
                              <input
                                type="text"
                                className="sign__input"
                                placeholder="Season title"
                                value={season.title}
                                onChange={(e) => handleSeasonChange(seasonIndex, 'title', e.target.value)}
                              />
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

                          <div className="col-12 col-sm-4 col-md-3 col-xl-2">
                            <button
                              type="button"
                              className="sign__btn sign__btn--add"
                              onClick={addSeason}
                            >
                              <span>add season</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {season.episodes.map((episode, episodeIndex) => (
                        <div key={episodeIndex} className="sign__episode">
                          <div className="row">
                            <div className="col-12">
                              <span className="sign__episode-title">Episode #{episodeIndex + 1}</span>
                              {episodeIndex > 0 && (
                                <button
                                  className="sign__delete"
                                  type="button"
                                  onClick={() => removeEpisode(seasonIndex, episodeIndex)}
                                >
                                  <i className="ti ti-x"></i>
                                </button>
                              )}
                            </div>

                            <div className="col-12 col-md-6">
                              <div className="sign__group">
                                <input
                                  type="text"
                                  className="sign__input"
                                  placeholder={`Episode title ${episodeIndex + 1}`}
                                  value={episode.title}
                                  onChange={(e) => handleEpisodeChange(seasonIndex, episodeIndex, 'title', e.target.value)}
                                />
                              </div>
                            </div>

                            <div className="col-12 col-md-6">
                              <div className="sign__group">
                                <input
                                  type="text"
                                  className="sign__input"
                                  placeholder="Air date"
                                  value={episode.airDate}
                                  onChange={(e) => handleEpisodeChange(seasonIndex, episodeIndex, 'airDate', e.target.value)}
                                />
                              </div>
                            </div>

                            <div className="col-12 col-sm-8 col-md-9 col-xl-10">
                              <div className="sign__video">
                                <label id={`s${seasonIndex}s${episodeIndex}`} htmlFor={`sign__video-upload-${seasonIndex}-${episodeIndex}`}>
                                  Upload episode {episodeIndex + 1}
                                  {episode.video && ` - ${episode.video.name}`}
                                </label>
                                <input
                                  data-name={`#s${seasonIndex}s${episodeIndex}`}
                                  id={`sign__video-upload-${seasonIndex}-${episodeIndex}`}
                                  name={`s${seasonIndex}s${episodeIndex}`}
                                  className="sign__video-upload"
                                  type="file"
                                  accept="video/mp4,video/x-m4v,video/*"
                                  onChange={(e) => {
                                    const file = e.target.files[0];
                                    handleEpisodeChange(seasonIndex, episodeIndex, 'video', file);
                                  }}
                                />
                              </div>
                            </div>

                            {episodeIndex === season.episodes.length - 1 && (
                              <div className="col-12 col-sm-4 col-md-3 col-xl-2">
                                <button
                                  type="button"
                                  className="sign__btn sign__btn--add"
                                  onClick={() => addEpisode(seasonIndex)}
                                >
                                  <span>add episode</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}

              {/* Submit Button */}
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