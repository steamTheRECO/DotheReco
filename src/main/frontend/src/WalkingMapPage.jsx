import React, { useEffect, useState, useRef } from 'react';
import markerImage from "./images/marker.png";
import { useNavigate, useLocation } from 'react-router-dom';
import './css/WalkingMap.css';
import TimeTableImage from "./images/Time table.png";
import CalendarImage from "./images/Calendar.png";
import TodoListImage from "./images/할 일 list.png";
import SettingImage from "./images/Setting.png";

// 카테고리별 색상 정의
const categoryColors = {
    1: '#F0CAB9', // 약속
    2: '#FAE4A8', // 예약
    3: '#B9DEF0', // 수업
    // 추가 카테고리와 색상을 여기에 정의
};

const categoryNames = {
    0: '졸프',
    1: '약속',
    2: '예약',
    3: '수업'
};

const WalkingMapPage = () => {
    const [mapInitialized, setMapInitialized] = useState(false);
    const [map, setMap] = useState(null);
    const [markers, setMarkers] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [userLocation, setUserLocation] = useState({ lat: 37.561451, lon: 126.946778 }); // 기본값은 이화여자대학교
    const [coordinate1, setCoordinate1] = useState({ lat: 37.5665, lon: 126.9780 }); // 예시 좌표 1
    const [coordinate2, setCoordinate2] = useState({ lat: 37.5651, lon: 126.9895 }); // 예시 좌표 2
    const mapRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();
    const [timeTable, setTimeTable] = useState([]);

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

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation({ lat: latitude, lon: longitude });
                },
                error => {
                    console.error("Error getting user's location:", error);
                }
            );
        }
    }, []);

    useEffect(() => {
        if (mapInitialized && window.Tmapv3 && !map) {
            const mapInstance = new window.Tmapv3.Map("map_div", {
                center: new window.Tmapv3.LatLng(userLocation.lat, userLocation.lon),
                width: "100%",
                height: "800px",
                zoom: 16
            });
            setMap(mapInstance);

            // Create markers for the two coordinates
            const marker1 = new window.Tmapv3.Marker({
                position: new window.Tmapv3.LatLng(coordinate1.lat, coordinate1.lon),
                icon: markerImage,
                iconSize: new window.Tmapv3.Size(24, 38),
                map: mapInstance
            });

            const marker2 = new window.Tmapv3.Marker({
                position: new window.Tmapv3.LatLng(coordinate2.lat, coordinate2.lon),
                icon: markerImage,
                iconSize: new window.Tmapv3.Size(24, 38),
                map: mapInstance
            });

            setMarkers([marker1, marker2]);
        }
    }, [mapInitialized, userLocation]);

    const handleSearch = () => {
        if (!map) return;

        const center = map.getCenter();
        const centerLat = center._lat;
        const centerLon = center._lng;

        fetch(`https://apis.openapi.sk.com/tmap/pois?version=1&format=json&searchKeyword=${encodeURIComponent(searchKeyword)}&centerLat=${centerLat}&centerLon=${centerLon}&radius=5&resCoordType=WGS84GEO&reqCoordType=WGS84GEO&count=20`, {
            method: 'GET',
            headers: {
                "appKey": "0ZSTJ6jGf15NagHDb0wOT5Q06tnZG7Yw2vKYVzqo"
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.searchPoiInfo && data.searchPoiInfo.pois && data.searchPoiInfo.pois.poi) {
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
                            map: map
                        });

                        bounds.extend(markerPosition);
                        return marker;
                    });

                    setMarkers(newMarkers);
                    setSearchResult(resultpoisData);
                    map.fitBounds(bounds);
                } else {
                    alert("검색 결과가 없습니다.");
                }
            })
            .catch(error => console.error('Error:', error));
    };

    const handleMarkerClick = (poi) => {
        const lat = parseFloat(poi.frontLat);
        const lon = parseFloat(poi.frontLon);
        const name = poi.name;

        const markerPosition = new window.Tmapv3.LatLng(lat, lon);

        const marker = new window.Tmapv3.Marker({
            position: markerPosition,
            icon: markerImage,
            iconSize: new window.Tmapv3.Size(24, 38),
            title: name,
            map: map
        });

        markers.forEach(marker => marker.setMap(null));
        setMarkers([marker]);
        setSelectedPlace(name);
    };

    const handleConfirm = () => {
        const place = selectedPlace || searchKeyword;
        const previousPath = location.state?.from || '/';

        navigate(previousPath, { state: { place } });
    };

    const formatTime = (time) => {
        const [hour, minute] = time.split(':');
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const formattedHour = hour % 12 || 12;
        return `${formattedHour}:${minute} ${ampm}`;
    };

    const calculateTimeDifference = (startTime, endTime) => {
        const start = new Date(`1970-01-01T${startTime}Z`);
        const end = new Date(`1970-01-01T${endTime}Z`);
        return (end - start) / (1000 * 60); // minutes
    };

    const getCategoryColor = (categoryCode) => {
        return categoryColors[categoryCode] || '#DBE9CD'; // 기본 색상: 졸프
    };

    const getCategoryName = (categoryCode) => {
        return categoryNames[categoryCode] || '졸프';
    };

    // 새벽 1시부터 7시까지의 이벤트 필터링
    const filteredTimeTable = timeTable.filter(item => {
        const [hour] = item.startTime.split(':');
        return parseInt(hour) >= 7 || parseInt(hour) === 0;
    });

    const goToTimeLine = () => {
        navigate('/timeLine');
    };

    const goToCalendar = () => {
        navigate('/Main');
    };

    const goToToDoList = () => {
        navigate('/ToDolist');
    };

    const goToSetting=()=>{
        navigate('/Setting');
    }

    return (
        <div className="Tmapplace-gray-box">
            <button type="button" className="Tmapplace-back-button" onClick={() => window.history.back()}>
                &lt;
            </button>
            <div className="Tmapplace-content">
                <div id="map_div" className="Tmap_wrap" ref={mapRef}></div>
                <div className="rst_wrap">
                    <div className="rst mCustomScrollbar">
                        <ul id="searchResult" className="searchResult">
                            {searchResult.map((poi, index) => (
                                <li key={index} onClick={() => handleMarkerClick(poi)}>
                                    <span>{poi.name}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* 타임 테이블 */}
            <div className="Tmapplace-timetable-container">
                <div className="Tmapplace-timetable">
                    {[...Array(17)].map((_, hour) => (
                        <div className="Tmapplace-hour" key={hour}>
                            <div className="Tmapplace-half-hour">
                                <div className="Tmapplace-time-label">{formatTime(`${hour + 7}:00`)}</div>
                                {filteredTimeTable.map((item, index) => {
                                    const [startHour, startMinute] = item.startTime.split(':').map(Number);
                                    const [endHour, endMinute] = item.endTime.split(':').map(Number);
                                    if (startHour === hour + 7 && startMinute <= 30) {
                                        const duration = calculateTimeDifference(item.startTime, item.endTime);
                                        return (
                                            <div
                                                className="timeline-event"
                                                key={index}
                                                style={{
                                                    top: `${startMinute}px`,
                                                    height: `${duration * 1.4}px`, // Each minute is 2 pixels
                                                    backgroundColor: getCategoryColor(item.category)
                                                }}
                                            >
                                                <div className="event-title">{item.event}</div>
                                                <div className="event-time">
                                                    {formatTime(item.startTime)} - {formatTime(item.endTime)}
                                                </div>
                                                <div className="event-category-container">
                                                    <div
                                                        className="event-category">{getCategoryName(item.category)}</div>
                                                </div>
                                            </div>
                                        );
                                    }
                                    return null;
                                })}
                            </div>
                            <div className="Tmapplace-half-hour">
                                <div className="Tmapplace-time-label">{formatTime(`${hour + 7}:30`)}</div>
                                {filteredTimeTable.map((item, index) => {
                                    const [startHour, startMinute] = item.startTime.split(':').map(Number);
                                    if (startHour === hour + 7 && startMinute > 30) {
                                        const duration = calculateTimeDifference(item.startTime, item.endTime);
                                        return (
                                            <div
                                                className="timeline-event"
                                                key={index}
                                                style={{
                                                    top: `${startMinute}px`,
                                                    height: `${duration * 2}px`, // Each minute is 2 pixels
                                                    backgroundColor: getCategoryColor(item.category)
                                                }}
                                            >
                                                <div className="event-title">{item.event}</div>
                                                <div className="event-time">
                                                    {formatTime(item.startTime)} - {formatTime(item.endTime)}
                                                </div>
                                            </div>
                                        );
                                    }
                                    return null;
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 하단 메뉴 바 */}
            <div className="menu">
                <div className="menu-details">
                    <img className="TimeTableImage" src={TimeTableImage} alt="Time Table" onClick={goToTimeLine}/>
                    <p>Time table</p>
                </div>
                <div className="menu-details">
                    <img className="CalendarImage" src={CalendarImage} alt="Calendar" onClick={goToCalendar}/>
                    <p>Calendar</p>
                </div>
                <div className="menu-details">
                    <img className="TodoListImage" src={TodoListImage} alt="To Do List" onClick={goToToDoList}/>
                    <p>To Do list</p>
                </div>
                <div className="menu-details">
                    <img className="SettingImage" src={SettingImage} alt="Setting" onClick={goToSetting}/>
                    <p>Setting</p>
                </div>
            </div>
        </div>
    );
};

export default WalkingMapPage;
