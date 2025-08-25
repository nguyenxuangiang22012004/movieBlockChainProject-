import React from 'react';
import { Link } from 'react-router-dom';

function Pagination() {
  return (
    <div className="col-12">
      {/* paginator mobile */}
      <div className="paginator-mob">
        <span className="paginator-mob__pages">18 of 1713</span>
        <ul className="paginator-mob__nav">
          <li><Link to="#"><span>Prev</span></Link></li>
          <li><Link to="#"><span>Next</span></Link></li>
        </ul>
      </div>
      {/* end paginator mobile */}

      {/* paginator desktop */}
      <ul className="paginator">
        <li className="paginator__item paginator__item--prev"><Link to="#"><i className="ti ti-chevron-left"></i></Link></li>
        <li className="paginator__item"><Link to="#">1</Link></li>
        <li className="paginator__item paginator__item--active"><Link to="#">2</Link></li>
        <li className="paginator__item"><Link to="#">3</Link></li>
        <li className="paginator__item"><Link to="#">4</Link></li>
        <li className="paginator__item"><span>...</span></li>
        <li className="paginator__item"><Link to="#">87</Link></li>
        <li className="paginator__item paginator__item--next"><Link to="#"><i className="ti ti-chevron-right"></i></Link></li>
      </ul>
      {/* end paginator desktop */}
    </div>
  );
}

export default Pagination;