export async function transformFormData(formData, oldData) {
  const base = {
    title: formData.title || oldData.title,
    description: formData.description || oldData.description,
    cover_image_url: formData.coverImage || oldData.cover_image_url,
    background_image_url: formData.backgroundLink || oldData.background_image_url,
    release_year: formData.premiereDate || oldData.release_year,
    running_time: formData.runningTime || oldData.running_time,
    age_rating: formData.age || oldData.age_rating,
    quality: formData.quality || oldData.quality,
    genres: Array.isArray(formData.genres) && formData.genres.length > 0 ? formData.genres : oldData.genres,
    director: Array.isArray(formData.directors) && formData.directors.length > 0 ? formData.directors[0] : oldData.director,
    cast: Array.isArray(formData.actors) && formData.actors.length > 0 ? formData.actors : oldData.cast,
    country: Array.isArray(formData.countries) && formData.countries.length > 0 ? formData.countries[0] : oldData.country,
  };

  if (formData.itemType === "movie") {
    return {
      ...base,
      video_source: {
        cid: formData.video || oldData.video_source?.cid,
      },
    };
  }

  if (formData.itemType === "tvSeries") {
    return {
      ...base,
      seasons: formData.seasons.map((s, i) => ({
        season_number: i + 1,
        title: s.title || oldData.seasons?.[i]?.title,
        info: s.info || oldData.seasons?.[i]?.info,
        episodes: s.episodes.map((ep, j) => ({
          episode_number: j + 1,
          title: ep.title || oldData.seasons?.[i]?.episodes?.[j]?.title,
          info: ep.info || oldData.seasons?.[i]?.episodes?.[j]?.info,
          air_date: ep.airDate || oldData.seasons?.[i]?.episodes?.[j]?.air_date,
          video_source: {
            cid: ep.video || oldData.seasons?.[i]?.episodes?.[j]?.video_source?.cid || null,
          },
        })),
      })),
    };
  }

  return base;
}