import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchItems, updateItemStatus } from '../redux/itemsSlice';

function CatalogPage() {
    const dispatch = useDispatch();
    const { data: items, status: itemsStatus, error } = useSelector((state) => state.items);

    useEffect(() => {
        if (itemsStatus === 'idle') {
            dispatch(fetchItems());
        }
    }, [itemsStatus, dispatch]);

    const [selectedItem, setSelectedItem] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState('0');
    const itemsPerPage = 10;
    const sortSelectRef = useRef(null);

    // Logic sắp xếp
    const sortedItems = [...items].sort((a, b) => {
        if (sortBy === '1') {
            return (b.rating || 0) - (a.rating || 0);
        } else if (sortBy === '2') {
            return (b.views || 0) - (a.views || 0);
        } else {
            const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
            const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
            return dateB - dateA;
        }
    });

    // Logic tìm kiếm
    const filteredItems = sortedItems.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, sortBy]);

    // Khởi tạo và hủy SlimSelect
    useEffect(() => {
        if (window.SlimSelect && !sortSelectRef.current) {
            sortSelectRef.current = new window.SlimSelect({
                select: '#filter__sort',
                settings: { showSearch: false },
                events: {
                    afterChange: (newVal) => {
                        setSortBy(newVal[0].value);
                    }
                }
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
    const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const goToPrevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
    const goToNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            pageNumbers.push(1);
            let startPage = Math.max(2, currentPage - 1);
            let endPage = Math.min(totalPages - 1, currentPage + 1);

            if (currentPage <= 3) endPage = 4;
            if (currentPage >= totalPages - 2) startPage = totalPages - 3;

            if (startPage > 2) pageNumbers.push('...');
            for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);
            if (endPage < totalPages - 1) pageNumbers.push('...');
            pageNumbers.push(totalPages);
        }

        return pageNumbers;
    };

    if (itemsStatus === 'loading') return <div>Loading...</div>;
    if (itemsStatus === 'failed') return <div>Error: {error}</div>;

    return (
        <>
            <div className="container-fluid">
                <div className="row">
                    {/* main title */}
                    <div className="col-12">
                        <div className="main__title">
                            <h2>Catalog</h2>
                            <span className="main__title-stat">{filteredItems.length} Total</span>
                            <div className="main__title-wrap">
                                <Link to="/admin/add-item" className="main__title-link main__title-link--wrap">Add item</Link>
                                <select
                                    className="filter__select"
                                    name="sort"
                                    id="filter__sort"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                >
                                    <option value="0">Date created</option>
                                    <option value="1">Rating</option>
                                    <option value="2">Views</option>
                                </select>
                                <form className="main__title-form" onSubmit={(e) => e.preventDefault()}>
                                    <input
                                        type="text"
                                        placeholder="Find movie / tv series.."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <button type="button"><i className="ti ti-search"></i></button>
                                </form>
                            </div>
                        </div>
                    </div>
                    {/* end main title */}

                    {/* items */}
                    <div className="col-12">
                        <div className="catalog catalog--1">
                            <table className="catalog__table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>TITLE</th>
                                        <th>RATING</th>
                                        <th>CATEGORY</th>
                                        <th>VIEWS</th>
                                        <th>STATUS</th>
                                        <th>CREATED DATE</th>
                                        <th>ACTIONS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.length > 0 ? (
                                        currentItems.map(item => (
                                            <tr key={item.id || item._id}>
                                                <td><div className="catalog__text">{item.id}</div></td>
                                                <td><div className="catalog__text"><a href="#">{item.title}</a></div></td>
                                                <td><div className="catalog__text catalog__text--rate">{item.rating}</div></td>
                                                <td><div className="catalog__text">{item.category || '-'}</div></td>
                                                <td><div className="catalog__text">{item.views}</div></td>
                                                <td>
                                                    <div className={`catalog__text ${item.status === 'Visible' ? 'catalog__text--green' : 'catalog__text--red'}`}>
                                                        {item.status}
                                                    </div>
                                                </td>
                                                <td><div className="catalog__text">
                                                    {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '-'}
                                                </div></td>
                                                <td>
                                                    <div className="catalog__btns">
                                                        <button
                                                            type="button"
                                                            className="catalog__btn catalog__btn--banned"
                                                            data-bs-toggle="modal"
                                                            data-bs-target="#modal-status"
                                                            onClick={() => setSelectedItem(item)}
                                                        >
                                                            <i className="ti ti-lock"></i>
                                                        </button>
                                                        <Link to={`/admin/edit-items/${item.id}`} className="catalog__btn catalog__btn--edit">
                                                            <i className="ti ti-edit"></i>
                                                        </Link>
                                                        <button
                                                            type="button"
                                                            data-bs-toggle="modal"
                                                            className="catalog__btn catalog__btn--delete"
                                                            data-bs-target="#modal-delete"
                                                        >
                                                            <i className="ti ti-trash"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="8" className="text-center">
                                                <div className="catalog__text">No items found</div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    {/* end items */}

                    {/* paginator */}
                    {filteredItems.length > 0 && (
                        <div className="col-12">
                            <div className="main__paginator">
                                <span className="main__paginator-pages">
                                    {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredItems.length)} of {filteredItems.length}
                                </span>

                                <ul className="main__paginator-list">
                                    <li>
                                        <a
                                            href="#"
                                            onClick={(e) => { e.preventDefault(); goToPrevPage(); }}
                                            className={currentPage === 1 ? 'disabled' : ''}
                                        >
                                            <i className="ti ti-chevron-left"></i>
                                            <span>Prev</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            onClick={(e) => { e.preventDefault(); goToNextPage(); }}
                                            className={currentPage === totalPages ? 'disabled' : ''}
                                        >
                                            <span>Next</span>
                                            <i className="ti ti-chevron-right"></i>
                                        </a>
                                    </li>
                                </ul>

                                <ul className="paginator">
                                    <li className={`paginator__item paginator__item--prev ${currentPage === 1 ? 'disabled' : ''}`}>
                                        <a
                                            href="#"
                                            onClick={(e) => { e.preventDefault(); goToPrevPage(); }}
                                        >
                                            <i className="ti ti-chevron-left"></i>
                                        </a>
                                    </li>

                                    {getPageNumbers().map((pageNumber, index) => (
                                        <li
                                            key={pageNumber === '...' ? `dots-${index}` : pageNumber}
                                            className={`paginator__item ${pageNumber === currentPage ? 'paginator__item--active' : ''
                                                } ${pageNumber === '...' ? 'paginator__item--dots' : ''}`}
                                        >
                                            {pageNumber === '...' ? (
                                                <span>...</span>
                                            ) : (
                                                <a
                                                    href="#"
                                                    onClick={(e) => { e.preventDefault(); paginate(pageNumber); }}
                                                >
                                                    {pageNumber}
                                                </a>
                                            )}
                                        </li>
                                    ))}

                                    <li className={`paginator__item paginator__item--next ${currentPage === totalPages ? 'disabled' : ''}`}>
                                        <a
                                            href="#"
                                            onClick={(e) => { e.preventDefault(); goToNextPage(); }}
                                        >
                                            <i className="ti ti-chevron-right"></i>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    )}
                    {/* end paginator */}
                </div>
            </div>

            {/* status modal */}
            <div className="modal fade" id="modal-status" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal__content">
                            <form className="modal__form">
                                <h4 className="modal__title">Status change</h4>
                                <p className="modal__text">Are you sure about immediately change status?</p>
                                <div className="modal__btns">
                                    <button
                                        className="modal__btn modal__btn--apply"
                                        type="button"
                                        onClick={() => {
                                            if (selectedItem) {
                                                const newStatus = selectedItem.status === "Visible" ? "Hidden" : "Visible";
                                                // dùng category hoặc type từ item
                                                const type = selectedItem.category === "Movie" ? "movies" : "tvseries";
                                                dispatch(updateItemStatus({ type, id: selectedItem._id || selectedItem.id, status: newStatus }));
                                            }
                                        }}
                                        data-bs-dismiss="modal"
                                    >
                                        <span>Apply</span>
                                    </button>
                                    <button className="modal__btn modal__btn--dismiss" type="button" data-bs-dismiss="modal" aria-label="Close">
                                        <span>Dismiss</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* delete modal */}
            <div className="modal fade" id="modal-delete" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal__content">
                            <form className="modal__form">
                                <h4 className="modal__title">Item delete</h4>
                                <p className="modal__text">Are you sure to permanently delete this item?</p>
                                <div className="modal__btns">
                                    <button className="modal__btn modal__btn--apply" type="button">
                                        <span>Delete</span>
                                    </button>
                                    <button className="modal__btn modal__btn--dismiss" type="button" data-bs-dismiss="modal" aria-label="Close">
                                        <span>Dismiss</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CatalogPage;
