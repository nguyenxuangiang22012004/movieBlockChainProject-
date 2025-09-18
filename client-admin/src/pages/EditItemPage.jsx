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
    actors: [],
    itemType: 'movie',
    video: null,
    seasons: [
      {
        title: '',
        info: '',
        episodes: [{ title: '', airDate: '', video: null }]
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
          return [{ title: '', info: '', episodes: [{ title: '', airDate: '', video: null }] }];
        }
        return seasonsData.map(season => ({
          ...season,
          episodes: (Array.isArray(season.episodes) && season.episodes.length > 0)
            ? season.episodes
            : [{ title: '', airDate: '', video: null }]
        }));
      };

      const sanitizedSeasons = getSanitizedSeasons(itemToEdit.seasons);
      setFormData({
        title: itemToEdit.title || '',
        description: itemToEdit.description || '',
        coverImage: null,
        backgroundLink: itemToEdit.background_image_url || '',
        quality: itemToEdit.quality || 'FULLHD',
        age: itemToEdit.age_rating || '',
        genres: Array.isArray(itemToEdit.genres) ? itemToEdit.genres : [],
        runningTime: itemToEdit.running_time || '',
        release_year: itemToEdit.release_year || '',
        country: Array.isArray(itemToEdit.country) ? itemToEdit.country[0] || '' : (itemToEdit.country || ''),
        director: Array.isArray(itemToEdit.director) ? itemToEdit.director[0] || '' : (itemToEdit.director || ''),
        actors: Array.isArray(itemToEdit.actors) ? itemToEdit.actors : [],
        itemType: (Array.isArray(itemToEdit.seasons) && itemToEdit.seasons.length > 0) ? 'tvSeries' : 'movie',
        video: null,
        seasons: sanitizedSeasons
      });
    }
  }, [itemToEdit]);

  useEffect(() => {
    if (!itemToEdit || !window.SlimSelect) {
      return;
    }

    // Khởi tạo các instance
    slimSelectsRef.current.genres = new window.SlimSelect({ select: '#genres' });
    slimSelectsRef.current.director = new window.SlimSelect({ select: '#director' });
    slimSelectsRef.current.actors = new window.SlimSelect({ select: '#actors' });
    slimSelectsRef.current.quality = new window.SlimSelect({ select: '#quality', settings: { showSearch: false } });
    slimSelectsRef.current.countries = new window.SlimSelect({ select: '#countries' });

    // Hàm dọn dẹp: Sẽ chạy khi component unmount
    return () => {
      Object.values(slimSelectsRef.current).forEach(instance => {
        if (instance && typeof instance.destroy === 'function') {
          instance.destroy();
        }
      });
      slimSelectsRef.current = {};
    };
  }, [itemToEdit]); // Chỉ chạy một lần khi itemToEdit có dữ liệu

  // Hook 2: Chỉ để cập nhật giá trị cho SlimSelect khi formData thay đổi
  useEffect(() => {
    if (!itemToEdit) return;

    // Sử dụng phương thức chính xác: setSelected()
    if (slimSelectsRef.current.genres) {
      slimSelectsRef.current.genres.setSelected(formData.genres);
    }
    if (slimSelectsRef.current.director) {
      slimSelectsRef.current.director.setSelected(formData.director);
    }
    if (slimSelectsRef.current.actors) {
      slimSelectsRef.current.actors.setSelected(formData.actors);
    }
    if (slimSelectsRef.current.quality) {
      slimSelectsRef.current.quality.setSelected(formData.quality);
    }
    if (slimSelectsRef.current.countries) {
      slimSelectsRef.current.countries.setSelected(formData.country);
    }
  }, [itemToEdit, formData.genres, formData.director, formData.actors, formData.quality, formData.country]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, field) => {
    setFormData(prev => ({ ...prev, [field]: e.target.files[0] }));
  };

  const handleEpisodeFileChange = (sIdx, eIdx, file) => {
    const seasons = [...formData.seasons];
    seasons[sIdx].episodes[eIdx].video = file;
    setFormData(prev => ({ ...prev, seasons }));
  };

  const handleMultiSelectChange = (e, field) => {
    const selected = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prev => ({ ...prev, [field]: selected }));
  };

  const addSeason = () => {
    setFormData(prev => ({
      ...prev,
      seasons: [...prev.seasons, { title: '', info: '', episodes: [{ title: '', airDate: '', video: null }] }]
    }));
  };

  const removeSeason = (sIdx) => {
    const seasons = [...formData.seasons];
    seasons.splice(sIdx, 1);
    setFormData(prev => ({ ...prev, seasons }));
  };

  const addEpisode = (sIdx) => {
    const seasons = [...formData.seasons];
    seasons[sIdx].episodes.push({ title: '', airDate: '', video: null });
    setFormData(prev => ({ ...prev, seasons }));
  };

  const removeEpisode = (sIdx, eIdx) => {
    const seasons = [...formData.seasons];
    seasons[sIdx].episodes.splice(eIdx, 1);
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
      navigate("/admin/catalog");
    } catch (err) {
      alert(`Error: ${err.message || "Unknown error"}`);
    }
  };

  if (!itemToEdit) {
    return <div>Loading item data...</div>;
  }

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
                      <select
                        className="sign__selectjs"
                        id="countries"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                      >
                        <option value="United States">United States</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Canada">Canada</option>
                        <option value="Vietnam">Vietnam</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Directors and Actors */}
              <div className="col-12 col-md-6 col-xl-4">
                <div className="sign__group">
                  <select className="sign__selectjs" id="director" name="director" value={formData.director} onChange={handleInputChange}>
                    <option value="Matt Jones">Matt Jones</option>
                    <option value="Gene Graham">Gene Graham</option>
                  </select>
                </div>
              </div>

              <div className="col-12 col-md-6 col-xl-8">
                <div className="sign__group">
                  <select className="sign__selectjs" id="actors" multiple value={formData.actors} onChange={(e) => handleMultiSelectChange(e, 'actors')}>
                    <option value="Matt Jones">Matt Jones</option>
                    <option value="Gene Graham">Gene Graham</option>
                  </select>
                </div>
              </div>

              {/* Item Type */}
              <div className="col-12">
                <div className="sign__group">
                  <ul className="sign__radio">
                    <li>
                      <input id="type1" type="radio" name="itemType" value="movie" checked={formData.itemType === 'movie'} onChange={handleInputChange} />
                      <label htmlFor="type1">Movie</label>
                    </li>
                    <li>
                      <input id="type2" type="radio" name="itemType" value="tvSeries" checked={formData.itemType === 'tvSeries'} onChange={handleInputChange} />
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
                    <input data-name="#movie1" id="sign__video-upload" name="video" className="sign__video-upload" type="file" accept="video/mp4,video/x-m4v,video/*" onChange={(e) => handleFileChange(e, 'video')} />
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
                          <div className="col-12 col-sm-6 col-md-5 col-xl-6">
                            <div className="sign__group">
                              <input type="text" className="sign__input" placeholder="Season title" value={season.title} onChange={(e) => handleSeasonChange(sIdx, 'title', e.target.value)} />
                            </div>
                          </div>
                          <div className="col-12 col-sm-6 col-md-4 col-xl-4">
                            <div className="sign__group">
                              <input type="text" className="sign__input" placeholder="Season info" value={season.info} onChange={(e) => handleSeasonChange(sIdx, 'info', e.target.value)} />
                            </div>
                          </div>
                          <div className="col-12 col-sm-4 col-md-3 col-xl-2">
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
                              <span className="sign__episode-title">Episode #{eIdx + 1}</span>
                              {season.episodes.length > 1 && (
                                <button className="sign__delete" type="button" onClick={() => removeEpisode(sIdx, eIdx)}>
                                  <i className="ti ti-x"></i>
                                </button>
                              )}
                            </div>
                            <div className="col-12 col-md-6">
                              <div className="sign__group">
                                <input type="text" className="sign__input" placeholder={`Episode title ${eIdx + 1}`} value={ep.title} onChange={(e) => handleEpisodeChange(sIdx, eIdx, 'title', e.target.value)} />
                              </div>
                            </div>
                            <div className="col-12 col-md-6">
                              <div className="sign__group">
                                <input type="text" className="sign__input" placeholder="Air date" value={ep.airDate} onChange={(e) => handleEpisodeChange(sIdx, eIdx, 'airDate', e.target.value)} />
                              </div>
                            </div>
                            <div className="col-12 col-sm-8 col-md-9 col-xl-10">
                              <div className="sign__video">
                                <label id={`s${sIdx}e${eIdx}`} htmlFor={`sign__video-upload-${sIdx}-${eIdx}`}>
                                  Upload episode {eIdx + 1}
                                  {ep.video && typeof ep.video === 'object' && ` - ${ep.video.name}`}
                                </label>
                                <input data-name={`#s${sIdx}e${eIdx}`} id={`sign__video-upload-${sIdx}-${eIdx}`} type="file" accept="video/mp4,video/x-m4v,video/*" onChange={(e) => handleEpisodeFileChange(sIdx, eIdx, e.target.files[0])} />
                              </div>
                            </div>
                            {eIdx === season.episodes.length - 1 && (
                              <div className="col-12 col-sm-4 col-md-3 col-xl-2">
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