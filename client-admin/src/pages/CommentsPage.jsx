import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getAllComments } from "../services/commentService";
function CommentsPage() {
    const [comments, setComments] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [selectedComment, setSelectedComment] = useState(null);
    const filteredComments = comments.filter(comment =>
        comment.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comment.user_id?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comment.item_type?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getAllComments(currentPage, itemsPerPage, searchTerm);
                if (data.success) {
                    setComments(data.comments);
                    setTotalPages(data.totalPages);
                    setTotal(data.total);
                }
            } catch (error) {
                console.error("❌ Lỗi khi lấy danh sách comment:", error);
            }
        };

        fetchData();
    }, [currentPage, searchTerm]);

    return (
        <>
            <div className="container-fluid">
                <div className="row">
                    {/* main title */}
                    <div className="col-12">
                        <div className="main__title">
                            <h2>Comments</h2>
                            <span className="main__title-stat">{total} Total</span>
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

                    {/* comments table */}
                    <div className="col-12">
                        <div className="catalog catalog--1">
                            <table className="catalog__table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>ITEM</th>
                                        <th>AUTHOR</th>
                                        <th>TEXT</th>
                                        <th>LIKE / DISLIKE</th>
                                        <th>CREATED DATE</th>
                                        <th>ACTIONS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {comments.map((comment, index) => (
                                        <tr key={comment._id}>
                                            <td><div className="catalog__text">{index + 1}</div></td>
                                            <td><div className="catalog__text">{comment.item_type}</div></td>
                                            <td><div className="catalog__text">{comment.user_id?.username || "Unknown"}</div></td>
                                            <td><div className="catalog__text">
                                                {comment.content.length > 50
                                                    ? comment.content.slice(0, 50) + "..."
                                                    : comment.content}
                                            </div></td>

                                            <td><div className="catalog__text">{comment.likes} / {comment.dislikes}</div></td>
                                            <td><div className="catalog__text">{new Date(comment.createdAt).toLocaleDateString()}</div></td>
                                            <td>
                                                <div className="catalog__btns">
                                                    <button
                                                        type="button"
                                                        className="catalog__btn catalog__btn--view"
                                                        data-bs-toggle="modal"
                                                        data-bs-target="#modal-view"
                                                        onClick={() => setSelectedComment(comment)}
                                                    >
                                                        <i className="ti ti-eye"></i>
                                                    </button>
                                                    <button type="button" className="catalog__btn catalog__btn--delete" data-bs-toggle="modal" data-bs-target="#modal-delete">
                                                        <i className="ti ti-trash"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    {/* end comments */}

                    <div className="col-12">
                        <ul className="paginator">
                            {[...Array(totalPages)].map((_, index) => (
                                <li key={index} className={`paginator__item ${currentPage === index + 1 ? 'active' : ''}`}>
                                    <button onClick={() => setCurrentPage(index + 1)}>
                                        {index + 1}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    {/* end paginator */}
                </div>
            </div>

            {/* view modal */}
            <div className="modal fade" id="modal-view" tabIndex="-1" aria-labelledby="modal-view" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        {selectedComment ? (
                            <div className="modal__content modal__content--view">
                                <div className="comments__autor">
                                    {/* Avatar nếu có, fallback hình mặc định */}
                                    <img
                                        className="comments__avatar"
                                        src={selectedComment.user_id?.avatar || "img/user.svg"}
                                        alt={selectedComment.user_id?.username || "User"}
                                    />
                                    <span className="comments__name">
                                        {selectedComment.user_id?.username || "Unknown"}
                                    </span>
                                    <span className="comments__time">
                                        {new Date(selectedComment.createdAt).toLocaleString()}
                                    </span>
                                </div>

                                {/* Nội dung đầy đủ comment */}
                                <p className="comments__text">{selectedComment.content}</p>

                                <div className="comments__actions">
                                    <div className="comments__rate">
                                        <span><i className="ti ti-thumb-up"></i>{selectedComment.likes}</span>
                                        <span>{selectedComment.dislikes}<i className="ti ti-thumb-down"></i></span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="modal__content modal__content--view text-center py-4">
                                <p>Loading...</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* delete modal */}
            <div className="modal fade" id="modal-delete" tabIndex="-1" aria-labelledby="modal-delete" aria-hidden="true">
                {/* ... Nội dung modal xóa comment ... */}
            </div>

        </>
    );
}

export default CommentsPage;