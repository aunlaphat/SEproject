import 'bootstrap/dist/css/bootstrap.min.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import SendToManager from './SendToManager';
import FCviews from './FCviews';
import ManagerView from './ManagerView';
import UpdateStatusFC from './UpdateStatusFC';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<FCviews />}></Route>
          <Route path="/send/:absenceID" element={<SendToManager />}></Route>
          <Route path='/ManagerView' element={<ManagerView />}></Route>
          <Route path='/sendFC/:absenceID' element={<ManagerView />}></Route>
          <Route path='/UpdateStatusFC/:absenceID' element={<UpdateStatusFC />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
