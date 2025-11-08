import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import FilterBar from "../components/FilterBar";
import MovieCard from "../components/MovieCard";
import Pagination from "../components/Pagination";
import PremiereSection from "../components/PremiereSection";
import { getCatalog } from "../services/catalogService.js";

function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [movies, setMovies] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // 🔍 Lấy các tham số từ URL
  const pageParam = parseInt(searchParams.get("page")) || 1;
  const typeParam = searchParams.get("type") || "all";
  const genreParam = searchParams.get("genre") || "all";

  useEffect(() => {
    const fetchCatalog = async () => {
      setLoading(true);
      try {
        const data = await getCatalog({
          page: pageParam,
          limit: 8,
          type: typeParam,
          genre: genreParam !== "all" ? genreParam : undefined,
        });

        if (data.success) {
          setMovies(data.data || []);
          setTotalPages(data.pagination?.totalPages || 1);
        }
      } catch (error) {
        console.error("❌ Lỗi fetch catalog:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCatalog();
  }, [pageParam, typeParam, genreParam]);

  // 🔄 Khi đổi trang, giữ nguyên type và genre hiện tại
  const handlePageChange = (page) => {
    setSearchParams({
      page: page.toString(),
      type: typeParam,
      genre: genreParam,
    });
  };

  if (loading)
    return <div className="text-center mt-5">Đang tải dữ liệu phim...</div>;

  return (
    <>
      {/* Page Title */}
      <section className="section section--first">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="section__wrap">
                <h1 className="section__title section__title--head">
                  {typeParam === "movie"
                    ? "Movies"
                    : typeParam === "tvseries"
                      ? "TV Series"
                      : "Catalog"}
                </h1>
                <ul className="breadcrumbs">
                  <li className="breadcrumbs__item">
                    <Link to="/">Home</Link>
                  </li>
                  <li className="breadcrumbs__item breadcrumbs__item--active">
                    {typeParam === "movie"
                      ? "Movies"
                      : typeParam === "tvseries"
                        ? "TV Series"
                        : "Catalog"}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FilterBar isFixed={false} />

      <div className="section section--catalog">
        <div className="container">
          <div className="row">
            {movies.length > 0 ? (
              movies.map((movie) => (
                <MovieCard
                  key={movie.id || movie._id}
                  movie={{
                    id: movie.id || movie._id,
                    cover_image_url: movie.cover_image_url,
                    rating: movie.imdb_rating || movie.rating || 0,
                    title: movie.title,
                    categories: movie.genres || [],
                  }}
                />
              ))
            ) : (
              <div className="col-12 text-center">Không có dữ liệu</div>
            )}
          </div>


          {totalPages > 1 && (
            <div className="row">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>

      <PremiereSection />
    </>
  );
}

export default CatalogPage;
