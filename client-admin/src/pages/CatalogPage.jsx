import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';

function CatalogPage() {
    // State để lưu trữ dữ liệu
    const [items, setItems] = useState([
        { id: 11, title: 'I Dream in Another Language', rating: 7.9, category: 'Movie', views: 1392, status: 'Visible', created: '05.02.2023' },
        { id: 12, title: 'The Forgotten Road', rating: 7.1, category: 'Movie', views: 1093, status: 'Hidden', created: '05.02.2023' },
        { id: 13, title: 'Whitney', rating: 6.3, category: 'TV Series', views: 723, status: 'Visible', created: '04.02.2023' },
        { id: 14, title: 'Red Sky at Night', rating: 8.4, category: 'TV Series', views: 2457, status: 'Visible', created: '04.02.2023' },
        { id: 15, title: 'Into the Unknown', rating: 7.9, category: 'Movie', views: 5092, status: 'Visible', created: '03.02.2023' },
        { id: 16, title: 'The Unseen Journey', rating: 7.1, category: 'TV Series', views: 2713, status: 'Hidden', created: '03.02.2023' },
        { id: 17, title: 'Savage Beauty', rating: 6.3, category: 'Cartoon', views: 901, status: 'Visible', created: '03.02.2023' },
        { id: 18, title: 'Endless Horizon', rating: 8.4, category: 'Movie', views: 8430, status: 'Visible', created: '02.02.2023' },
        { id: 19, title: 'The Lost Key', rating: 7.9, category: 'Movie', views: 818, status: 'Visible', created: '02.02.2023' },
        { id: 20, title: 'Echoes of Yesterday', rating: 7.1, category: 'Anime', views: 1046, status: 'Hidden', created: '01.02.2023' },
        { id: 21, title: 'Another Test Movie', rating: 8.1, category: 'Movie', views: 2100, status: 'Visible', created: '01.01.2023' },
        { id: 22, title: 'Test Series', rating: 8.5, category: 'TV Series', views: 3100, status: 'Visible', created: '01.01.2023' },
        { id: 23, title: 'New Anime', rating: 8.7, category: 'Anime', views: 4100, status: 'Visible', created: '02.01.2023' },
        { id: 24, title: 'Latest Cartoon', rating: 7.8, category: 'Cartoon', views: 1200, status: 'Visible', created: '03.01.2023' },
    ]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState('0');
    const itemsPerPage = 10;
    const sortSelectRef = useRef(null);

    // Logic sắp xếp
    const sortedItems = [...items].sort((a, b) => {
        if (sortBy === '1') {
            return b.rating - a.rating;
        } else if (sortBy === '2') {
            return b.views - a.views;
        } else {
            const [dayA, monthA, yearA] = a.created.split('.').map(Number);
            const [dayB, monthB, yearB] = b.created.split('.').map(Number);
            const dateA = new Date(yearA, monthA - 1, dayA);
            const dateB = new Date(yearB, monthB - 1, dayB);
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

    // Hàm xử lý phân trang
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Hàm để chuyển đến trang trước
    const goToPrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    // Hàm để chuyển đến trang tiếp theo
    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    // Tạo mảng các số trang để hiển thị
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
            
            if (currentPage <= 3) {
                endPage = 4;
            }
            
            if (currentPage >= totalPages - 2) {
                startPage = totalPages - 3;
            }
            
            if (startPage > 2) {
                pageNumbers.push('...');
            }
            
            for (let i = startPage; i <= endPage; i++) {
                pageNumbers.push(i);
            }
            
            if (endPage < totalPages - 1) {
                pageNumbers.push('...');
            }
            
            pageNumbers.push(totalPages);
        }
        
        return pageNumbers;
    };

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
                                            <tr key={item.id}>
                                                <td><div className="catalog__text">{item.id}</div></td>
                                                <td><div className="catalog__text"><a href="#">{item.title}</a></div></td>
                                                <td><div className="catalog__text catalog__text--rate">{item.rating}</div></td>
                                                <td><div className="catalog__text">{item.category}</div></td>
                                                <td><div className="catalog__text">{item.views}</div></td>
                                                <td>
                                                    <div className={`catalog__text ${item.status === 'Visible' ? 'catalog__text--green' : 'catalog__text--red'}`}>
                                                        {item.status}
                                                    </div>
                                                </td>
                                                <td><div className="catalog__text">{item.created}</div></td>
                                                <td>
                                                    <div className="catalog__btns">
                                                        <button 
                                                            type="button" 
                                                            data-bs-toggle="modal" 
                                                            className="catalog__btn catalog__btn--banned" 
                                                            data-bs-target="#modal-status"
                                                        >
                                                            <i className="ti ti-lock"></i>
                                                        </button>
                                                        <a href="#" className="catalog__btn catalog__btn--view">
                                                            <i className="ti ti-eye"></i>
                                                        </a>
                                                        <Link to={`/admin/add-item/${item.id}`} className="catalog__btn catalog__btn--edit">
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
                                {/* amount */}
                                <span className="main__paginator-pages">
                                    {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredItems.length)} of {filteredItems.length}
                                </span>
                                {/* end amount */}

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
                                            key={index} 
                                            className={`paginator__item ${
                                                pageNumber === currentPage ? 'paginator__item--active' : ''
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
                                    <button className="modal__btn modal__btn--apply" type="button">
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