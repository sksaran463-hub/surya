import React, { useState } from 'react';
import './Home.css';

const API_BASE_URL = 'http://127.0.0.1:5000';

function Home() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            setResult(null);
            setError(null);
        }
    };

    const handleDetect = async () => {
        if (!selectedFile) {
            setError('Please select a file first');
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await fetch(`${API_BASE_URL}/detect`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Detection failed. Please try again.');
            }

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            setResult(data);
        } catch (err) {
            setError(err.message || 'An error occurred during detection');
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        setResult(null);
        setError(null);
    };

    return (
        <div className="home-container">
            {/* Hero Section */}
            <div className="hero-section">
                <div className="hero-content">
                    <div className="hero-text">
                        <h1 className="hero-title">
                            <span className="title-main">ANPR</span>
                            <span className="title-subtitle">Automatic Number Plate Recognition</span>
                        </h1>
                        <p className="hero-description">
                            Advanced AI-powered license plate detection system. Upload images or videos to instantly detect and recognize vehicle number plates with high accuracy.
                        </p>
                        <div className="hero-features">
                            <div className="feature-item">
                                <span className="feature-icon">⚡</span>
                                <span>Real-time Detection</span>
                            </div>
                            <div className="feature-item">
                                <span className="feature-icon">🎯</span>
                                <span>High Accuracy</span>
                            </div>
                            <div className="feature-item">
                                <span className="feature-icon">🔒</span>
                                <span>Secure Processing</span>
                            </div>
                        </div>
                    </div>
                    <div className="hero-illustration">
                        {/* Car with License Plate SVG Illustration */}
                        <svg viewBox="0 0 400 300" className="car-svg">
                            {/* Camera */}
                            <g className="camera-group">
                                <rect x="180" y="40" width="40" height="35" rx="5" fill="#fff" opacity="0.9" />
                                <circle cx="200" cy="57" r="12" fill="#5B4FE9" />
                                <circle cx="200" cy="57" r="6" fill="#7B3FF2" />
                                <line x1="200" y1="75" x2="200" y2="95" stroke="#fff" strokeWidth="2" strokeDasharray="4" />
                            </g>

                            {/* Car 1 - Purple */}
                            <g className="car-float" style={{ animationDelay: '0s' }}>
                                <ellipse cx="100" cy="200" rx="45" ry="20" fill="rgba(91, 79, 233, 0.2)" />
                                <rect x="60" y="160" width="80" height="35" rx="8" fill="#5B4FE9" />
                                <rect x="70" y="145" width="60" height="20" rx="6" fill="#7B3FF2" />
                                <circle cx="75" cy="195" r="8" fill="#2d3748" />
                                <circle cx="125" cy="195" r="8" fill="#2d3748" />
                                <rect x="75" y="175" width="50" height="8" rx="4" fill="#fff" opacity="0.9" />
                                <text x="100" y="182" textAnchor="middle" fill="#2d3748" fontSize="6" fontWeight="bold">AB1234</text>
                            </g>

                            {/* Car 2 - Cyan */}
                            <g className="car-float" style={{ animationDelay: '1s' }}>
                                <ellipse cx="300" cy="220" rx="45" ry="20" fill="rgba(34, 211, 238, 0.2)" />
                                <rect x="260" y="180" width="80" height="35" rx="8" fill="#22d3ee" />
                                <rect x="270" y="165" width="60" height="20" rx="6" fill="#06b6d4" />
                                <circle cx="275" cy="215" r="8" fill="#2d3748" />
                                <circle cx="325" cy="215" r="8" fill="#2d3748" />
                                <rect x="275" y="195" width="50" height="8" rx="4" fill="#fff" opacity="0.9" />
                                <text x="300" y="202" textAnchor="middle" fill="#2d3748" fontSize="6" fontWeight="bold">CD9876</text>
                            </g>

                            {/* Scan Lines */}
                            <line x1="200" y1="95" x2="100" y2="175" stroke="#fff" strokeWidth="1" opacity="0.3" className="scan-line" />
                            <line x1="200" y1="95" x2="300" y2="195" stroke="#fff" strokeWidth="1" opacity="0.3" className="scan-line" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="main-content">
                <div className="upload-card">
                    <h2 className="section-title">Upload & Detect</h2>
                    <div className="upload-section">
                        <input
                            type="file"
                            id="file-input"
                            accept="image/*,video/*"
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                        />
                        <label htmlFor="file-input" className="upload-label">
                            <div className="upload-icon">
                                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                            </div>
                            <div className="upload-text">
                                {selectedFile ? selectedFile.name : 'Choose Image or Video'}
                            </div>
                            <div className="upload-hint">Supports JPG, PNG, MP4 • Max 10MB</div>
                        </label>

                        {previewUrl && (
                            <div className="preview-container">
                                {selectedFile.type.startsWith('image/') ? (
                                    <img src={previewUrl} alt="Preview" className="preview-image" />
                                ) : (
                                    <video src={previewUrl} controls className="preview-video" />
                                )}
                            </div>
                        )}
                    </div>

                    <div className="button-group">
                        <button
                            className="detect-button"
                            onClick={handleDetect}
                            disabled={!selectedFile || loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner"></span>
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <circle cx="11" cy="11" r="8" strokeWidth="2" />
                                        <path d="M21 21l-4.35-4.35" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                    Detect Plate
                                </>
                            )}
                        </button>

                        {selectedFile && (
                            <button className="reset-button" onClick={handleReset}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Reset
                            </button>
                        )}
                    </div>

                    {error && (
                        <div className="error-message">
                            <span className="error-icon">⚠️</span>
                            {error}
                        </div>
                    )}
                </div>

                {result && (
                    <div className="result-card">
                        <h2 className="result-title">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ display: 'inline', marginRight: '8px' }}>
                                <polyline points="20 6 9 17 4 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Detection Result
                        </h2>

                        <div className="result-details">
                            <div className="result-item">
                                <span className="result-label">Plate Number</span>
                                <span className="result-value plate-number">{result.plate_number || 'Not Detected'}</span>
                            </div>

                            <div className="result-item">
                                <span className="result-label">Confidence Score</span>
                                <div className="confidence-container">
                                    <span className="result-value confidence">
                                        {result.confidence ? `${(result.confidence * 100).toFixed(1)}%` : 'N/A'}
                                    </span>
                                    {result.confidence && (
                                        <div className="confidence-bar">
                                            <div className="confidence-fill" style={{ width: `${result.confidence * 100}%` }}></div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {result.output_file && (
                            <div className="output-section">
                                <h3 className="output-title">Processed Output</h3>
                                {selectedFile.type.startsWith('image/') ? (
                                    <img
                                        src={`${API_BASE_URL}/${result.output_file}`}
                                        alt="Detected plate"
                                        className="output-image"
                                    />
                                ) : (
                                    <video
                                        src={`${API_BASE_URL}/${result.output_file}`}
                                        controls
                                        className="output-video"
                                    />
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Home;
