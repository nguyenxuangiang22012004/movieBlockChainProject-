import React from "react";

function MovieDetailModal({ viewItem }) {
  return (
    <div
      className="modal fade"
      id="modal-view2"
      tabIndex="-1"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content bg-dark text-light border-0 rounded-3 shadow-lg">
          <div className="modal-body p-4">
            {viewItem ? (
              <>
                {/* Header */}
                <div className="d-flex align-items-center mb-4">
                  {viewItem.poster && (
                    <img
                      src={viewItem.poster}
                      alt={viewItem.title}
                      className="rounded me-3"
                      style={{
                        width: "100px",
                        height: "150px",
                        objectFit: "cover",
                        border: "2px solid #333",
                      }}
                    />
                  )}
                  <div>
                    <h3 className="mb-1">{viewItem.title}</h3>
                    <div className="d-flex flex-wrap gap-2 mt-2">
                      <span className="badge bg-info">
                        {viewItem.category || "Uncategorized"}
                      </span>
                      <span
                        className={`badge ${
                          viewItem.status === "Active"
                            ? "bg-success"
                            : "bg-danger"
                        }`}
                      >
                        {viewItem.status}
                      </span>
                      {viewItem.rating && (
                        <span className="badge bg-warning text-dark">
                          ⭐ {viewItem.rating}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="row g-3">
                  <div className="col-md-6">
                    <p>
                      <strong>Views:</strong> {viewItem.views || 0}
                    </p>
                    <p>
                      <strong>Created:</strong>{" "}
                      {viewItem.createdAt
                        ? new Date(viewItem.createdAt).toLocaleString()
                        : "-"}
                    </p>
                  </div>
                  <div className="col-md-6">
                    <p>
                      <strong>Description:</strong>
                    </p>
                    <div
                      className="p-3 bg-secondary rounded"
                      style={{
                        maxHeight: "150px",
                        overflowY: "auto",
                        fontSize: "0.95rem",
                      }}
                    >
                      {viewItem.description || "No description available."}
                    </div>
                  </div>
                </div>

                {/* Poster full preview */}
                {viewItem.poster && (
                  <div className="text-center mt-4">
                    <img
                      src={viewItem.poster}
                      alt={viewItem.title}
                      className="img-fluid rounded shadow"
                      style={{
                        maxHeight: "300px",
                        objectFit: "contain",
                      }}
                    />
                  </div>
                )}

                {/* Footer */}
                <div className="d-flex justify-content-end mt-4">
                  <button
                    className="btn btn-outline-light px-4"
                    type="button"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-5">
                <div className="spinner-border text-warning" role="status"></div>
                <p className="mt-3">Loading movie details...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetailModal;
