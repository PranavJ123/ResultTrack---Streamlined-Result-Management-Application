// import axios from './axios';
async function deleteStudent(rollno) {
    const res = await axios.delete('http://localhost:8090/student', {
        params: { rollno: rollno },
    })
}