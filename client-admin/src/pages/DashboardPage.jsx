import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

function DashboardPage() {
  useEffect(() => {
    if (window.Scrollbar) {
      document.querySelectorAll('.dashbox__table-wrap').forEach(el => {
        if (!el.classList.contains('scroll-content')) { 
          window.Scrollbar.init(el, {
            damping: 0.1,
            renderByPixels: true,
            alwaysShowTracks: true,
            continuousScrolling: true,
          });
        }
      });
    }
  }, []); 

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="main__title">
            <h2>Dashboard</h2>
            <Link to="add-item" className="main__title-link">add item</Link>
          </div>
        </div>

        {/* stats */}
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="stats">
            <span>Subscriptions this month</span>
            <p>1 678 <b className="green">+15</b></p>
            <i className="ti ti-diamond"></i>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="stats">
            <span>Items added this month</span>
            <p>376 <b className="red">-44</b></p>
            <i className="ti ti-movie"></i>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="stats">
            <span>Views this month</span>
            <p>509 573 <b className="green">+3.1%</b></p>
            <i className="ti ti-eye"></i>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="stats">
            <span>Reviews this month</span>
            <p>642 <b className="green">+8</b></p>
            <i className="ti ti-star-half-filled"></i>
          </div>
        </div>
        {/* end stats */}
      </div>

      <div className="row">
        {/* dashbox top items */}
        <div className="col-12 col-xl-6">
          <div className="dashbox">
            <div className="dashbox__title">
              <h3><i className="ti ti-trophy"></i> Top items</h3>
              <div className="dashbox__wrap">
                <a className="dashbox__refresh" href="#"><i className="ti ti-refresh"></i></a>
                <Link className="dashbox__more" to="/catalog">View All</Link>
              </div>
            </div>
            <div className="dashbox__table-wrap dashbox__table-wrap--1">
              <table className="dashbox__table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>TITLE</th>
                    <th>CATEGORY</th>
                    <th>RATING</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div className="dashbox__table-text dashbox__table-text--grey">241</div>
                    </td>
                    <td>
                      <div className="dashbox__table-text"><a href="#">The Lost City</a></div>
                    </td>
                    <td>
                      <div className="dashbox__table-text">Movie</div>
                    </td>
                    <td>
                      <div className="dashbox__table-text dashbox__table-text--rate"><i className="ti ti-star"></i> 9.2</div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="dashbox__table-text dashbox__table-text--grey">825</div>
                    </td>
                    <td>
                      <div className="dashbox__table-text"><a href="#">Undercurrents</a></div>
                    </td>
                    <td>
                      <div className="dashbox__table-text">Movie</div>
                    </td>
                    <td>
                      <div className="dashbox__table-text dashbox__table-text--rate"><i className="ti ti-star"></i> 9.1</div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="dashbox__table-text dashbox__table-text--grey">9271</div>
                    </td>
                    <td>
                      <div className="dashbox__table-text"><a href="#">Tales from the Underworld</a></div>
                    </td>
                    <td>
                      <div className="dashbox__table-text">TV Series</div>
                    </td>
                    <td>
                      <div className="dashbox__table-text dashbox__table-text--rate"><i className="ti ti-star"></i> 9.0</div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="dashbox__table-text dashbox__table-text--grey">635</div>
                    </td>
                    <td>
                      <div className="dashbox__table-text"><a href="#">The Unseen World</a></div>
                    </td>
                    <td>
                      <div className="dashbox__table-text">TV Series</div>
                    </td>
                    <td>
                      <div className="dashbox__table-text dashbox__table-text--rate"><i className="ti ti-star"></i> 8.9</div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="dashbox__table-text dashbox__table-text--grey">825</div>
                    </td>
                    <td>
                      <div className="dashbox__table-text"><a href="#">Redemption Road</a></div>
                    </td>
                    <td>
                      <div className="dashbox__table-text">TV Series</div>
                    </td>
                    <td>
                      <div className="dashbox__table-text dashbox__table-text--rate"><i className="ti ti-star"></i> 8.9</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* end dashbox */}

        {/* dashbox latest items */}
        <div className="col-12 col-xl-6">
          <div className="dashbox">
            <div className="dashbox__title">
              <h3><i className="ti ti-movie"></i> Latest items</h3>
              <div className="dashbox__wrap">
                <a className="dashbox__refresh" href="#"><i className="ti ti-refresh"></i></a>
                <Link className="dashbox__more" to="/catalog">View All</Link>
              </div>
            </div>
            <div className="dashbox__table-wrap dashbox__table-wrap--2">
              <table className="dashbox__table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>ITEM</th>
                    <th>CATEGORY</th>
                    <th>RATING</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div className="dashbox__table-text dashbox__table-text--grey">824</div>
                    </td>
                    <td>
                      <div className="dashbox__table-text"><a href="#">I Dream in Another Language</a></div>
                    </td>
                    <td>
                      <div className="dashbox__table-text">TV Series</div>
                    </td>
                    <td>
                      <div className="dashbox__table-text dashbox__table-text--rate"><i className="ti ti-star"></i> 7.2</div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="dashbox__table-text dashbox__table-text--grey">602</div>
                    </td>
                    <td>
                      <div className="dashbox__table-text"><a href="#">Benched</a></div>
                    </td>
                    <td>
                      <div className="dashbox__table-text">Movie</div>
                    </td>
                    <td>
                      <div className="dashbox__table-text dashbox__table-text--rate"><i className="ti ti-star"></i> 6.3</div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="dashbox__table-text dashbox__table-text--grey">538</div>
                    </td>
                    <td>
                      <div className="dashbox__table-text"><a href="#">Whitney</a></div>
                    </td>
                    <td>
                      <div className="dashbox__table-text">TV Show</div>
                    </td>
                    <td>
                      <div className="dashbox__table-text dashbox__table-text--rate"><i className="ti ti-star"></i> 8.4</div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="dashbox__table-text dashbox__table-text--grey">129</div>
                    </td>
                    <td>
                      <div className="dashbox__table-text"><a href="#">Blindspotting</a></div>
                    </td>
                    <td>
                      <div className="dashbox__table-text">Anime</div>
                    </td>
                    <td>
                      <div className="dashbox__table-text dashbox__table-text--rate"><i className="ti ti-star"></i> 9.0</div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="dashbox__table-text dashbox__table-text--grey">360</div>
                    </td>
                    <td>
                      <div className="dashbox__table-text"><a href="#">Another</a></div>
                    </td>
                    <td>
                      <div className="dashbox__table-text">Movie</div>
                    </td>
                    <td>
                      <div className="dashbox__table-text dashbox__table-text--rate"><i className="ti ti-star"></i> 7.7</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* end dashbox */}

        {/* dashbox latest users */}
        <div className="col-12 col-xl-6">
          <div className="dashbox">
            <div className="dashbox__title">
              <h3><i className="ti ti-users"></i> Latest users</h3>
              <div className="dashbox__wrap">
                <a className="dashbox__refresh" href="#"><i className="ti ti-refresh"></i></a>
                <Link className="dashbox__more" to="/users">View All</Link>
              </div>
            </div>
            <div className="dashbox__table-wrap dashbox__table-wrap--3">
              <table className="dashbox__table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>FULL NAME</th>
                    <th>EMAIL</th>
                    <th>USERNAME</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div className="dashbox__table-text">23</div>
                    </td>
                    <td>
                      <div className="dashbox__table-text"><a href="#">Brian Cranston</a></div>
                    </td>
                    <td>
                      <div className="dashbox__table-text dashbox__table-text--grey">bcxwz@email.com</div>
                    </td>
                    <td>
                      <div className="dashbox__table-text">BrianXWZ</div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="dashbox__table-text">22</div>
                    </td>
                    <td>
                      <div className="dashbox__table-text"><a href="#">Jesse Plemons</a></div>
                    </td>
                    <td>
                      <div className="dashbox__table-text dashbox__table-text--grey">jess@email.com</div>
                    </td>
                    <td>
                      <div className="dashbox__table-text">Jesse.P</div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="dashbox__table-text">21</div>
                    </td>
                    <td>
                      <div className="dashbox__table-text"><a href="#">Matt Jones</a></div>
                    </td>
                    <td>
                      <div className="dashbox__table-text dashbox__table-text--grey">matt@email.com</div>
                    </td>
                    <td>
                      <div className="dashbox__table-text">Matty</div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="dashbox__table-text">20</div>
                    </td>
                    <td>
                      <div className="dashbox__table-text"><a href="#">Tess Harper</a></div>
                    </td>
                    <td>
                      <div className="dashbox__table-text dashbox__table-text--grey">harper@email.com</div>
                    </td>
                    <td>
                      <div className="dashbox__table-text">Harper123</div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="dashbox__table-text">19</div>
                    </td>
                    <td>
                      <div className="dashbox__table-text"><a href="#">Jonathan Banks</a></div>
                    </td>
                    <td>
                      <div className="dashbox__table-text dashbox__table-text--grey">bank@email.com</div>
                    </td>
                    <td>
                      <div className="dashbox__table-text">Jonathan</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* end dashbox */}

        {/* dashbox latest reviews */}
        <div className="col-12 col-xl-6">
          <div className="dashbox">
            <div className="dashbox__title">
              <h3><i className="ti ti-star-half-filled"></i> Latest reviews</h3>
              <div className="dashbox__wrap">
                <a className="dashbox__refresh" href="#"><i className="ti ti-refresh"></i></a>
                <Link className="dashbox__more" to="/reviews">View All</Link>
              </div>
            </div>
            <div className="dashbox__table-wrap dashbox__table-wrap--4">
              <table className="dashbox__table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>ITEM</th>
                    <th>AUTHOR</th>
                    <th>RATING</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div className="dashbox__table-text dashbox__table-text--grey">824</div>
                    </td>
                    <td>
                      <div className="dashbox__table-text"><a href="#">I Dream in Another Language</a></div>
                    </td>
                    <td>
                      <div className="dashbox__table-text">Eliza Josceline</div>
                    </td>
                    <td>
                      <div className="dashbox__table-text dashbox__table-text--rate"><i className="ti ti-star"></i> 7.2</div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="dashbox__table-text dashbox__table-text--grey">602</div>
                    </td>
                    <td>
                      <div className="dashbox__table-text"><a href="#">Benched</a></div>
                    </td>
                    <td>
                      <div className="dashbox__table-text">Ketut</div>
                    </td>
                    <td>
                      <div className="dashbox__table-text dashbox__table-text--rate"><i className="ti ti-star"></i> 6.3</div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="dashbox__table-text dashbox__table-text--grey">538</div>
                    </td>
                    <td>
                      <div className="dashbox__table-text"><a href="#">Whitney</a></div>
                    </td>
                    <td>
                      <div className="dashbox__table-text">Brian Cranston</div>
                    </td>
                    <td>
                      <div className="dashbox__table-text dashbox__table-text--rate"><i className="ti ti-star"></i> 8.4</div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="dashbox__table-text dashbox__table-text--grey">129</div>
                    </td>
                    <td>
                      <div className="dashbox__table-text"><a href="#">Blindspotting</a></div>
                    </td>
                    <td>
                      <div className="dashbox__table-text">Quang</div>
                    </td>
                    <td>
                      <div className="dashbox__table-text dashbox__table-text--rate"><i className="ti ti-star"></i> 9.0</div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="dashbox__table-text dashbox__table-text--grey">360</div>
                    </td>
                    <td>
                      <div className="dashbox__table-text"><a href="#">Another</a></div>
                    </td>
                    <td>
                      <div className="dashbox__table-text">Jackson Brown</div>
                    </td>
                    <td>
                      <div className="dashbox__table-text dashbox__table-text--rate"><i className="ti ti-star"></i> 7.7</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* end dashbox */}
      </div>
    </div>
  );
}

export default DashboardPage;