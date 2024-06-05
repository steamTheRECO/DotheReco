import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import './css/main.css';
import searchImage from './images/search.png';
import addScheduleImage from './images/addSchedule.png';
import SettingImage from './images/Setting.png';
import TimeTableImage from './images/Time table.png';
import CalendarImage from './images/Calendar.png';
import TodoListImage from './images/할 일 list.png';
import axios from 'axios';

const FirstMainPage = () => {
    const [date, setDate] = useState(new Date());
    const [mini_date, mini_setDate] = useState(new Date());
    const [selectedMiniDates, setSelectedMiniDates] = useState([]);
    const navigate = useNavigate();
    const [isDragging, setIsDragging] = useState(false);
    const selectedDatesRef = useRef(new Set());
    const [events, setEvents] = useState([]);
    const location = useLocation();

    const [showEstimatedPicker, setShowEstimatedPicker] = useState(false);
    const [selectedEstimated, setSelectedEstimated] = useState('');

    //  const [recommendedSlots, setRecommendedSlots] = useState([]); /////
    const [recommendedTimes, setRecommendedTimes] = useState([]); // 추천된 시간대를 저장하는 상태

    const getCategoryColor = (categoryCode) => {
        // 카테고리 코드에 따라 다른 색상을 반환
        switch (categoryCode) {
            case 1:
                return '#DBE9CD'; // 학교수업
            case 2:
                return '#F0CAB9'; // 과제
            case 3:
                return '#e9c6ff'; // 팀플
            case 4:
                return '#FAE4A8'; // 운동
            case 5:
                return '#B9DEF0'; // 생활
            case 6:
                return '#FFDEAD'; // 기타
            default:
                return '#e2e2da'; // 기본 색상
        }
    };

    useEffect(() => {

        // 미리 넣어둘 일정 데이터를 정의합니다.
        const initialEvents = [
            {
                fixedTitle: '가상현실',
                fixedStartDay: '2024-05-13',
                fixedStartTime: '09:00',
                fixedEndTime: '10:00',
                categoryCode: 1,
                color: getCategoryColor(1),
            },
            {
                fixedTitle: '캡스톤',
                fixedStartDay: '2024-05-13',
                fixedStartTime: '12:00',
                fixedEndTime: '13:00',
                categoryCode: 1,
                color: getCategoryColor(1),
            },
            {
                fixedTitle: '인공지능',
                fixedStartDay: '2024-05-14',
                fixedStartTime: '09:00',
                fixedEndTime: '10:00',
                categoryCode: 1,
                color: getCategoryColor(1),
            },
            {
                fixedTitle: '컴파과제',
                fixedStartDay: '2024-05-14',
                fixedStartTime: '11:00',
                fixedEndTime: '13:30',
                categoryCode: 2,
                color: getCategoryColor(2),
            },
            {
                fixedTitle: '컴파일러',
                fixedStartDay: '2024-05-14',
                fixedStartTime: '15:30',
                fixedEndTime: '17:00',
                categoryCode: 1,
                color: getCategoryColor(1),
            },
            {
                fixedTitle: '지후약속',
                fixedStartDay: '2024-05-15',
                fixedStartTime: '15:00',
                fixedEndTime: '18:00',
                categoryCode: 5,
                color: getCategoryColor(5),
            },
            {
                fixedTitle: '컴파과제',
                fixedStartDay: '2024-05-16',
                fixedStartTime: '12:00',
                fixedEndTime: '14:30',
                categoryCode: 2,
                color: getCategoryColor(2),
            },
            {
                fixedTitle: '컴파과제',
                fixedStartDay: '2024-05-17',
                fixedStartTime: '09:00',
                fixedEndTime: '10:00',
                categoryCode: 2,
                color: getCategoryColor(2),
            },
            {
                fixedTitle: '가상현실',
                fixedStartDay: '2024-05-20',
                fixedStartTime: '09:00',
                fixedEndTime: '10:00',
                categoryCode: 1,
                color: getCategoryColor(1),
            },
            {
                fixedTitle: '캡스톤',
                fixedStartDay: '2024-05-20',
                fixedStartTime: '12:00',
                fixedEndTime: '13:00',
                categoryCode: 1,
                color: getCategoryColor(1),
            },
            {
                fixedTitle: '줌졸프회의',
                fixedStartDay: '2024-05-20',
                fixedStartTime: '17:30',
                fixedEndTime: '19:00',
                categoryCode: 3,
                color: getCategoryColor(3),
            },
            {
                fixedTitle: '인공지능',
                fixedStartDay: '2024-05-21',
                fixedStartTime: '09:00',
                fixedEndTime: '10:00',
                categoryCode: 1,
                color: getCategoryColor(1),
            },
            {
                fixedTitle: '점심 약속',
                fixedStartDay: '2024-05-21',
                fixedStartTime: '12:00',
                fixedEndTime: '13:30',
                categoryCode: 5,
                color: getCategoryColor(5),
            },
            {
                fixedTitle: '교보문고',
                fixedStartDay: '2024-05-21',
                fixedStartTime: '18:00',
                fixedEndTime: '19:00',
                categoryCode: 7,
                color: getCategoryColor(7),
            },
            {
                fixedTitle: '가상현실',
                fixedStartDay: '2024-05-22',
                fixedStartTime: '09:00',
                fixedEndTime: '10:00',
                categoryCode: 1,
                color: getCategoryColor(1),
            },
            {
                fixedTitle: '캡스톤',
                fixedStartDay: '2024-05-22',
                fixedStartTime: '11:00',
                fixedEndTime: '12:00',
                categoryCode: 1,
                color: getCategoryColor(1),
            },
            {
                fixedTitle: '컴파팀플',
                fixedStartDay: '2024-05-22',
                fixedStartTime: '14:00',
                fixedEndTime: '15:00',
                categoryCode: 3,
                color: getCategoryColor(3),
            },
            {
                fixedTitle: '골프레슨',
                fixedStartDay: '2024-05-22',
                fixedStartTime: '19:00',
                fixedEndTime: '20:00',
                categoryCode: 4,
                color: getCategoryColor(4),
            },
            {
                fixedTitle: '인공지능',
                fixedStartDay: '2024-05-23',
                fixedStartTime: '09:00',
                fixedEndTime: '10:00',
                categoryCode: 1,
                color: getCategoryColor(1),
            },
            {
                fixedTitle: '인공지능과제',
                fixedStartDay: '2024-05-23',
                fixedStartTime: '10:00',
                fixedEndTime: '11:00',
                categoryCode: 2,
                color: getCategoryColor(2),
            },
            {
                fixedTitle: '컴파일러',
                fixedStartDay: '2024-05-23',
                fixedStartTime: '11:00',
                fixedEndTime: '12:00',
                categoryCode: 1,
                color: getCategoryColor(1),
            },
            {
                fixedTitle: '점심 약속',
                fixedStartDay: '2024-05-23',
                fixedStartTime: '12:30',
                fixedEndTime: '13:30',
                categoryCode: 5,
                color: getCategoryColor(5),
            },
            {
                fixedTitle: '동아리',
                fixedStartDay: '2024-05-23',
                fixedStartTime: '14:00',
                fixedEndTime: '15:00',
                categoryCode: 7,
                color: getCategoryColor(7),
            },
            {
                fixedTitle: '올리브영',
                fixedStartDay: '2024-05-23',
                fixedStartTime: '16:00',
                fixedEndTime: '17:00',
                categoryCode: 7,
                color: getCategoryColor(7),
            },
            {
                fixedTitle: '졸프회의',
                fixedStartDay: '2024-05-24',
                fixedStartTime: '12:00',
                fixedEndTime: '14:00',
                categoryCode: 3,
                color: getCategoryColor(3),
            },
            {
                fixedTitle: '가족저녁식사',
                fixedStartDay: '2024-05-24',
                fixedStartTime: '17:00',
                fixedEndTime: '18:00',
                categoryCode: 5,
                color: getCategoryColor(5),
            },
            {
                fixedTitle: '가상현실',
                fixedStartDay: '2024-05-27',
                fixedStartTime: '09:00',
                fixedEndTime: '10:00',
                categoryCode: 1,
                color: getCategoryColor(1),
            },
            {
                fixedTitle: '캡스톤',
                fixedStartDay: '2024-05-27',
                fixedStartTime: '12:00',
                fixedEndTime: '13:00',
                categoryCode: 1,
                color: getCategoryColor(1),
            },
            {
                fixedTitle: '줌졸프회의',
                fixedStartDay: '2024-05-27',
                fixedStartTime: '17:30',
                fixedEndTime: '19:00',
                categoryCode: 3,
                color: getCategoryColor(3),
            },
            {
                fixedTitle: '인공지능',
                fixedStartDay: '2024-05-28',
                fixedStartTime: '09:00',
                fixedEndTime: '10:00',
                categoryCode: 1,
                color: getCategoryColor(1),
            },
            {
                fixedTitle: '점심 약속',
                fixedStartDay: '2024-05-28',
                fixedStartTime: '12:00',
                fixedEndTime: '13:30',
                categoryCode: 5,
                color: getCategoryColor(5),
            },
            {
                fixedTitle: '컴파일러',
                fixedStartDay: '2024-05-28',
                fixedStartTime: '15:30',
                fixedEndTime: '17:00',
                categoryCode: 1,
                color: getCategoryColor(1),
            },
            {
                fixedTitle: '가상현실',
                fixedStartDay: '2024-05-29',
                fixedStartTime: '09:00',
                fixedEndTime: '10:00',
                categoryCode: 1,
                color: getCategoryColor(1),
            },
            {
                fixedTitle: '캡스톤',
                fixedStartDay: '2024-05-29',
                fixedStartTime: '11:00',
                fixedEndTime: '12:00',
                categoryCode: 1,
                color: getCategoryColor(1),
            },
            {
                fixedTitle: '컴파팀플',
                fixedStartDay: '2024-05-29',
                fixedStartTime: '14:00',
                fixedEndTime: '15:00',
                categoryCode: 3,
                color: getCategoryColor(3),
            },
            {
                fixedTitle: '골프레슨',
                fixedStartDay: '2024-05-29',
                fixedStartTime: '19:00',
                fixedEndTime: '20:00',
                categoryCode: 4,
                color: getCategoryColor(4),
            },
            {
                fixedTitle: '인공지능',
                fixedStartDay: '2024-05-30',
                fixedStartTime: '09:00',
                fixedEndTime: '10:00',
                categoryCode: 1,
                color: getCategoryColor(1),
            },
            {
                fixedTitle: '컴파일러',
                fixedStartDay: '2024-05-30',
                fixedStartTime: '11:00',
                fixedEndTime: '12:00',
                categoryCode: 1,
                color: getCategoryColor(1),
            },
            {
                fixedTitle: '병원 예약',
                fixedStartDay: '2024-05-30',
                fixedStartTime: '12:30',
                fixedEndTime: '13:30',
                categoryCode: 7,
                color: getCategoryColor(7),
            },
            {
                fixedTitle: '저녁 약속',
                fixedStartDay: '2024-05-30',
                fixedStartTime: '12:30',
                fixedEndTime: '13:30',
                categoryCode: 5,
                color: getCategoryColor(5),
            }
        ];

        setEvents(initialEvents);

    }, []);
    useEffect(() => {
        // 외부 페이지에서 전달받은 데이터 처리
        if (location.state && location.state.newEvent) {
            const newEvent = location.state.newEvent;
            setEvents(prevEvents => [...prevEvents, newEvent]);
            // 상태 초기화
            navigate(location.pathname, { replace: true });
        }
    }, [location.state?.newEvent]);

    const renderCalendar = () => {
        // 현재 날짜와 이벤트 목록을 가져옵니다.
        const viewYear = date.getFullYear();
        const viewMonth = date.getMonth();
        const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
        const startDay = new Date(viewYear, viewMonth, 1).getDay();

        const days = [];
        // 캘린더에 빈 칸을 추가합니다.
        for (let i = 0; i < startDay; i++) {
            days.push('');
        }

        // 캘린더에 해당 월의 날짜를 추가합니다.
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(i);
        }

        // 캘린더에 빈 칸을 추가하여 행을 완성합니다.
        const remainingDays = 7 - (days.length % 7);
        if (remainingDays < 7) {
            for (let i = 0; i < remainingDays; i++) {
                days.push('');
            }
        }

        // 각 날짜를 렌더링합니다.
        return days.map((day, index) => {
            const currentDate = new Date(viewYear, viewMonth, day);
            const isToday = new Date().toDateString() === currentDate.toDateString();
            const flexEvents = events.filter(event => event.flexDeadline && new Date(event.flexDeadline).toDateString() === currentDate.toDateString());
            const eventList = events.filter(event => {
                const eventStartDate = new Date(event.fixedStartDay);
                return eventStartDate.toDateString() === currentDate.toDateString();
            }).sort((a, b) => {
                // 이벤트를 시작 시간 순으로 정렬합니다.
                const aStartTime = new Date(`${a.fixedStartDay}T${a.fixedStartTime}`);
                const bStartTime = new Date(`${b.fixedStartDay}T${b.fixedStartTime}`);
                return aStartTime - bStartTime;
            });

            return (
                <div key={index} className={`day ${isToday ? 'today' : ''}`}>
                    {day}
                    <div className="event-indicator-container">
                        {/* 유동 스케줄 표시 */}
                        {flexEvents.map((event, eventIndex) => (
                            <div
                                key={eventIndex}
                                className="event-indicator"
                                style={{
                                    top: `${(eventIndex + 1.15) * 22}px`,
                                    backgroundColor: getCategoryColor(event.categoryCode)
                                }}
                            >
                                <div className="event-title">{event.flexTitle}</div>
                            </div>
                        ))}
                        {/* 일반 스케줄 표시 */}
                        {eventList.map((event, eventIndex) => (
                            <div
                                key={eventIndex}
                                className="event-indicator"
                                style={{
                                    top: `${(eventIndex + 1.15) * 22}px`,
                                    backgroundColor: getCategoryColor(event.categoryCode)
                                }}
                            >
                                <div className="event-title">{event.fixedTitle}</div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        });
    };

    const prevMonth = () => {
        const prevMonthDate = new Date(date.getFullYear(), date.getMonth() - 1, 1);
        setDate(prevMonthDate);
    };

    const nextMonth = () => {
        const nextMonthDate = new Date(date.getFullYear(), date.getMonth() + 1, 1);
        setDate(nextMonthDate);
    };

    const mini_renderCalendar = () => {
        const mini_viewYear = mini_date.getFullYear();
        const mini_viewMonth = mini_date.getMonth();
        const mini_daysInMonth = new Date(mini_viewYear, mini_viewMonth + 1, 0).getDate();
        const mini_firstDayOfWeek = new Date(mini_viewYear, mini_viewMonth, 1).getDay();

        const mini_days = [];
        for (let i = mini_firstDayOfWeek; i > 0; i--) {
            mini_days.push('');
        }
        for (let i = 1; i <= mini_daysInMonth; i++) {
            mini_days.push(i);
        }

        const handleMouseDown = (day) => {
            if (day !== '') {
                if (selectedDatesRef.current.has(day)) {
                    selectedDatesRef.current.delete(day);
                } else {
                    selectedDatesRef.current.add(day);
                }
                setSelectedMiniDates(Array.from(selectedDatesRef.current));
            }
            setIsDragging(true);
        };

        const handleMouseOver = (day) => {
            if (isDragging && day !== '') {
                selectedDatesRef.current.add(day);
                setSelectedMiniDates(Array.from(selectedDatesRef.current));
            }
        };
        const handleMouseUp = () => {
            setIsDragging(false);
        };

        return mini_days.map((mini_day, mini_index) => {
            const mini_className = mini_day === '' ? 'mini_other' : 'mini_this';
            const isSelected = selectedMiniDates.includes(mini_day);

            return (
                <div
                    key={mini_index}
                    className={`mini_date ${isSelected ? 'selected' : ''}`}
                    onMouseDown={() => handleMouseDown(mini_day)}
                    onMouseOver={() => handleMouseOver(mini_day)}
                    onMouseUp={handleMouseUp}
                >
                    <span className={`${mini_className}`}>{mini_day === '' ? ' ' : mini_day}</span>
                </div>
            );
        });
    };

    const mini_prevMonth = () => {
        const mini_prevMonthDate = new Date(mini_date.getFullYear(), mini_date.getMonth() - 1, 1);
        mini_setDate(mini_prevMonthDate);
    };

    const mini_nextMonth = () => {
        const mini_nextMonthDate = new Date(mini_date.getFullYear(), mini_date.getMonth() + 1, 1);
        mini_setDate(mini_nextMonthDate);
    };

    const onAddScheduleClick = () => {
        document.querySelector('.addSche-popup-wrap').style.display = 'block';
        document.querySelector('.back-bg').style.display = 'block';
    };

    const onSearchClick = () => {
        document.querySelector('.search-popup-wrap').style.display = 'block';
        document.querySelector('.back-bg').style.display = 'block';
    };

    const onBackClick = () => {
        document.querySelector('.addSche-popup-wrap').style.display = 'none';
        document.querySelector('.search-popup-wrap').style.display = 'none';
        document.querySelector('.searchList-popup-wrap').style.display = 'none';
        document.querySelector('.back-bg').style.display = 'none';
    };
    //};
    const onRecommendClick = async () => {
        try {
            const selectedDates = selectedMiniDates.map(day => {
                const date = new Date(mini_date.getFullYear(), mini_date.getMonth(), day + 1); // 날짜를 올바르게 맞추기 위해 day + 1
                return date.toISOString().split('T')[0];
            });

            const durationParts = selectedEstimated.split(':');
            const hours = parseInt(durationParts[0]);
            const minutes = parseInt(durationParts[1]);
            const expectedDuration = `PT${hours}H${minutes}M`;

            const response = await axios.post('http://localhost:8080/api/time/recommend', {
                dates: selectedDates,
                expectedDuration: expectedDuration,
            });

            const formattedTimes = response.data.map(slot => ({
                date: slot.date,
                startTime: slot.startTime,
                endTime: slot.endTime,
            }));

            setRecommendedTimes(formattedTimes);

            document.querySelector('.search-popup-wrap').style.display = 'none';
            document.querySelector('.searchList-popup-wrap').style.display = 'block';
            document.querySelector('.back-bg').style.display = 'block';
        } catch (error) {
            console.error('시간대 추천 오류:', error);
        }
    };

    const goToaddNormalMake = () => {
        // "일반 스케줄 추가" 버튼을 누를 때 기존의 일정들을 유지하기 위해 새로운 이벤트를 추가하지 않습니다.
        navigate('/addNormalMake', { state: { events: events } });
    };

    const goToAddFlexMake = () => {
        // "일반 스케줄 추가" 버튼을 누를 때 기존의 일정들을 유지하기 위해 새로운 이벤트를 추가하지 않습니다.
        navigate('/addFlexMake', { state: { events: events } });
    };

    const goToTimeLineMake=()=>{
        navigate('/timeLineMake');
    }

    const goToCalendar = () => {
        navigate('/Main');
    };

    const goToToDoList=()=>{
        navigate('/ToDoList');
    }

    const goToSetting=()=>{
        navigate('/Setting');
    }

    const goBack = () => {
        document.querySelector('.search-popup-wrap').style.display = 'block';
        document.querySelector('.searchList-popup-wrap').style.display = 'none';
        document.querySelector('.back-bg').style.display = 'block';
    };

    const handleEstimatedClick = () => {
        setShowEstimatedPicker(true);
    };

    const handleEstimatedChange = () => {
        const hours = document.getElementById('main-estimated-hours').value || '00';
        const minutes = document.getElementById('main-estimated-minutes').value || '00';
        setSelectedEstimated(`${hours}:${minutes}`);
        setShowEstimatedPicker(false);
    };

    return (
        <div className="main-gray-box">
            {/*우측 상단 이미지*/}
            <div className="main-top-right-images">
                <img id="popup-search" src={searchImage} alt="Search" onClick={onSearchClick}/>
                <img id="popup-addSchedule" src={addScheduleImage} alt="Add Schedule" onClick={onAddScheduleClick}/>
            </div>

            {/*search 눌렀을 때 뜨는 팝업 창*/}
            <div className="search-popup-wrap">
                <h2 className="search-h2">시간대 추천</h2>
                <div className="mini_calendar">
                    <div className="mini_header">
                        <div className="mini_nav prev">
                            <button className="mini_nav-btn go-prev" onClick={mini_prevMonth}>&lt;</button>
                        </div>
                        <div
                            className="year-month">{`${mini_date.toLocaleString('default', {month: 'long'})} ${mini_date.getFullYear()}`}</div>
                        <div className="mini_nav next">
                            <button className="mini_nav-btn go-next" onClick={mini_nextMonth}>&gt;</button>
                        </div>
                    </div>
                    <div className="mini_main">
                        <div className="mini_days">
                            <div className="mini_day">SUN</div>
                            <div className="mini_day">MON</div>
                            <div className="mini_day">TUE</div>
                            <div className="mini_day">WED</div>
                            <div className="mini_day">THU</div>
                            <div className="mini_day">FRI</div>
                            <div className="mini_day">SAT</div>
                        </div>
                        <div className="mini_dates">{mini_renderCalendar()}</div>
                    </div>
                </div>

                {/*시간대 추천 팝업 창*/}
                <div className="search-time-popup-wrap">
                    <div className="estimatedTime-inputField">
                        <label>예상소요시간</label>
                        <input type="text" className="mainTimePicker" name="mainTimePicker" id="mainTimePicker"
                               placeholder="시간 선택" value={selectedEstimated}
                               onClick={handleEstimatedClick} readOnly/>
                        <button className="estimated-submit" type="submit" onClick={onRecommendClick}>추천</button>
                    </div>
                    {showEstimatedPicker && (
                        <div className="main-estimated-picker-overlay" onClick={() => setShowEstimatedPicker(false)}>
                            <div className="main-estimated-picker" onClick={e => e.stopPropagation()}>
                                <label>시간 선택</label>
                                <div>
                                    <select id="main-estimated-hours">
                                        {[...Array(12).keys()].map(i => (
                                            <option key={i + 1} value={i + 1}>{i + 1}</option>
                                        ))}
                                    </select> :
                                    <select id="main-estimated-minutes">
                                        {[...Array(12).keys()].map(i => (
                                            <option key={i * 5} value={(i * 5).toString().padStart(2, '0')}>{(i * 5).toString().padStart(2, '0')}</option>
                                        ))}
                                    </select>
                                </div>
                                <button onClick={handleEstimatedChange}>확인</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/*시간대 추천 리스트 팝업 창*/}
            <div className="searchList-popup-wrap">
                <button className="search-back-button" id="back-button" onClick={goBack}>
                    &lt;
                </button>
                <h2 className="search-h2">시간대 추천</h2>
                <div className="recommended-times-list-wrap">
                    <div className="recommended-times-list-container">
                        <div className="recommended-times-list">
                            {recommendedTimes.map((time, index) => (
                                <div key={index} className="recommended-time">
                                    <div className="time-box">
                                        날짜: {time.date}<br />
                                        시작 시간: {time.startTime}<br />
                                        종료 시간: {time.endTime}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>


            {/*addSchedule 눌렀을 때 뜨는 팝업 창*/}
            <div className="addSche-popup-wrap">
                <div className="addSche-button-container">
                    <button className="addNormalSchedule-Button" onClick={goToaddNormalMake}>일반 스케줄 추가</button>
                    <button className="addFlexSchedule-Button" onClick={goToAddFlexMake}>유동 스케줄 추가</button>
                    <button>리마인더 추가</button>
                </div>
            </div>

            {/*메인 캘린더*/}
            <div className="back-bg" onClick={onBackClick}></div>
            <div className="calendar">
                <div className="header">
                    <div className="nav prev">
                        <button className="nav-btn go-prev" onClick={prevMonth}>&lt;</button>
                    </div>
                    <div
                        className="year-month">{`${date.toLocaleString('default', {month: 'long'})} ${date.getFullYear()}`}</div>
                    <div className="nav next">
                        <button className="nav-btn go-next" onClick={nextMonth}>&gt;</button>
                    </div>
                </div>
                <div className="main">
                    <div className="days">
                        <div className="day">SUN</div>
                        <div className="day">MON</div>
                        <div className="day">TUE</div>
                        <div className="day">WED</div>
                        <div className="day">THU</div>
                        <div className="day">FRI</div>
                        <div className="day">SAT</div>
                    </div>
                    <div className="dates">{renderCalendar()}</div>
                </div>
            </div>

            {/*하단 메뉴 바*/}
            <div className="menu">
                <div className="menu-details">
                    <img className="TimeTableImage" src={TimeTableImage} alt="Time Table" onClick={goToTimeLineMake}/>
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

export default FirstMainPage;