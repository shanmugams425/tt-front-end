import axios from 'axios';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  let navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [currentStudent, setCurrentStudet] = useState('');
  let formik = useFormik({
    initialValues: {
      name: '',
    },
    onSubmit: async (values) => {
      try {
        if (isEdit) {
          await axios.put(
            `http://localhost:3001/student/${currentStudent}`,
            values,
            {
              headers: {
                Authorization: window.localStorage.getItem('myapptoken'),
              },
            }
          );
          fetchAll();
        } else {
          await axios.post('http://localhost:3001/student', values, {
            headers: {
              Authorization: window.localStorage.getItem('myapptoken'),
            },
          });
          fetchAll();
        }
      } catch (error) {
        alert('Something went wrong');
      }
    },
  });

  async function fetchAll() {
    try {
      let studentsData = await axios.get('http://localhost:3001/students', {
        headers: {
          Authorization: window.localStorage.getItem('myapptoken'),
        },
      });
      setStudents(studentsData.data);
    } catch (error) {
      alert('Something went wrong');
    }
  }

  useEffect(() => {
    fetchAll();
  }, []);

  let handleEdit = async (id) => {
    try {
      let studetData = await axios.get(`http://localhost:3001/student/${id}`, {
        headers: {
          Authorization: window.localStorage.getItem('myapptoken'),
        },
      });
      formik.setValues({
        name: studetData.data.name,
      });
      setCurrentStudet(studetData.data._id);
      setIsEdit(true);
    } catch (error) {
      alert('Something went wrong');
    }
  };

  let handleDelete = async (id) => {
    try {
      let ask = window.confirm(
        'Are you sure, do you want to delete this student?'
      );
      if (ask) {
        await axios.delete(`http://localhost:3001/student/${id}`, {
          headers: {
            Authorization: window.localStorage.getItem('myapptoken'),
          },
        });
        fetchAll();
        alert('Deleted');
      }
    } catch (error) {
      alert('Something went wrong');
    }
  };

  let handleLogout = () => {
    window.localStorage.removeItem('myapptoken');
    navigate('/');
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-12">
          <button onClick={handleLogout} className="btn btn-danger btn-sm">
            Logout
          </button>
        </div>
        <div className="col-lg-6">
          <form onSubmit={formik.handleSubmit}>
            <div className="form-group">
              <label>Name</label>
              <input
                className="form-control"
                name="name"
                id="name"
                type={'text'}
                onChange={formik.handleChange}
                value={formik.values.name}
              />
            </div>
            <div className="form-group mt-2">
              <input
                type={'submit'}
                className="btn btn-primary"
                value="Submit"
              />
            </div>
          </form>
        </div>
        <div className="col-lg-6">
          <table class="table table-striped">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => {
                return (
                  <tr>
                    <th scope="row">1</th>
                    <td>{student.name}</td>
                    <td>
                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() => handleEdit(student._id)}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(student._id)}
                        className="btn btn-danger btn-sm ms-2"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Home;
