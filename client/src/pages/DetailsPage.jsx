import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import MovieCard from '../components/MovieCard';

// Dữ liệu mẫu
const relatedMovies = [
    { id: 1, cover: '/img/covers/cover.jpg', rate: 8.4, title: 'I Dream in Another Language', categories: ['Action', 'Triler'] },
    { id: 2, cover: '/img/covers/cover2.jpg', rate: 7.1, title: 'Benched', categories: ['Comedy'] },
    { id: 3, cover: '/img/covers/cover3.jpg', rate: 6.3, title: 'Whitney', categories: ['Romance', 'Drama', 'Music'] },
    { id: 4, cover: '/img/covers/cover4.jpg', rate: 6.9, title: 'Blindspotting', categories: ['Comedy', 'Drama'] },
    { id: 5, cover: '/img/covers/cover5.jpg', rate: 8.4, title: 'I Dream in Another Language', categories: ['Action', 'Triler'] },
    { id: 6, cover: '/img/covers/cover6.jpg', rate: 7.1, title: 'Benched', categories: ['Comedy'] },
];

// Dữ liệu mẫu cho comments
const commentsData = [
    {
        id: 1,
        avatar: '/img/user.svg',
        name: 'John Doe',
        time: '30.08.2018, 17:53',
        text: 'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don\'t look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn\'t anything embarrassing hidden in the middle of text.',
        likes: 12,
        dislikes: 7,
        replies: [
            {
                id: 11,
                avatar: '/img/user.svg',
                name: 'John Doe',
                time: '24.08.2018, 16:41',
                text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.',
                likes: 8,
                dislikes: 3
            }
        ]
    },
    {
        id: 2,
        avatar: '/img/user.svg',
        name: 'John Doe',
        time: '07.08.2018, 14:33',
        text: 'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don\'t look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn\'t anything embarrassing hidden in the middle of text.',
        likes: 99,
        dislikes: 35,
        replies: []
    },
];

// Dữ liệu mẫu cho reviews
const reviewsData = [
    {
        id: 1,
        avatar: '/img/user.svg',
        title: 'Best Marvel movie in my opinion',
        name: 'John Doe',
        time: '24.08.2018, 17:53',
        rating: 6,
        text: 'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don\'t look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn\'t anything embarrassing hidden in the middle of text.'
    },
];

// Dữ liệu mẫu cho photos
const photosData = [
    { id: 1, src: '/img/gallery/project-1.jpg', caption: 'Some image caption 1' },
    { id: 2, src: '/img/gallery/project-2.jpg', caption: 'Some image caption 2' },
    { id: 3, src: '/img/gallery/project-3.jpg', caption: 'Some image caption 3' },
    { id: 4, src: '/img/gallery/project-4.jpg', caption: 'Some image caption 4' },
    { id: 5, src: '/img/gallery/project-5.jpg', caption: 'Some image caption 5' },
    { id: 6, src: '/img/gallery/project-6.jpg', caption: 'Some image caption 6' },
];

