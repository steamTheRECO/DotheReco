import React from 'react';
import { useNavigate } from "react-router-dom";
import './css/setting.css';
import TimeTableImage from "./images/Time table.png";
import CalendarImage from "./images/Calendar.png";
import TodoListImage from "./images/할 일 list.png";
import SettingImage from "./images/Setting.png";

const SettingPage = () => {
    const navigate = useNavigate();

    const goToTimeLine = () => {
        navigate('/timeLine');
    };

    const goToCalendar = () => {
        navigate('/Main');
    };

    const goToToDoList = () => {
        navigate('/ToDoList');
    };

    const goToSetting=()=>{
        navigate('/Setting');
    }

    return (
        <div className="setting-gray-box">
            {/* 상단 계정 */}
            <div className="account">
                <p>계정</p>
            </div>
            {/* 설정 목록 */}
            <div className="setting-list">
                <div className="setting-item" onClick={goToTimeLine}>

                    <p>계정 관리</p>
                </div>
                <div className="setting-item" onClick={goToCalendar}>

                    <p>비활동시간</p>
                </div>
                <div className="setting-item" onClick={goToToDoList}>

                    <p>카테고리 편집</p>
                </div>
                <div className="setting-item" onClick={goToSetting}>

                    <p>이용약관</p>
                </div>
                <div className="setting-item">
                    <p>언어</p>
                </div>
            </div>

            {/* 하단 메뉴 바 */}
            <div className="menu">
                <div className="menu-details">
                    <img className="TimeTableImage" src={TimeTableImage} alt="Time Table" onClick={goToTimeLine} />
                    <p>Time table</p>
                </div>
                <div className="menu-details">
                    <img className="CalendarImage" src={CalendarImage} alt="Calendar" onClick={goToCalendar} />
                    <p>Calendar</p>
                </div>
                <div className="menu-details">
                    <img className="TodoListImage" src={TodoListImage} alt="To Do List" onClick={goToToDoList} />
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

export default SettingPage;
