import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaStar, FaRegStar } from 'react-icons/fa';
import './css/todoList.css';
import TimeTableImage from "./images/Time table.png";
import CalendarImage from "./images/Calendar.png";
import TodoListImage from "./images/할 일 list.png";
import SettingImage from "./images/Setting.png";
import AddImage from "./images/plus.png";
import axios from 'axios';

const ToDoListMake = () => {
    const [schedules, setSchedules] = useState([
        { unfixedCode: 1, unfixedTitle: '올리브영', unfixedTime: '1시간', unfixedDeadline: '2024-05-23', unfixedImportance: 4,categoryId: 6, placeId: '올리브영'},
        { unfixedCode: 2, unfixedTitle: '과외 준비', unfixedTime: '1시간', unfixedDeadline: '2024-05-23', unfixedImportance: 4,categoryId: 6 },
        { unfixedCode: 3, unfixedTitle: '분리수거', unfixedTime: '1시간', unfixedDeadline: '2024-05-23', unfixedImportance: 5, categoryId: 6,placeId: '신촌 럭키아파트 102동' },
        { unfixedCode: 4, unfixedTitle: '인공지능 과제', unfixedTime: '2시간', unfixedDeadline: '2024-05-24', unfixedImportance: 3,categoryId: 2 },
        { unfixedCode: 5, unfixedTitle: '헬스장', unfixedTime: '1시간', unfixedDeadline: '2024-05-25', unfixedImportance: 3,categoryId: 4, placeId: '헬스보이짐 신촌점' },
        { unfixedCode: 6, unfixedTitle: '컴파일러 과제', unfixedTime: '4시간', unfixedDeadline: '2024-05-25', unfixedImportance: 3,categoryId: 2 },
        { unfixedCode: 7, unfixedTitle: '가상현실 과제', unfixedTime: '2시간', unfixedDeadline: '2024-05-25', unfixedImportance: 3,categoryId: 2 },
        { unfixedCode: 8, unfixedTitle: '골프 연습', unfixedTime: '1시간', unfixedDeadline: '2024-05-25', unfixedImportance: 3, categoryId: 4,placeId: '골프연습장' },
        { unfixedCode: 9, unfixedTitle: '스터디 과제', unfixedTime: '2시간', unfixedDeadline: '2024-05-25', unfixedImportance: 3,categoryId: 2 },
        { unfixedCode: 10, unfixedTitle: '교환학생 서류 준비', unfixedTime: '2시간', unfixedDeadline: '2024-05-27', unfixedImportance: 3,categoryId: 6 },
        { unfixedCode: 11, unfixedTitle: '서점가기', unfixedTime: '1시간', unfixedDeadline: '2024-05-29', unfixedImportance: 3, categoryId: 6,placeId: '교보문고' },
        { unfixedCode: 12, unfixedTitle: '장보기', unfixedTime: '1시간', unfixedDeadline: '2024-05-24', unfixedImportance: 3,categoryId: 6 },
        { unfixedCode: 13, unfixedTitle: '컴파일러 시험 공부', unfixedTime: '3시간', unfixedDeadline: '2024-05-31', unfixedImportance: 3,categoryId: 1 }
    ]);
    const navigate = useNavigate();

    const categoryMap = {
        1: '학교수업',
        2: '과제',
        3: '팀플',
        4: '운동',
        5: '약속',
        6: '기타'
    };
    /*
        useEffect(() => {
            const storedEvents = JSON.parse(localStorage.getItem('events')) || [];
            const flexibleSchedules = storedEvents.filter(event => event.flexTitle); // Filter flexible schedules
            const sortedSchedules = flexibleSchedules.sort((a, b) => {
                const dateA = new Date(a.flexDeadline);
                const dateB = new Date(b.flexDeadline);
                return dateA - dateB;
            });
            setSchedules(sortedSchedules);
        }, []);

        const handleDelete = (index) => {
            const updatedSchedules = schedules.filter((_, i) => i !== index);
            setSchedules(updatedSchedules);
            localStorage.setItem('events', JSON.stringify(updatedSchedules));
        };*/


    const handleEdit = (index) => {
        navigate(`/edit/${index}`);
    };

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

    const goToAddFlexSchedule = () => {
        navigate('/addFlexSchedule')
    }

    const renderStars = (importance) => {
        const stars = [];
        for (let i = 0; i < 5; i++) {
            if (i < importance) {
                stars.push(<FaStar key={i} style={{ color: '#80A160' }} />);
            } else {
                stars.push(<FaRegStar key={i} style={{ color: 'gray' }} />);
            }
        }
        return stars;
    }

    return (
        <div className="todolist-gray-box">
            {/* 할 일 리스트 헤더 */}
            <div className="todolist-header">
                <p className="todolist-title">할 일 리스트</p>
            </div>

            <div className="flexible-schedule-header">
                <span>유동스케줄</span>
                <img className="AddImage" src={AddImage} alt="Add" onClick={goToAddFlexSchedule} />
            </div>

            {/* 할 일 리스트 본문 */}
            <div className="todolist-content">
                <div className="todolist-schedule-container">
                    {schedules.map((schedule, index) => (
                        <div key={index} className="todo-item">
                            <div className="todo-header">
                                <h3>{schedule.unfixedTitle}</h3>
                                <div className="todo-actions">
                                    <FaEdit onClick={() => handleEdit(schedule.unfixedCode)} />

                                </div>
                            </div>
                            <div className="todo-details">
                                <p>예상 소요시간: {schedule.unfixedTime}</p>
                                <p>마감기한: {schedule.unfixedDeadline}</p>
                                <p>중요도: {renderStars(schedule.unfixedImportance)}</p>
                                <p>카테고리: {schedule.categoryId !== null ? categoryMap[schedule.categoryId] : '졸프'}</p>
                                <p>장소: {schedule.placeId}</p>
                                <p>메모: {schedule.unfixedMemo}</p>
                            </div>
                        </div>
                    ))}
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
                    <img className="SettingImage" src={SettingImage} alt="Setting" onClick={goToSetting} />
                    <p>Setting</p>
                </div>
            </div>
        </div>
    );
};

export default ToDoListMake;