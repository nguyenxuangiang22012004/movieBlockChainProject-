import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';

function ReviewsPage() {
    // State để lưu trữ dữ liệu (bạn sẽ fetch từ API)
    const [reviews, setReviews] = useState([
        { id: 11, item: 'I Dream in Another Language', author: 'Gene Graham', text: 'Her father and uncover the secrets...', rating: 7.9, created: '06.02.2023' },
        { id: 12, item: 'The Forgotten Road', author: 'Tess Harper', text: 'Confront her own past to save...', rating: 8.6, created: '06.02.2023' },
        { id: 13, item: 'Whitney', author: 'Rosa Lee', text: 'Renewable energy source...', rating: 6.0, created: '05.02.2023' },
        // ... Thêm các review khác
    ]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const sortSelectRef = useRef(null);

    // Logic tìm kiếm
    const filteredReviews = reviews.filter(review =>
        review.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.text.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    // Khởi tạo và hủy SlimSelect
    useEffect(() => {
        if (window.SlimSelect && !sortSelectRef.current) {
            sortSelectRef.current = new window.SlimSelect({
                select: '#filter__sort',
                settings: { showSearch: false }
            });
        }
        return () => {
            if (sortSelectRef.current) {
                sortSelectRef.current.destroy();
                sortSelectRef.current = null;
            }
        };
    }, []);

    // Logic phân trang
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentReviews = filteredReviews.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <>
            <div className="container-fluid">
                <div className="row">
                    {/* main title */}
                    <div className="col-12">
                        <div className="main__title">
                            <h2>Reviews</h2>
                            <span className="main__title-stat">{filteredReviews.length} Total</span>
                            <div className="main__title-wrap">
                                <select className="filter__select" name="sort" id="filter__sort">
                                    <option value="0">Date created</option>
                                    <option value="1">Rating</option>
                                </select>
                                <form className="main__title-form" onSubmit={(e) => e.preventDefault()}>
                                    <input
                                        type="text"
                                        placeholder="Key word.."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <button type="button"><i className="ti ti-search"></i></button>
                                </form>
                            </div>
                        </div>
                    </div>
                    {/* end main title */}

                    {/* reviews table */}
                    <div className="col-12">
                        <div className="catalog catalog--1">
                            <table className="catalog__table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>ITEM</th>
                                        <th>AUTHOR</th>
                                        <th>TEXT</th>
                                        <th>RATING</th>
                                        <th>CRAETED DATE</th>
                                        <th>ACTIONS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentReviews.map(review => (
                                        <tr key={review.id}>
                                            <td><div className="catalog__text">{review.id}</div></td>
                                            <td><div className="catalog__text"><a href="#">{review.item}</a></div></td>
                                            <td><div className="catalog__text">{review.author}</div></td>
                                            <td><div className="catalog__text">{review.text}</div></td>
                                            <td><div className="catalog__text catalog__text--rate">{review.rating}</div></td>
                                            <td><div className="catalog__text">{review.created}</div></td>
                                            <td>
                                                <div className="catalog__btns">
                                                    <button type="button" data-bs-toggle="modal" className="catalog__btn catalog__btn--view" data-bs-target="#modal-view"><i className="ti ti-eye"></i></button>
                                                    <button type="button" data-bs-toggle="modal" className="catalog__btn catalog__btn--delete" data-bs-target="#modal-delete"><i className="ti ti-trash"></i></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    {/* end reviews */}

                    {/* paginator */}
                    <div className="col-12">
                        {/* ... Component phân trang ... */}
                    </div>
                    {/* end paginator */}
                </div>
            </div>

            {/* view modal */}
            <div className="modal fade" id="modal-view" tabIndex="-1" aria-labelledby="modal-view" aria-hidden="true">
                {/* ... Nội dung modal xem review ... */}
            </div>
            
            {/* delete modal */}
            <div className="modal fade" id="modal-delete" tabIndex="-1" aria-labelledby="modal-delete" aria-hidden="true">
                {/* ... Nội dung modal xóa review ... */}
            </div>
        </>
    );
}

export default ReviewsPage;