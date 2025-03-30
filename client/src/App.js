import axios from 'axios';
import './App.css';
import TestLoginPage from './LoginPage/TestLoginPage';
import AdminPage from "./AdminPage";
import Home from './Home/Home';
import { BrowserRouter as Router, Routes, Route, HashRouter, Link } from 'react-router-dom';

//data will be the string we send from our server
const apiCall = () => {
  axios.get('http://localhost:8080').then((data) => {
    //this console.log will be in our frontend console
    console.log(data)
  })
}


function App() {
  return (
    <Router>
      <Routes>
        <Route exact path='/' element={<TestLoginPage/>}></Route>
        <Route path='/home' element={<Home/>}></Route>
        <Route path='/admin' element={<AdminPage/>}></Route>
      </Routes>
    </Router>
  );
}

export default App;
