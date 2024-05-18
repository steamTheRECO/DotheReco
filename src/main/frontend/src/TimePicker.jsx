// Main 컴포넌트에서 handleTimeChange 함수 삭제

// TimePicker 컴포넌트의 코드 수정
import React, { useState } from 'react';
import './css/TimePicker.css';

const TimePicker = ({ onTimeChange }) => {
    const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
    const minutes = Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, '0'));

    const [selectedHour, setSelectedHour] = useState(hours[0]);
    const [selectedMinute, setSelectedMinute] = useState(minutes[0]);
    const [showHourList, setShowHourList] = useState(false);
    const [showMinuteList, setShowMinuteList] = useState(false);

    const handleHourChange = (hour) => {
        setSelectedHour(hour);
        setShowHourList(false);
        onTimeChange(hour, selectedMinute); // 시간이 변경될 때마다 onTimeChange 콜백 호출
    };

    const handleMinuteChange = (minute) => {
        setSelectedMinute(minute);
        setShowMinuteList(false);
        onTimeChange(selectedHour, minute); // 분이 변경될 때마다 onTimeChange 콜백 호출
    };

    return (
        <div className="time-picker">
            <div className="selected-time">
                <div
                    className="selected-time-hour"
                    onClick={() => setShowHourList(!showHourList)}
                >
                    {selectedHour}
                </div>
                :
                <div
                    className="selected-time-minute"
                    onClick={() => setShowMinuteList(!showMinuteList)}
                >
                    {selectedMinute}
                </div>
            </div>
            {showHourList && (
                <div className="time-picker-column">
                    {hours.map((hour) => (
                        <div
                            key={hour}
                            className={`time-picker-item ${hour === selectedHour ? 'selected' : ''}`}
                            onClick={() => handleHourChange(hour)}
                        >
                            {hour}
                        </div>
                    ))}
                </div>
            )}
            {showMinuteList && (
                <div className="time-picker-column">
                    {minutes.map((minute) => (
                        <div
                            key={minute}
                            className={`time-picker-item ${minute === selectedMinute ? 'selected' : ''}`}
                            onClick={() => handleMinuteChange(minute)}
                        >
                            {minute}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TimePicker;
