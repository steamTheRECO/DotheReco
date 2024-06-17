import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './css/TmapComponent.css';

const TmapComponent = () => {
    const [searchKeyword, setSearchKeyword] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [isKeyword, setIsKeyword] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    const handleSearch = () => {
        fetch(`https://apis.openapi.sk.com/tmap/pois?version=1&format=json&searchKeyword=${encodeURIComponent(searchKeyword)}&resCoordType=WGS84GEO&reqCoordType=WGS84GEO&count=20`, {
            method: 'GET',
            headers: {
                "appKey": "0ZSTJ6jGf15NagHDb0wOT5Q06tnZG7Yw2vKYVzqo"
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.searchPoiInfo && data.searchPoiInfo.pois && data.searchPoiInfo.pois.poi) {
                    setSearchResult(data.searchPoiInfo.pois.poi);
                } else {
                    alert("검색 결과가 없습니다.");
                }
            })
            .catch(error => console.error('Error:', error));
    };

    const handleMarkerClick = (poi) => {
        setSearchKeyword(poi.name);
        setSelectedPlace({
            name: poi.name,
            lat: poi.frontLat,
            lon: poi.frontLon
        });
        setIsKeyword(false);
    };

    const handleConfirm = () => {
        const place = selectedPlace ? selectedPlace.name : searchKeyword;
        const lat = selectedPlace ? selectedPlace.lat : null;
        const lon = selectedPlace ? selectedPlace.lon : null;

        const previousPath = location.state?.from || '/';
        const scheduleData = location.state?.scheduleData || {};

        navigate(previousPath, {
            state: {
                place,
                lat,
                lon,
                scheduleData: {
                    ...scheduleData,
                    placeName: place ? place : null,
                    isKeyword: place ? isKeyword : false,
                    lat: place && !isKeyword ? lat : null,
                    lon: place && !isKeyword ? lon : null
                }
            }
        });
    };

    return (
        <div className="Tmapplace-gray-box">
            <button type="button" className="Tmapplace-back-button" onClick={() => window.history.back()}>
                &lt;
            </button>
            <button type="submit" className="Tmapplace-submit" onClick={handleConfirm}>완료</button>
            <h1 className="Tmapplace-h1">장소 검색</h1>
            <div className="Tmapplace-search-bar">
                <input
                    type="text"
                    className="Tmapplace-text_custom"
                    value={searchKeyword}
                    onChange={e => { setSearchKeyword(e.target.value); setIsKeyword(true); }} // 검색어 변경되면 키워드로 설정
                />
                <button className="Tmapplace-search-button" onClick={handleSearch}>검색</button>
            </div>
            <div className="Tmapplace-search-results">
                <div className="Tmapplace-rst_wrap">
                    <div className="Tmapplace-rst mCustomScrollbar">
                        <ul id="searchResult" name="Tmapplace-searchResult">
                            {searchResult.map((poi, index) => (
                                <li key={index} onClick={() => handleMarkerClick(poi)}>
                                    <span>{poi.name}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
            {selectedPlace && (
                <div className="Tmapplace-selected-info">
                    <p>선택된 장소: {selectedPlace.name}</p>
                    <p>위도: {selectedPlace.lat}</p>
                    <p>경도: {selectedPlace.lon}</p>
                </div>
            )}
        </div>
    );
};

export default TmapComponent;
