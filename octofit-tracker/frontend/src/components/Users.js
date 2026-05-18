import React, { useCallback, useEffect, useMemo, useState } from 'react';

const API_BASE_URL = process.env.REACT_APP_CODESPACE_NAME
  ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api`
  : 'http://localhost:8000/api';

function Users() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [showModal, setShowModal] = useState(false);
  const endpoint = `${API_BASE_URL}/users/`;

  const fetchData = useCallback(() => {
    setLoading(true);
    setError(null);
    console.log('[Users] endpoint', endpoint);

    fetch(endpoint)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status} ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log('[Users] fetched data', data);
        const payload = Array.isArray(data)
          ? data
          : Array.isArray(data.results)
          ? data.results
          : [];
        setItems(payload);
      })
      .catch((err) => {
        console.error('[Users] fetch error', err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [endpoint]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredItems = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    if (!query) {
      return items;
    }
    return items.filter((item) => JSON.stringify(item).toLowerCase().includes(query));
  }, [items, searchText]);

  const tableColumns = useMemo(() => {
    if (!items.length) {
      return ['value'];
    }
    const objectItem = items.find((item) => item && typeof item === 'object' && !Array.isArray(item));
    return objectItem ? Object.keys(objectItem) : ['value'];
  }, [items]);

  const renderValue = (item, key) => {
    if (key === 'value' || typeof item !== 'object' || Array.isArray(item)) {
      return JSON.stringify(item);
    }
    const value = item[key];
    if (value === null || value === undefined) {
      return '';
    }
    return typeof value === 'object' ? JSON.stringify(value) : String(value);
  };

  return (
    <div className="card mb-4 shadow-sm">
      <div className="card-header d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
        <div>
          <h2 className="h4 mb-1">Users</h2>
          <p className="text-muted mb-0">
            REST endpoint: <a href={endpoint} className="link-primary" target="_blank" rel="noreferrer">{endpoint}</a>
          </p>
        </div>
        <div className="btn-group">
          <button type="button" className="btn btn-primary" onClick={() => setShowModal(true)}>
            View JSON
          </button>
          <button type="button" className="btn btn-outline-secondary" onClick={fetchData} disabled={loading}>
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      <div className="card-body">
        <form className="row g-2 align-items-center mb-3" onSubmit={(event) => event.preventDefault()}>
          <div className="col-sm-8 col-md-6">
            <label htmlFor="usersSearch" className="form-label visually-hidden">
              Search users
            </label>
            <input
              id="usersSearch"
              type="search"
              className="form-control"
              placeholder="Search users"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
            />
          </div>
          <div className="col-auto">
            <button type="button" className="btn btn-outline-secondary" onClick={() => setSearchText('')}>
              Clear
            </button>
          </div>
        </form>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                {tableColumns.map((column) => (
                  <th key={column}>{column}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredItems.length > 0 ? (
                filteredItems.map((item, rowIndex) => (
                  <tr key={`user-${rowIndex}`}>
                    {tableColumns.map((column) => (
                      <td key={column}>{renderValue(item, column)}</td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={tableColumns.length} className="text-center py-4 text-muted">
                    {loading ? 'Loading users...' : 'No users found.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal d-block" tabIndex={-1} role="dialog" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="modal-dialog modal-xl modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Users JSON</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={() => setShowModal(false)} />
              </div>
              <div className="modal-body">
                <pre className="mb-0">{JSON.stringify(items, null, 2)}</pre>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;
