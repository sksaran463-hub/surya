import React, { useState, useEffect } from 'react';
import './History.css';

const API_BASE_URL = 'http://127.0.0.1:5000';

function History() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/history`);

            if (!response.ok) {
                throw new Error('Failed to fetch history');
            }

            const data = await response.json();
            // Reverse to show latest first
            setHistory(data.reverse());
        } catch (err) {
            setError(err.message || 'An error occurred while fetching history');
        } finally {
            setLoading(false);
        }
    };

    const formatConfidence = (confidence) => {
        if (!confidence) return 'N/A';
        return `${(confidence * 100).toFixed(1)}%`;
    };

    const getConfidenceClass = (confidence) => {
        if (!confidence) return '';
        if (confidence >= 0.8) return 'high';
        if (confidence >= 0.5) return 'medium';
        return 'low';
    };

    if (loading) {
        return (
            <div className="history-container">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading history...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="history-container">
                <div className="error-container">
                    <span className="error-icon">⚠️</span>
                    <p>{error}</p>
                    <button className="retry-button" onClick={fetchHistory}>
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="history-container">
            <div className="history-content">
                <div className="history-header">
                    <h1 className="page-title">Detection History</h1>
                    <p className="page-subtitle">View all previous plate detections</p>
                    <button className="refresh-button" onClick={fetchHistory}>
                        <span className="refresh-icon">🔄</span>
                        Refresh
                    </button>
                </div>

                {history.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">📋</div>
                        <h2>No History Available</h2>
                        <p>Start detecting license plates to see them here</p>
                    </div>
                ) : (
                    <div className="history-table-container">
                        <table className="history-table">
                            <thead>
                                <tr>
                                    <th>Plate Number</th>
                                    <th>Confidence</th>
                                    <th>Timestamp</th>
                                    <th>Image Preview</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.map((record, index) => (
                                    <tr key={index} className="history-row">
                                        <td className="plate-cell">
                                            <span className="plate-number">{record.plate_number || 'N/A'}</span>
                                        </td>
                                        <td className="confidence-cell">
                                            <span className={`confidence-badge ${getConfidenceClass(record.confidence)}`}>
                                                {formatConfidence(record.confidence)}
                                            </span>
                                        </td>
                                        <td className="timestamp-cell">
                                            {record.timestamp}
                                        </td>
                                        <td className="image-cell">
                                            {record.image_path ? (
                                                <img
                                                    src={`${API_BASE_URL}/${record.image_path}`}
                                                    alt={`Plate ${record.plate_number}`}
                                                    className="preview-thumbnail"
                                                    onClick={() => window.open(`${API_BASE_URL}/${record.image_path}`, '_blank')}
                                                />
                                            ) : (
                                                <span className="no-image">No Image</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default History;
