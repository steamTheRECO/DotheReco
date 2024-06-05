import React, { useState, useEffect } from 'react';
import './css/recoIng.css';
import { useNavigate } from "react-router-dom";
import TimeTableImage from "./images/Time table.png";
import CalendarImage from "./images/Calendar.png";
import TodoListImage from "./images/할 일 list.png";
import SettingImage from "./images/Setting.png";

// 카테고리별 색상 정의
const categoryColors = {
    1: '#DBE9CD', // 학교수업
    2: '#F0CAB9', // 과제
    3: '#e9c6ff', // 팀플
    4: '#FAE4A8', // 운동
    5: '#B9DEF0', // 약속
    6: '#e2e2da', // 기타
    // 추가 카테고리와 색상을 여기에 정의
};

const categoryNames = {
    1: '학교수업',
    2: '과제',
    3: '팀플',
    4: '운동',
    5: '약속',
    6: '기타'
};

const RecoIngMake = ({ recommendedSchedules }) => {
    const navigate = useNavigate();
    const [dates, setDates] = useState([]);
    const [timeTable, setTimeTable] = useState([]);
    const [isSideBarOpen, setIsSideBarOpen] = useState(false);
    const [schedules, setSchedules] = useState([]);
    const [selectedSchedules, setSelectedSchedules] = useState([]);
    const [isLoading, setLoading] = useState(false); // 로딩 상태를 저장할 상태 변수

    useEffect(() => {
        const storedEvents = JSON.parse(localStorage.getItem('events')) || [];
        const flexibleSchedules = storedEvents.filter(event => event.flexTitle);
        const sortedSchedules = flexibleSchedules.sort((a, b) => {
            const dateA = new Date(a.flexDeadline);
            const dateB = new Date(b.flexDeadline);
            return dateA - dateB;
        });
        setSchedules(sortedSchedules);
    }, []);

    useEffect(() => {
        const loadEvents = () => {
            const storedEvents = JSON.parse(localStorage.getItem('events')) || [];
            const today = new Date();
            const eventsForSelectedDate = storedEvents.filter(event => {
                const eventDate = new Date(event.fixedStartDay);
                return eventDate.toDateString() === today.toDateString();
            });

            // 미리 정의된 일정 추가
            const predefinedSchedules = [
                {
                    startTime: "08:00",
                    endTime: "09:30",
                    event: "인공지능",
                    category: 1,
                    place: "이화여자대학교"
                },
                {
                    startTime: "10:00",
                    endTime: "12:00",
                    event: "인공지능 과제",
                    category: 2,
                    place: "이화여자대학교"
                },
                {
                    startTime: "12:30",
                    endTime: "14:00",
                    event: "컴파일러",
                    category: 1,
                    place: "이화여자대학교"
                },
                {
                    startTime: "14:00",
                    endTime: "15:00",
                    event: "점심 약속",
                    category: 5,
                    place: "이화여자대학교"
                },
                {
                    startTime: "16:00",
                    endTime: "19:00",
                    event: "동아리",
                    category: 6,
                    place: "이화여자대학교 포스코관"
                },
                {
                    startTime: "19:30",
                    endTime: "20:30",
                    event: "올리브영",
                    category: 6,
                    place: "올리브영 신촌명물거리점"
                },
                {
                    startTime: "20:30",
                    endTime: "21:30",
                    event: "PT",
                    category: 4,
                    place: "헬스보이짐 신촌점"
                },
                {
                    startTime: "22:00",
                    endTime: "23:00",
                    event: "과외 준비",
                    category: 2,
                    place: "신촌 럭키아파트 102동"
                },
                {
                    startTime: "23:00",
                    endTime: "24:00",
                    event: "분리수거",
                    category: 6,
                    place: "신촌 럭키아파트 102동"
                }
            ];


            // 오늘의 일정과 미리 정의된 일정을 합치기
            const timeTableEvents = [
                ...predefinedSchedules,
                ...eventsForSelectedDate.map(event => ({
                    startTime: event.fixedStartTime,
                    endTime: event.fixedEndTime,
                    event: event.fixedTitle,
                    category: event.categoryCode,
                    place: event.place || ""
                }))
            ];

            setTimeTable(timeTableEvents);
        };
        loadEvents();
    }, []);

    const scheduleItems = [
        '인공지능 과제','올리브영', '과외 준비', '분리수거',
        '컴파일러 과제', '가상현실 과제', '골프 연습',
        '스터디 과제', '교환학생 서류 준비', '서점가기',
        '장보기', '컴파일러 시험 공부'
    ];

    const selectedScheduleItems = ['올리브영', '분리수거', '과외 준비', '인공지능 과제'];



    const goToTimeLine = () => {
        navigate('/timeLine');
    };

    const goToCalendar = () => {
        navigate('/Main');
    };

    const goToToDoList = () => {
        navigate('/ToDolist');
    };

    const goToSetting = () => {
        navigate('/Setting');
    }
    const goToTimeLineMake = () => {
        navigate('/TimeLineMake');
    }

    const formatTime = (time) => {
        const [hour, minute] = time.split(':');
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const formattedHour = hour % 12 || 12;
        return `${formattedHour}:${minute} ${ampm}`;
    };

    const calculateTimeDifference = (startTime, endTime) => {
        const start = new Date(`1970-01-01T${startTime}Z`);
        const end = new Date(`1970-01-01T${endTime}Z`);
        return (end - start) / (1000 * 60);
    };

    const getCategoryColor = (categoryCode) => {
        return categoryColors[categoryCode] || '#DBE9CD';
    };

    const getCategoryName = (categoryCode) => {
        return categoryNames[categoryCode] || '졸프';
    };

    const filteredTimeTable = timeTable.filter(item => {
        const [hour] = item.startTime.split(':');
        return parseInt(hour) >= 7 || parseInt(hour) === 0;
    });

    const toggleSideBar = () => {
        setIsSideBarOpen(!isSideBarOpen);
    };

    const closeSideBar = () => {
        setIsSideBarOpen(false);
    };

    const handleScheduleChange = (index) => {
        const updatedSelectedSchedules = [...selectedSchedules];
        if (updatedSelectedSchedules.includes(index)) {
            const scheduleIndex = updatedSelectedSchedules.indexOf(index);
            updatedSelectedSchedules.splice(scheduleIndex, 1);
        } else {
            updatedSelectedSchedules.push(index);
        }
        setSelectedSchedules(updatedSelectedSchedules);
    };


    return (
        <div className={`recoing-gray-box ${isSideBarOpen ? 'sidebar-open' : ''}`}>
            <button type="button" className="recoing-back-button" onClick={() => window.history.back()}>
                &lt;
            </button>
            <button type="button" className="recoing-edit-submit" onClick={toggleSideBar}>
                수정
            </button>
            <button type="submit" className="recoing-submit" form="reco-form">추천</button>
            <button type="submit" className="recoing-complete-submit" form="reco-form" onClick={goToTimeLineMake}>완료
            </button>

            {/* 타임 테이블 */}
            <div className="recoing-timetable-container">
                <div className="recoing-timetable">
                    {[...Array(17)].map((_, hour) => (
                        <div className="recoing-hour" key={hour}>
                            <div className="recoing-half-hour">
                                <div className="recoing-time-label">{formatTime(`${hour + 7}:00`)}</div>
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
                                                    height: `${duration * 1.4}px`,
                                                    backgroundColor: getCategoryColor(item.category)
                                                }}
                                            >
                                                <div className="event-title">{item.event}</div>
                                                <div className="event-time">
                                                    {formatTime(item.startTime)} - {formatTime(item.endTime)}
                                                </div>
                                                <div className="event-place">{item.place}</div>
                                            </div>
                                        );
                                    }
                                    return null;
                                })}
                            </div>
                            <div className="recoing-half-hour">
                                <div className="recoing-time-label">{formatTime(`${hour + 7}:30`)}</div>
                                {filteredTimeTable.map((item, index) => {
                                    const [startHour, startMinute] = item.startTime.split(':').map(Number);
                                    const [endHour, endMinute] = item.endTime.split(':').map(Number);
                                    if (startHour === hour + 7 && startMinute > 30) {
                                        const duration = calculateTimeDifference(item.startTime, item.endTime);
                                        return (
                                            <div
                                                className="timeline-event"
                                                key={index}
                                                style={{
                                                    top: `${startMinute}px`,
                                                    height: `${duration * 1.4}px`,
                                                    backgroundColor: getCategoryColor(item.category)
                                                }}
                                            >
                                                <div className="event-title">{item.event}</div>
                                                <div className="event-time">
                                                    {formatTime(item.startTime)} - {formatTime(item.endTime)}
                                                </div>
                                                <div className="event-place">{item.place}</div>
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

            {/*사이드바*/}
            <div className={`sidebar ${isSideBarOpen ? 'open' : ''}`}>
                <div className="sidebar-content">
                    <h2 className="reco-sidebar-flex">유동 스케줄</h2>
                    <ul className="schedule-list">
                        {schedules.map((schedule, index) => (
                            <li key={index} className="schedule-item">
                                {schedule.unfixedTitle}
                                <input
                                    type="checkbox"
                                    checked={selectedSchedules.includes(index)}
                                    onChange={() => handleScheduleChange(index)}
                                />
                            </li>
                        ))}
                        {/* Shortened version */}
                        {scheduleItems.map((item, index) => (
                            <li key={index} className="schedule-item">
                                {item}
                                <input
                                    type="checkbox"
                                    checked={selectedScheduleItems.includes(item)}
                                    onChange={() => handleScheduleChange(item)}
                                />
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* 하단 메뉴 바 */}
            <div className="menu">
                <div className="menu-details" onClick={goToTimeLine}>
                    <img className="TimeTableImage" src={TimeTableImage} alt="Time Table"/>
                    <p>Time table</p>
                </div>
                <div className="menu-details" onClick={goToCalendar}>
                    <img className="CalendarImage" src={CalendarImage} alt="Calendar"/>
                    <p>Calendar</p>
                </div>
                <div className="menu-details" onClick={goToToDoList}>
                    <img className="TodoListImage" src={TodoListImage} alt="To Do List"/>
                    <p>To Do list</p>
                </div>
                <div className="menu-details" onClick={goToSetting}>
                    <img className="SettingImage" src={SettingImage} alt="Setting"/>
                    <p>Setting</p>
                </div>
            </div>

            {/* 화면을 클릭하면 사이드바 닫기 */}
            {isSideBarOpen && <div className="sidebar-overlay" onClick={closeSideBar}></div>}
        </div>
    );
};

export default RecoIngMake;
