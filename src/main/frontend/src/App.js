import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StartPage from './StartPage';
import SignupPage from './SignupPage';
import LoginPage from './LoginPage';
import AddNormalSchedulePage from "./AddNormalSchedulePage";
//import AddFlexSchedulePage from "./AddFlexSchedulePage";
import Main from "./Main"
//import TimeLinePage from "./TimeLinePage";
//import TimePicker from "./TimePicker";
//import ToDoListPage from "./ToDoListPage";
//import RecommendationPage from "./RecommendationPage";
//import SettingPage from "./SettingPage";
import TmapComponent from "./TmapComponent";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<StartPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/addNormalschedule" element={<AddNormalSchedulePage/>} />

                <Route path="/Main" element={<Main/>}/>
                <Route path="/Map" element={<TmapComponent/>} /> {/* TmapComponent 추가 */}
            </Routes>
        </Router>
    );
}

export default App;