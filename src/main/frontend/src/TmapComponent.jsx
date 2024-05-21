import React, { useEffect, useState, useRef } from 'react';

import markerImage from "./images/marker.png";

const TmapComponent = () => {
    const [mapInitialized, setMapInitialized] = useState(false);
    const [markers, setMarkers] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const mapRef = useRef(null);
    const labelArr = useRef([]);

    useEffect(() => {
        const scriptId = 'tmap-script';
        if (!document.getElementById(scriptId)) {
            const script = document.createElement('script');
            script.src = "https://apis.openapi.sk.com/tmap/jsv3?version=1&appKey=0ZSTJ6jGf15NagHDb0wOT5Q06tnZG7Yw2vKYVzqo";
            script.async = true;
            script.id = scriptId;
            script.onload = () => {
                console.log("Script loaded");
                setMapInitialized(true);
            };
            script.onerror = () => {
                console.error("Failed to load the Tmap script");
            };
            document.head.appendChild(script);
        } else {
            setMapInitialized(true);
        }
    }, []);

    useEffect(() => {
        if (mapInitialized && window.Tmapv3) {
            mapRef.current = new window.Tmapv3.Map("map_div", {
                center: new window.Tmapv3.LatLng(37.561451, 126.946778),
                width: "100%",
                height: "800px",
                zoom: 16
            });
        }
    }, [mapInitialized]);

    const poiDetail = (poiId) => {
        const headers = {
            "appKey": "0ZSTJ6jGf15NagHDb0wOT5Q06tnZG7Yw2vKYVzqo"
        };

        fetch(`https://apis.openapi.sk.com/tmap/pois/${poiId}?version=1&resCoordType=EPSG3857&format=json`, {
            method: 'GET',
            headers: headers
        })
            .then(response => response.json())
            .then(data => {
                const detailInfo = data.poiDetailInfo;
                const name = detailInfo.name;
                const address = detailInfo.address;

                const noorLat = parseFloat(detailInfo.frontLat);
                const noorLon = parseFloat(detailInfo.frontLon);

                const pointCng = new window.Tmapv3.Point(noorLon, noorLat);
                const projectionCng = new window.Tmapv3.Projection.convertEPSG3857ToWGS84GEO(pointCng);

                const lat = projectionCng._lat;
                const lon = projectionCng._lng;

                const labelPosition = new window.Tmapv3.LatLng(lat, lon);

                const content = `<div style="border-radius: 10px; background-color: #2f4f4f; position: relative; line-height: 15px; padding: 5px 5px 2px 4px; right: 65px;">
                            <div style="font-size: 11px; font-weight: bold; line-height: 15px; color: white;">
                                Name: ${name} <br>
                                Address: ${address}
                            </div>
                        </div>`;

                const labelInfo = new window.Tmapv3.Label({
                    position: labelPosition,
                    content: content,
                    map: mapRef.current
                });

                labelArr.current.push(labelInfo);
            })
            .catch(error => console.error('Error:', error));
    };

    const handleSearch = () => {
        fetch(`https://apis.openapi.sk.com/tmap/pois?version=1&format=json&searchKeyword=${encodeURIComponent(searchKeyword)}&resCoordType=WGS84GEO&reqCoordType=WGS84GEO&count=10`, {
            method: 'GET',
            headers: {
                "appKey": "0ZSTJ6jGf15NagHDb0wOT5Q06tnZG7Yw2vKYVzqo"
            }
        })
            .then(response => response.json())
            .then(data => {
                const resultpoisData = data.searchPoiInfo.pois.poi;

                markers.forEach(marker => marker.setMap(null));
                setMarkers([]);

                let bounds = new window.Tmapv3.LatLngBounds();

                const newMarkers = resultpoisData.map((poi, index) => {
                    const lat = parseFloat(poi.frontLat);
                    const lon = parseFloat(poi.frontLon);
                    const name = poi.name;

                    const markerPosition = new window.Tmapv3.LatLng(lat, lon);

                    const marker = new window.Tmapv3.Marker({
                        position: markerPosition,
                        icon: markerImage,
                        iconSize: new window.Tmapv3.Size(24, 38),
                        title: name,
                        map: mapRef.current
                    });

                    bounds.extend(markerPosition);
                    return marker;
                });

                setMarkers(newMarkers);
                setSearchResult(resultpoisData);
                mapRef.current.fitBounds(bounds);
            })
            .catch(error => console.error('Error:', error));
    };

    return (
        <div>
            <div>
                <input
                    type="text"
                    className="text_custom"
                    value={searchKeyword}
                    onChange={e => setSearchKeyword(e.target.value)}
                />
                <button onClick={handleSearch}>적용하기</button>
            </div>
            <div style={{ display: 'flex' }}>
                <div style={{ width: '30%' }}>
                    <div className="title"><strong>Search</strong> Results</div>
                    <div className="rst_wrap">
                        <div className="rst mCustomScrollbar">
                            <ul id="searchResult" name="searchResult">
                                {searchResult.map((poi, index) => (
                                    <li key={index} onClick={() => poiDetail(poi.id)}>
                                        <span>{poi.name}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
                <div id="map_div" className="map_wrap" style={{ width: '70%' }}></div>
            </div>
        </div>
    );
};

export default TmapComponent;