import axios from 'axios';
import './App.css';
import TestLoginPage from './LoginPage/TestLoginPage';
import Home from './Home/Home';
import ReviewTables from './DataViews/ReviewsTables'
import { BrowserRouter as Router, Routes, Route, HashRouter } from 'react-router-dom';

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
        <Route path='/getReviews' element={<ReviewTables/>}></Route>
      </Routes>
    </Router>
  );
}

export default App;
