import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import './css/addNormalCal.css'; // CSS 파일 import

const AddNormalSchedulePage = () => {
    const [scheduleData, setScheduleData] = useState({
        fixedTitle: '',
        fixedStartDay: '',
        fixedEndDay: '',
        fixedStartTime: '',
        fixedEndTime: '',
        fixedMemo: '',
        categoryCode: '',
        placeCode: '',
    });
    const [message, setMessage] = useState('');
    const [isTimeToggleOn, setIsTimeToggleOn] = useState(false);
    const [categoryColor, setCategoryColor] = useState({}); // 카테고리별 색상 상태 추가
    const navigate = useNavigate();

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setScheduleData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const formattedData = {
                ...scheduleData,
                fixedStartDay: scheduleData.fixedStartDay,
                fixedEndDay: scheduleData.fixedEndDay,
                fixedStartTime: scheduleData.fixedStartTime ? scheduleData.fixedStartTime + ":00" : "00:00:00",
                fixedEndTime: scheduleData.fixedEndTime ? scheduleData.fixedEndTime + ":00" : "00:00:00",
                categoryCode: scheduleData.categoryCode ? parseInt(scheduleData.categoryCode, 10) : null,
                placeCode: scheduleData.placeCode ? parseInt(scheduleData.placeCode, 10) : null,
            };

            const storedEvents = JSON.parse(localStorage.getItem('events')) || [];
            storedEvents.push(formattedData);
            localStorage.setItem('events', JSON.stringify(storedEvents));

            // 콘솔 로그로 확인
            console.log('Navigating with new event:', formattedData);

            navigate('/Main', { state: { newEvent: formattedData } });
        } catch (error) {
            console.error('Error response:', error.response);
            setMessage('일정 추가에 실패했습니다. 서버 오류가 발생했습니다.');
        }
    };

    const handleToggleChange = () => {
        setIsTimeToggleOn(!isTimeToggleOn);
    };

    useEffect(() => {
        // 카테고리에 따른 색상 정의
        const colors = {
        };
        setCategoryColor(colors);
    }, []);

    useEffect(() => {
        const dateConfig = {
            dateFormat: "Y-m-d",
            onChange: (selectedDates, dateStr) => {
                setScheduleData(prevData => ({
                    ...prevData,
                    fixedStartDay: dateStr,
                    fixedEndDay: dateStr,
                }));
            },
        };
        flatpickr("input.startdate-picker", dateConfig);
        flatpickr("input.enddate-picker", dateConfig);

        const datetimeConfig = {
            enableTime: true,
            dateFormat: "Y-m-d H:i",
            onChange: (selectedDates, dateStr) => {
                setScheduleData(prevData => ({
                    ...prevData,
                    fixedStartTime: dateStr,
                    fixedEndTime: dateStr,
                }));
            },
        };
        flatpickr("input.startdatetime-picker", datetimeConfig);
        flatpickr("input.enddatetime-picker", datetimeConfig);
    }, []);

    return (
        <div className="addNor-gray-box">
            <button type="button" className="addNor-back-button" onClick={() => window.history.back()}>
                &lt;
            </button>
            <button type="submit" className="addNor-submit" form="addNor-form">완료</button>
            <h1 className="addNor-h1">일반스케줄 추가</h1>
            <form className="addNor-form" id="addNor-form" onSubmit={handleSubmit}>
                <div className="addNor-container">
                    <div className="addNor-input-container">
                        <div className="addNor-repeat-toggle">
                            <span>반복 설정</span>
                            <input className="addNor-repeat-toggle" role="switch" type="checkbox" id="repeat-toggle"/>
                        </div>
                    </div>
                    <div className="addNor-input-container">
                        <label htmlFor="fixedTitle">제목</label>
                        <input type="text" className="fixedTitle" name="fixedTitle" id="fixedTitle" placeholder="제목"
                               value={scheduleData.fixedTitle} onChange={handleInputChange} required/>
                    </div>
                    <div className="addNor-input-container">
                        <label>날짜 및 시간</label>
                        <div className="addNor-time-toggle">
                            <span>시간 설정</span>
                            <input className="addNor-time-toggle" role="switch" type="checkbox" id="addNor-time-toggle"
                                   checked={isTimeToggleOn} onChange={handleToggleChange}/>
                        </div>
                        <div className={`addNor-date-picker ${isTimeToggleOn ? 'hidden' : ''}`} id="addNor-date-picker">
                            <input className="startdate-picker" name="fixedStartDay" id="fixedStartDay" type="date"
                                   placeholder="시작 날짜" value={scheduleData.fixedStartDay} onChange={handleInputChange}/>
                            <span className="date-range-divider">~</span>
                            <input className="enddate-picker" name="fixedEndDay" id="fixedEndDay" type="date"
                                   placeholder="종료 날짜" value={scheduleData.fixedEndDay} onChange={handleInputChange}/>
                        </div>
                        <div className={`addNor-datetime-picker ${isTimeToggleOn ? '' : 'hidden'}`}
                             id="addNor-datetime-picker">
                            <input className="startdatetime-picker" name="fixedStartTime" id="fixedStartTime"
                                   type="datetime-local" placeholder="시작 날짜 및 시간" value={scheduleData.fixedStartTime}
                                   onChange={handleInputChange}/>
                            <span className="datetime-range-divider">~</span>
                            <input className="enddatetime-picker" name="fixedEndTime" id="fixedEndTime"
                                   type="datetime-local" placeholder="종료 날짜 및 시간" value={scheduleData.fixedEndTime}
                                   onChange={handleInputChange}/>
                        </div>
                    </div>
                    <div className="addNor-input-container">
                        <label>장소</label>
                        <input type="number" className="placeCode" name="placeCode" id="placeCode" placeholder="장소"
                               value={scheduleData.placeCode} onChange={handleInputChange}/>
                    </div>
                    <div className="addNor-input-container">
                        <label>카테고리</label>
                        <input type="number" className="categoryCode" name="categoryCode" id="categoryCode"
                               placeholder="기타" value={scheduleData.categoryCode} onChange={handleInputChange}/>
                    </div>
                    <div className="addNor-input-container">
                        <label>메모</label>
                        <textarea className="fixedMemo" name="fixedMemo" id="memo" rows="4" placeholder="메모"
                                  value={scheduleData.fixedMemo} onChange={handleInputChange}></textarea>
                    </div>
                </div>
            </form>
            {message && <div className="message">{message}</div>}
        </div>
    );
};

export default AddNormalSchedulePage;
