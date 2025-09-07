import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';

function UsersPage() {
    // State để lưu trữ danh sách user gốc (bạn sẽ fetch từ API)
    const [users, setUsers] = useState([
        { id: 11, name: 'Tess Harper', email: 'email@email.com', username: 'Username', plan: 'Premium', comments: 13, reviews: 1, status: 'Approved', created: '05.02.2023' },
        { id: 12, name: 'Gene Graham', email: 'email@email.com', username: 'Username', plan: 'Free', comments: 1, reviews: 15, status: 'Approved', created: '05.02.2023' },
        { id: 13, name: 'Rosa Lee', email: 'email@email.com', username: 'Username', plan: 'Premium', comments: 6, reviews: 6, status: 'Approved', created: '04.02.2023' },
        { id: 14, name: 'Matt Jones', email: 'email@email.com', username: 'Username', plan: 'Free', comments: 11, reviews: 15, status: 'Banned', created: '04.02.2023' },
        { id: 15, name: 'Brian Cranston', email: 'email@email.com', username: 'Username', plan: 'Basic', comments: 0, reviews: 0, status: 'Approved', created: '04.02.2023' },
        { id: 16, name: 'Louis Leterrier', email: 'email@email.com', username: 'Username', plan: 'Free', comments: 2, reviews: 1, status: 'Approved', created: '03.02.2023' },
        { id: 17, name: 'Son Gun', email: 'email@email.com', username: 'Username', plan: 'Cinematic', comments: 65, reviews: 0, status: 'Approved', created: '02.02.2023' },
        { id: 18, name: 'Jordana Brewster', email: 'email@email.com', username: 'Username', plan: 'Premium', comments: 0, reviews: 0, status: 'Banned', created: '02.02.2023' },
        { id: 19, name: 'Tyreese Gibson', email: 'email@email.com', username: 'Username', plan: 'Premium', comments: 13, reviews: 1, status: 'Approved', created: '01.02.2023' },
        { id: 20, name: 'Charlize Theron', email: 'email@email.com', username: 'Username', plan: 'Free', comments: 1, reviews: 15, status: 'Banned', created: '01.02.2023' },
    ]);

    // State cho việc tìm kiếm và phân trang
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 10;
    
    // Ref để lưu instance của SlimSelect
    const sortSelectRef = useRef(null);

    // Xử lý logic tìm kiếm: lọc user dựa trên searchTerm
    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // useEffect để reset trang về 1 khi người dùng thực hiện tìm kiếm
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    // useEffect để khởi tạo và hủy SlimSelect
    useEffect(() => {
        if (window.SlimSelect && !sortSelectRef.current) {
            sortSelectRef.current = new window.SlimSelect({
                select: '#filter__sort',
                settings: {
                    showSearch: false,
                }
            });
        }
        
        // Hàm dọn dẹp khi component unmount
        return () => {
            if (sortSelectRef.current) {
                sortSelectRef.current.destroy();
                sortSelectRef.current = null;
            }
        }
    }, []); // Mảng rỗng đảm bảo chỉ chạy một lần

    // Logic phân trang
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    const paginate = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    return (
        <>
            <div className="container-fluid">
                <div className="row">
                    {/* main title */}
                    <div className="col-12">
                        <div className="main__title">
                            <h2>Users</h2>
                            <span className="main__title-stat">{filteredUsers.length} Total</span>
                            <div className="main__title-wrap">
                                <button type="button" data-bs-toggle="modal" className="main__title-link main__title-link--wrap" data-bs-target="#modal-user">Add user</button>
                                <select className="filter__select" name="sort" id="filter__sort">
                                    <option value="0">Date created</option>
                                    <option value="1">Pricing plan</option>
                                    <option value="2">Status</option>
                                </select>
                                <form className="main__title-form" onSubmit={(e) => e.preventDefault()}>
                                    <input
                                        type="text"
                                        placeholder="Find user.."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <button type="button"><i className="ti ti-search"></i></button>
                                </form>
                            </div>
                        </div>
                    </div>
                    {/* end main title */}

                    {/* users */}
                    <div className="col-12">
                        <div className="catalog catalog--1">
                            <table className="catalog__table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>BASIC INFO</th>
                                        <th>USERNAME</th>
                                        <th>PRICING PLAN</th>
                                        <th>COMMENTS</th>
                                        <th>REVIEWS</th>
                                        <th>STATUS</th>
                                        <th>CREATED DATE</th>
                                        <th>ACTIONS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentUsers.map(user => (
                                        <tr key={user.id}>
                                            <td><div className="catalog__text">{user.id}</div></td>
                                            <td>
                                                <div className="catalog__user">
                                                    <div className="catalog__avatar"><img src="/img/user.svg" alt="" /></div>
                                                    <div className="catalog__meta">
                                                        <h3>{user.name}</h3>
                                                        <span>{user.email}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td><div className="catalog__text">{user.username}</div></td>
                                            <td><div className="catalog__text">{user.plan}</div></td>
                                            <td><div className="catalog__text">{user.comments}</div></td>
                                            <td><div className="catalog__text">{user.reviews}</div></td>
                                            <td>
                                                <div className={`catalog__text ${user.status === 'Approved' ? 'catalog__text--green' : 'catalog__text--red'}`}>{user.status}</div>
                                            </td>
                                            <td><div className="catalog__text">{user.created}</div></td>
                                            <td>
                                                <div className="catalog__btns">
                                                    <button type="button" data-bs-toggle="modal" className="catalog__btn catalog__btn--banned" data-bs-target="#modal-status"><i className="ti ti-lock"></i></button>
                                                    <Link to={`/admin/edit-user/${user.id}`} className="catalog__btn catalog__btn--edit">
                                                        <i className="ti ti-edit"></i>
                                                    </Link>
                                                    <button type="button" data-bs-toggle="modal" className="catalog__btn catalog__btn--delete" data-bs-target="#modal-delete"><i className="ti ti-trash"></i></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    {/* end users */}

                    {/* paginator */}
                    <div className="col-12">
                        <div className="main__paginator">
                            <span className="main__paginator-pages">{filteredUsers.length > 0 ? `${indexOfFirstUser + 1}-${Math.min(indexOfLastUser, filteredUsers.length)}` : 0} of {filteredUsers.length}</span>
                            <ul className="main__paginator-list">
                                <li><a href="#" onClick={(e) => { e.preventDefault(); paginate(currentPage - 1); }}><i className="ti ti-chevron-left"></i><span>Prev</span></a></li>
                                <li><a href="#" onClick={(e) => { e.preventDefault(); paginate(currentPage + 1); }}><span>Next</span><i className="ti ti-chevron-right"></i></a></li>
                            </ul>
                            <ul className="paginator">
                                <li className="paginator__item paginator__item--prev"><a href="#" onClick={(e) => { e.preventDefault(); paginate(currentPage - 1); }}><i className="ti ti-chevron-left"></i></a></li>
                                {[...Array(totalPages).keys()].map(number => (
                                    <li key={number + 1} className={`paginator__item ${currentPage === number + 1 ? 'paginator__item--active' : ''}`}>
                                        <a href="#" onClick={(e) => { e.preventDefault(); paginate(number + 1); }}>{number + 1}</a>
                                    </li>
                                ))}
                                <li className="paginator__item paginator__item--next"><a href="#" onClick={(e) => { e.preventDefault(); paginate(currentPage + 1); }}><i className="ti ti-chevron-right"></i></a></li>
                            </ul>
                        </div>
                    </div>
                    {/* end paginator */}
                </div>
            </div>

            {/* user modal */}
            <div className="modal fade" id="modal-user" tabIndex="-1" aria-labelledby="modal-user" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal__content">
                            <form className="modal__form">
                                <h4 className="modal__title">Add User</h4>
                                <div className="row">
                                    <div className="col-12"><div className="sign__group"><label className="sign__label" htmlFor="email0">Email</label><input id="email0" type="text" name="email0" className="sign__input" /></div></div>
                                    <div className="col-12"><div className="sign__group"><label className="sign__label" htmlFor="pass0">Password</label><input id="pass0" type="password" name="pass0" className="sign__input" /></div></div>
                                    <div className="col-12"><div className="sign__group"><label className="sign__label" htmlFor="subscription">Subscription</label><select className="sign__select" id="subscription"><option value="Basic">Basic</option><option value="Premium">Premium</option><option value="Cinematic">Cinematic</option></select></div></div>
                                    <div className="col-12"><div className="sign__group"><label className="sign__label" htmlFor="rights">Rights</label><select className="sign__select" id="rights"><option value="User">User</option><option value="Moderator">Moderator</option><option value="Admin">Admin</option></select></div></div>
                                    <div className="col-12 col-lg-6 offset-lg-3"><button type="button" className="sign__btn sign__btn--modal">Add</button></div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* status modal */}
            <div className="modal fade" id="modal-status" tabIndex="-1" aria-labelledby="modal-status" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal__content">
                            <form className="modal__form">
                                <h4 className="modal__title">Status change</h4>
                                <p className="modal__text">Are you sure about immediately change status?</p>
                                <div className="modal__btns">
                                    <button className="modal__btn modal__btn--apply" type="button"><span>Apply</span></button>
                                    <button className="modal__btn modal__btn--dismiss" type="button" data-bs-dismiss="modal" aria-label="Close"><span>Dismiss</span></button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* delete modal */}
            <div className="modal fade" id="modal-delete" tabIndex="-1" aria-labelledby="modal-delete" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal__content">
                            <form className="modal__form">
                                <h4 className="modal__title">User delete</h4>
                                <p className="modal__text">Are you sure to permanently delete this user?</p>
                                <div className="modal__btns">
                                    <button className="modal__btn modal__btn--apply" type="button"><span>Delete</span></button>
                                    <button className="modal__btn modal__btn--dismiss" type="button" data-bs-dismiss="modal" aria-label="Close"><span>Dismiss</span></button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default UsersPage;