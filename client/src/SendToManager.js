import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useParams , useNavigate} from 'react-router-dom';
import "./Creative.css";

function SendToManager() {
    //  const navigate = useNavigate();
    const [send,setSend] = useState([]);
    const { absenceID } = useParams();

    const [status, setStatus] = useState('');
    const navigate = useNavigate();

    // ใช้ useEffect เพื่อเรียก API เมื่อมีการเปลี่ยนแปลงในค่า branchID 
    useEffect(() => {

            axios.get(`http://localhost:8081/send/` + absenceID)
                .then(res => {
                    console.log(res.data);
                    setSend(res.data);
                })
                .catch(err => console.log(err));
        
    }, [absenceID]); 

    function handleSubmit(event) {
        event.preventDefault();
        axios.put(`http://localhost:8081/update/` + absenceID, { status })
            .then(res => {
                console.log(res);
                navigate('/');
            })
            .catch(err => console.log(err));
    }

    return (

        <div className="modalBackground">
            <div className="modalContainer">
        
        <div className="titleCloseBtn">
            <td><Link to="/" className='btn btn-dark' >X</Link></td>
        </div>

        <div className="body ">

             
              {send.map((data, i) => (
                <div key={i} className='sarabun fonttext'>

                    <p className="card-text" >สาขา: {data.branchName}</p>
                    <p className="card-text">วันที่ต้องการ: {data.date}</p>
                    <p className="card-text">เวลาเริ่มงาน: {data.timeStart}</p>
                    <p className="card-text">เวลาเลิกงาน: {data.timeEnd}</p>
                    <p></p>

                    <form onSubmit={handleSubmit}>
                        <div className='fonttext2'>
                            <button className='btn btn-success' onClick={() => setStatus('FC')}>ส่งต่อ</button>
                         </div>
                    </form>

                </div>
            ))}

        </div>
    </div>
</div>

    );
}

export default SendToManager; 
