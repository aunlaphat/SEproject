const express = require("express");
const cors = require("cors");
const mysql = require("mysql");

const app = express();
app.use(express.json());

app.use(cors());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "se_1"
});

app.get("/", (req, res) => {

    const sql = `
    SELECT absence.absenceID as absenceID, branch.branchName as branchName, DATE_FORMAT(schedule.date,'%e %M %Y') AS date, 
    typetime.timeStart as timeStart, typetime.timeEnd as timeEnd, absence.status as status
    FROM (((((shift INNER JOIN branch ON shift.branchID = branch.branchID)
    INNER JOIN schedule ON schedule.scheduleID = shift.scheduleID)
    INNER JOIN typetime ON shift.timeID = typetime.timeID)
    INNER JOIN shiftdetail ON shift.shiftID = shiftdetail.shiftID)
    INNER JOIN absence ON shiftdetail.absenceID = absence.absenceID ) 
    WHERE absence.status = 'out branch' `;
  
    db.query(sql, (err,data) => {
        if(err) return res.json("Error");
        return res.json(data);
    })

});

app.get("/send/:absenceID", (req, res) => {
    const absenceID = req.params.absenceID;
    const sql = `
    SELECT
        absence.absenceID as absenceID,
        branch.branchName as branchName,
        DATE_FORMAT(schedule.date,'%e %M %Y') AS date,
        typetime.timeStart as timeStart,
        typetime.timeEnd as timeEnd
    FROM
        shift
        INNER JOIN branch ON shift.branchID = branch.branchID
        INNER JOIN schedule ON schedule.scheduleID = shift.scheduleID
        INNER JOIN typetime ON shift.timeID = typetime.timeID
        INNER JOIN shiftdetail ON shift.shiftID = shiftdetail.shiftID
        INNER JOIN absence ON shiftdetail.absenceID = absence.absenceID
    WHERE
        absence.absenceID = ? `;
  
    db.query(sql, [absenceID], (err, data) => {
        if(err) return res.status(500).json({ error: 'Error fetching branch details' });
        return res.json(data);
    });
});

app.get("/ManagerView", (req, res) => {

    const sql = `
    SELECT absence.absenceID as absenceID, branch.branchName as branchName, DATE_FORMAT(schedule.date,'%e %M %Y') AS date, 
    typetime.timeStart as timeStart, typetime.timeEnd as timeEnd, absence.status as status
    FROM (((((shift INNER JOIN branch ON shift.branchID = branch.branchID)
    INNER JOIN schedule ON schedule.scheduleID = shift.scheduleID)
    INNER JOIN typetime ON shift.timeID = typetime.timeID)
    INNER JOIN shiftdetail ON shift.shiftID = shiftdetail.shiftID)
    INNER JOIN absence ON shiftdetail.absenceID = absence.absenceID ) 
    WHERE absence.status = 'FC'`;
  
    db.query(sql, (err,data) => {
        if(err) return res.json("Error");
        return res.json(data);
    })

});

app.get("/sendFC/:absenceID", (req, res) => {
    const absenceID = req.params.absenceID; // รับค่า absenceID จากพารามิเตอร์
    const sql = `
        SELECT 
            absence.absenceID as absenceID, 
            branch.branchName as branchName, 
            DATE_FORMAT(schedule.date,'%e %M %Y') AS date, 
            typetime.timeStart as timeStart, 
            typetime.timeEnd as timeEnd, 
            absence.status as status
        FROM 
            shift 
            INNER JOIN branch ON shift.branchID = branch.branchID
            INNER JOIN schedule ON schedule.scheduleID = shift.scheduleID
            INNER JOIN typetime ON shift.timeID = typetime.timeID
            INNER JOIN shiftdetail ON shift.shiftID = shiftdetail.shiftID
            INNER JOIN absence ON shiftdetail.absenceID = absence.absenceID
        WHERE 
            absence.absenceID = ? `; // เพิ่มเงื่อนไขใน WHERE clause สำหรับระบุ absenceID และสถานะเป็น 'FC'

    db.query(sql, [absenceID], (err, data) => {
        if (err) {
            return res.json("Error");
        }
        return res.json(data);
    });
});

app.put('/update/:absenceID', (req, res) => {
    const sql = `UPDATE absence 
                 SET absence.status = ?
                 WHERE absence.absenceID = ? `;

    const { status } = req.body;
    const absenceID = req.params.absenceID;

    db.query(sql, [status, absenceID], (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error updating absence status' });
        }
        return res.json(data);
    });
});

// GET request เพื่อดึงรายชื่อพนักงานทั้งหมด
app.get('/User',(req, res) => {
    db.query("SELECT userID,firstName FROM user",(err,data) =>{
        if(err) {
            console.log(err);
            res.status(500).json('Error fetching user data');
            return;
        } else {
            res.json(data);
        }
    });
});

// POST request เพื่อบันทึกข้อมูลผู้ใช้ลงในฐานข้อมูล
app.post('/saveDataUser', (req, res) => {
    const { userID, status } = req.body;

    // ทำการบันทึกข้อมูลลงในฐานข้อมูล
    const sql = "INSERT INTO managerreplytofc (userID, status) VALUES (?, ?)";
    db.query(sql, [userID, status], (err, data) => {
        if (err) {
            console.error('Error inserting data:', err);
            res.status(500).json('Error saving data');
            return;
        }
        console.log('Data inserted successfully');
        res.status(200).json('Data saved successfully');
    });
});

app.listen(8081 , () => { 
    console.log("listening");
});