function DetailsPage() {
    const { movieId } = useParams();
    const playerRef = useRef(null);
    const [activeTab, setActiveTab] = useState('tab-1');
    const [slimSelectInstances, setSlimSelectInstances] = useState([]);

    useEffect(() => {
        // Đặt ảnh nền
        const detailsBg = document.querySelector('.section__details-bg');
        if (detailsBg && detailsBg.getAttribute('data-bg')) {
            const bgUrl = detailsBg.getAttribute('data-bg');
            detailsBg.style.background = `url(${bgUrl}) center center / cover no-repeat`;
        }

        // Khởi tạo các thư viện
        let playerInstance = null;
        let scrollbarInstance = null;
        const instances = [];

        if (window.Plyr && document.querySelector('#player')) {
            playerInstance = new window.Plyr('#player');
        }

        // Khởi tạo SlimSelect với cấu hình phù hợp
        if (window.SlimSelect) {
            // Ẩn select mặc định để tránh hiển thị double
            document.querySelectorAll('.section__item-select').forEach(select => {
                select.style.display = 'none';
            });

            const season = new window.SlimSelect({
                select: '#filter__season',
                settings: {
                    showSearch: false,
                    contentPosition: 'absolute'
                }
            });
            instances.push(season);

            const series = new window.SlimSelect({
                select: '#filter__series',
                settings: {
                    showSearch: false,
                    contentPosition: 'absolute'
                }
            });
            instances.push(series);

            const sync = new window.SlimSelect({
                select: '#filter__sync',
                settings: {
                    showSearch: false,
                    contentPosition: 'absolute'
                }
            });
            instances.push(sync);

            setSlimSelectInstances(instances);
        }

        if (window.Scrollbar && document.querySelector('.item__description')) {
            scrollbarInstance = window.Scrollbar.init(document.querySelector('.item__description'), {
                damping: 0.1,
                renderByPixels: true,
                alwaysShowTracks: true,
                continuousScrolling: true
            });
        }

        // Cleanup
        return () => {
            if (playerInstance) playerInstance.destroy();
            if (scrollbarInstance) scrollbarInstance.destroy();
            instances.forEach(instance => {
                if (instance && typeof instance.destroy === 'function') {
                    instance.destroy();
                }
            });
        };
    }, [movieId]);

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
    };

    // Component riêng cho comment reply để tránh lỗi <li> trong <li>
    const CommentReply = ({ reply }) => (
        <li className="comments__item comments__item--answer">
            <div className="comments__autor">
                <img className="comments__avatar" src={reply.avatar} alt="" />
                <span className="comments__name">{reply.name}</span>
                <span className="comments__time">{reply.time}</span>
            </div>
            <p className="comments__text">{reply.text}</p>
            <div className="comments__actions">
                <div className="comments__rate">
                    <button type="button"><i className="ti ti-thumb-up"></i>{reply.likes}</button>
                    <button type="button">{reply.dislikes}<i className="ti ti-thumb-down"></i></button>
                </div>
                <button type="button"><i className="ti ti-arrow-forward-up"></i>Reply</button>
                <button type="button"><i className="ti ti-quote"></i>Quote</button>
            </div>
        </li>
    );

    return (
        <>
            <section className="section section--details">
                <div className="section__details-bg" data-bg="/img/bg/details__bg.jpg"></div>
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <h1 className="section__title section__title--head">I Dream in Another Language</h1>
                        </div>

                        <div className="col-12 col-xl-6">
                            <div className="item item--details">
                                <div className="row">
                                    <div className="col-12 col-sm-5 col-md-5 col-lg-4 col-xl-6 col-xxl-5">
                                        <div className="item__cover">
                                            <img src="/img/covers/cover1.jpg" alt="" />
                                            <span className="item__rate item__rate--green">8.4</span>
                                            <button className="item__favorite item__favorite--static" type="button">
                                                <i className="ti ti-bookmark"></i>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="col-12 col-md-7 col-lg-8 col-xl-6 col-xxl-7">
                                        <div className="item__content">
                                            <ul className="item__meta">
                                                <li><span>Director:</span> <Link to="/actor">Vince Gilligan</Link></li>
                                                <li><span>Cast:</span> <Link to="/actor">Brian Cranston</Link> <Link to="/actor">Jesse Plemons</Link> <Link to="/actor">Matt Jones</Link> <Link to="/actor">Jonathan Banks</Link> <Link to="/actor">Charles Baker</Link> <Link to="/actor">Tess Harper</Link></li>
                                                <li><span>Genre:</span> <Link to="/catalog">Action</Link> <Link to="/catalog">Triler</Link></li>
                                                <li><span>Premiere:</span> 2019</li>
                                                <li><span>Running time:</span> 128 min</li>
                                                <li><span>Country:</span> <Link to="/catalog">USA</Link></li>
                                            </ul>

                                            <div className="item__description">
                                                <p>When a renowned archaeologist goes missing, his daughter sets out on a perilous journey to the heart of the Amazon rainforest to find him. Along the way, she discovers a hidden city and a dangerous conspiracy that threatens the very balance of power in the world. With the help of a charming rogue, she must navigate treacherous terrain and outwit powerful enemies to save her father and uncover the secrets of the lost city. A down-on-his-luck boxer struggles to make ends meet while raising his young son. When an old friend offers him a chance to make some quick cash by fighting in an illegal underground boxing tournament, he sees it as his last shot at redemption. But as the stakes get higher and the fights get more brutal, he must confront his own demons and find the strength to win not just for himself, but for his son.</p>
                                                <p>A brilliant scientist discovers a way to harness the power of the ocean's currents to create a new, renewable energy source. But when her groundbreaking technology falls into the wrong hands, she must race against time to stop it from being used for evil. Along the way, she must navigate complex political alliances and confront her own past to save the world from disaster.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-12 col-xl-6">
                            <div className="section__player">
                                <video
                                    ref={playerRef}
                                    controls
                                    crossOrigin="anonymous"
                                    playsInline
                                    poster="https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.jpg"
                                    id="player"
                                >
                                    <source src="https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4" type="video/mp4" size="576" />
                                    <source src="https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-720p.mp4" type="video/mp4" size="720" />
                                    <source src="https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-1080p.mp4" type="video/mp4" size="1080" />

                                    <track kind="captions" label="English" srcLang="en" src="/subtitles/en.vtt" default />
                                    <track kind="captions" label="Français" srcLang="fr" src="/subtitles/fr.vtt" />

                                    <a href="https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4" download>Download</a>
                                </video>
                            </div>

                            <div className="section__item-filter" style={{ display: 'flex', gap: '10px' }}>
                                <div style={{ flex: 1 }}>
                                    <select className="section__item-select" name="season" id="filter__season">
                                        <option value="0">Season 1</option>
                                        <option value="1">Season 2</option>
                                        <option value="2">Season 3</option>
                                        <option value="3">Season 4</option>
                                        <option value="4">Season 5</option>
                                    </select>
                                </div>

                                <div style={{ flex: 1 }}>
                                    <select className="section__item-select" name="series" id="filter__series">
                                        <option value="0">Series 1</option>
                                        <option value="1">Series 2</option>
                                        <option value="2">Series 3</option>
                                        <option value="3">Series 4</option>
                                        <option value="4">Series 5</option>
                                        <option value="5">Series 6</option>
                                        <option value="6">Series 7</option>
                                        <option value="7">Series 8</option>
                                        <option value="8">Series 9</option>
                                        <option value="9">Series 10</option>
                                        <option value="10">Series 11</option>
                                        <option value="11">Series 12</option>
                                    </select>
                                </div>

                                <div style={{ flex: 1 }}>
                                    <select className="section__item-select" name="sync" id="filter__sync">
                                        <option value="0">Eng.Original</option>
                                        <option value="1">NewStudio</option>
                                        <option value="2">LostFilm</option>
                                        <option value="3">HotFlix</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="content">
                <div className="content__head content__head--mt">
                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                <h2 className="content__title">Discover</h2>
                                <ul className="nav nav-tabs content__tabs" id="content__tabs" role="tablist">
                                    <li className="nav-item" role="presentation">
                                        <button
                                            className={activeTab === 'tab-1' ? 'active' : ''}
                                            onClick={() => handleTabChange('tab-1')}
                                            type="button"
                                        >
                                            Comments
                                        </button>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <button
                                            className={activeTab === 'tab-2' ? 'active' : ''}
                                            onClick={() => handleTabChange('tab-2')}
                                            type="button"
                                        >
                                            Reviews
                                        </button>
                                    </li>
                                    <li className="nav-item" role="presentation">
                                        <button
                                            className={activeTab === 'tab-3' ? 'active' : ''}
                                            onClick={() => handleTabChange('tab-3')}
                                            type="button"
                                        >
                                            Photos
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container">
                    <div className="row">
                        <div className="col-12 col-lg-8">
                            <div className="tab-content">
                                {activeTab === 'tab-1' && (
                                    <div className="tab-pane fade show active" id="tab-1" role="tabpanel" aria-labelledby="1-tab" tabIndex="0">
                                        <div className="row">
                                            <div className="col-12">
                                                <div className="comments">
                                                    <ul className="comments__list">
                                                        {commentsData.map(comment => (
                                                            <React.Fragment key={comment.id}>
                                                                <li className="comments__item">
                                                                    <div className="comments__autor">
                                                                        <img className="comments__avatar" src={comment.avatar} alt="" />
                                                                        <span className="comments__name">{comment.name}</span>
                                                                        <span className="comments__time">{comment.time}</span>
                                                                    </div>
                                                                    <p className="comments__text">{comment.text}</p>
                                                                    <div className="comments__actions">
                                                                        <div className="comments__rate">
                                                                            <button type="button"><i className="ti ti-thumb-up"></i>{comment.likes}</button>
                                                                            <button type="button">{comment.dislikes}<i className="ti ti-thumb-down"></i></button>
                                                                        </div>
                                                                        <button type="button"><i className="ti ti-arrow-forward-up"></i>Reply</button>
                                                                        <button type="button"><i className="ti ti-quote"></i>Quote</button>
                                                                    </div>
                                                                </li>

                                                                {/* Render replies */}
                                                                {comment.replies && comment.replies.map(reply => (
                                                                    <li key={reply.id} className="comments__item comments__item--answer">
                                                                        <div className="comments__autor">
                                                                            <img className="comments__avatar" src={reply.avatar} alt="" />
                                                                            <span className="comments__name">{reply.name}</span>
                                                                            <span className="comments__time">{reply.time}</span>
                                                                        </div>
                                                                        <p className="comments__text">{reply.text}</p>
                                                                        <div className="comments__actions">
                                                                            <div className="comments__rate">
                                                                                <button type="button"><i className="ti ti-thumb-up"></i>{reply.likes}</button>
                                                                                <button type="button">{reply.dislikes}<i className="ti ti-thumb-down"></i></button>
                                                                            </div>
                                                                            <button type="button"><i className="ti ti-arrow-forward-up"></i>Reply</button>
                                                                            <button type="button"><i className="ti ti-quote"></i>Quote</button>
                                                                        </div>
                                                                    </li>
                                                                ))}
                                                            </React.Fragment>
                                                        ))}
                                                    </ul>
                                                    <div className="paginator-mob paginator-mob--comments">
                                                        <span className="paginator-mob__pages">5 of 628</span>
                                                        <ul className="paginator-mob__nav">
                                                            <li>
                                                                <a href="#">
                                                                    <i className="ti ti-chevron-left"></i>
                                                                    <span>Prev</span>
                                                                </a>
                                                            </li>
                                                            <li>
                                                                <a href="#">
                                                                    <span>Next</span>
                                                                    <i className="ti ti-chevron-right"></i>
                                                                </a>
                                                            </li>
                                                        </ul>
                                                    </div>

                                                    <ul className="paginator paginator--comments">
                                                        <li className="paginator__item paginator__item--prev">
                                                            <a href="#"><i className="ti ti-chevron-left"></i></a>
                                                        </li>
                                                        <li className="paginator__item"><a href="#">1</a></li>
                                                        <li className="paginator__item paginator__item--active"><a href="#">2</a></li>
                                                        <li className="paginator__item"><a href="#">3</a></li>
                                                        <li className="paginator__item"><a href="#">4</a></li>
                                                        <li className="paginator__item"><span>...</span></li>
                                                        <li className="paginator__item"><a href="#">36</a></li>
                                                        <li className="paginator__item paginator__item--next">
                                                            <a href="#"><i className="ti ti-chevron-right"></i></a>
                                                        </li>
                                                    </ul>

                                                    <form className="sign__form sign__form--comments">
                                                        <div className="sign__group">
                                                            <textarea id="text" name="text" className="sign__textarea" placeholder="Add comment"></textarea>
                                                        </div>
                                                        <button type="button" className="sign__btn sign__btn--small">Send</button>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'tab-2' && (
                                    <div className="tab-pane fade show active" id="tab-2" role="tabpanel" aria-labelledby="2-tab" tabIndex="0">
                                        <div className="row">
                                            <div className="col-12">
                                                <div className="reviews">
                                                    <ul className="reviews__list">
                                                        {reviewsData.map(review => (
                                                            <li key={review.id} className="reviews__item">
                                                                <div className="reviews__autor">
                                                                    <img className="reviews__avatar" src={review.avatar} alt="" />
                                                                    <span className="reviews__name">{review.title}</span>
                                                                    <span className="reviews__time">{review.time} by {review.name}</span>
                                                                    <span className={`reviews__rating ${review.rating >= 8 ? 'reviews__rating--green' :
                                                                            review.rating >= 6 ? 'reviews__rating--yellow' :
                                                                                'reviews__rating--red'
                                                                        }`}>
                                                                        {review.rating}
                                                                    </span>
                                                                </div>
                                                                <p className="reviews__text">{review.text}</p>
                                                            </li>
                                                        ))}
                                                    </ul>

                                                    <div className="paginator-mob paginator-mob--comments">
                                                        <span className="paginator-mob__pages">5 of 628</span>
                                                        <ul className="paginator-mob__nav">
                                                            <li>
                                                                <a href="#">
                                                                    <i className="ti ti-chevron-left"></i>
                                                                    <span>Prev</span>
                                                                </a>
                                                            </li>
                                                            <li>
                                                                <a href="#">
                                                                    <span>Next</span>
                                                                    <i className="ti ti-chevron-right"></i>
                                                                </a>
                                                            </li>
                                                        </ul>
                                                    </div>

                                                    <ul className="paginator paginator--comments">
                                                        <li className="paginator__item paginator__item--prev">
                                                            <a href="#"><i className="ti ti-chevron-left"></i></a>
                                                        </li>
                                                        <li className="paginator__item"><a href="#">1</a></li>
                                                        <li className="paginator__item paginator__item--active"><a href="#">2</a></li>
                                                        <li className="paginator__item"><a href="#">3</a></li>
                                                        <li className="paginator__item"><a href="#">4</a></li>
                                                        <li className="paginator__item"><span>...</span></li>
                                                        <li className="paginator__item"><a href="#">36</a></li>
                                                        <li className="paginator__item paginator__item--next">
                                                            <a href="#"><i className="ti ti-chevron-right"></i></a>
                                                        </li>
                                                    </ul>

                                                    <form className="sign__form sign__form--comments">
                                                        <div className="sign__group">
                                                            <input type="text" className="sign__input" placeholder="Title" />
                                                        </div>
                                                        <div className="sign__group">
                                                            <select className="sign__select" name="rating" id="rating">
                                                                <option value="0">Rating</option>
                                                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                                                                    <option key={num} value={num}>{num} {num === 1 ? 'star' : 'stars'}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        <div className="sign__group">
                                                            <textarea id="textreview" name="textreview" className="sign__textarea" placeholder="Add review"></textarea>
                                                        </div>
                                                        <button type="button" className="sign__btn sign__btn--small">Send</button>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'tab-3' && (
                                    <div className="tab-pane fade show active" id="tab-3" role="tabpanel" aria-labelledby="3-tab" tabIndex="0">
                                        <div className="gallery" itemScope>
                                            <div className="row">
                                                {photosData.map(photo => (
                                                    <figure key={photo.id} className="col-12 col-sm-6 col-xl-4" itemProp="associatedMedia" itemScope>
                                                        <a href={photo.src} itemProp="contentUrl" data-size="1920x1280">
                                                            <img src={photo.src} itemProp="thumbnail" alt={photo.caption} />
                                                        </a>
                                                        <figcaption itemProp="caption description">{photo.caption}</figcaption>
                                                    </figure>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="col-12 col-lg-4">
                            <div className="row">
                                <div className="col-12">
                                    <h2 className="section__title section__title--sidebar">You may also like...</h2>
                                </div>
                                {relatedMovies.map(movie => (
                                    <div key={movie.id} className="col-6 col-sm-4 col-lg-6">
                                        <div className="item">
                                            <div className="item__cover">
                                                <img src={movie.cover} alt={movie.title} />
                                                <Link to={`/details/${movie.id}`} className="item__play">
                                                    <i className="ti ti-player-play-filled"></i>
                                                </Link>
                                                <span className={`item__rate ${movie.rate >= 8 ? 'item__rate--green' :
                                                        movie.rate >= 6 ? 'item__rate--yellow' :
                                                            'item__rate--red'
                                                    }`}>
                                                    {movie.rate}
                                                </span>
                                                <button className="item__favorite" type="button">
                                                    <i className="ti ti-bookmark"></i>
                                                </button>
                                            </div>
                                            <div className="item__content">
                                                <h3 className="item__title">
                                                    <Link to={`/details/${movie.id}`}>{movie.title}</Link>
                                                </h3>
                                                <span className="item__category">
                                                    {movie.categories.map((category, index) => (
                                                        <React.Fragment key={index}>
                                                            <a href="#">{category}</a>
                                                            {index < movie.categories.length - 1 && ' '}
                                                        </React.Fragment>
                                                    ))}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* PhotoSwipe Root Element */}
            <div className="pswp" tabIndex="-1" role="dialog" aria-hidden="true">
                <div className="pswp__bg"></div>
                <div className="pswp__scroll-wrap">
                    <div className="pswp__container">
                        <div className="pswp__item"></div>
                        <div className="pswp__item"></div>
                        <div className="pswp__item"></div>
                    </div>
                    <div className="pswp__ui pswp__ui--hidden">
                        <div className="pswp__top-bar">
                            <div className="pswp__counter"></div>
                            <button className="pswp__button pswp__button--close" title="Close (Esc)"></button>
                            <button className="pswp__button pswp__button--fs" title="Toggle fullscreen"></button>
                            <div className="pswp__preloader">
                                <div className="pswp__preloader__icn">
                                    <div className="pswp__preloader__cut">
                                        <div className="pswp__preloader__donut"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button className="pswp__button pswp__button--arrow--left" title="Previous (arrow left)"></button>
                        <button className="pswp__button pswp__button--arrow--right" title="Next (arrow right)"></button>
                        <div className="pswp__caption">
                            <div className="pswp__caption__center"></div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default DetailsPage;