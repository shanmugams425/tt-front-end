import axios from 'axios';
import { useFormik } from 'formik';
import React from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  let navigate = useNavigate();
  let formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit: async (values) => {
      try {
        let loginData = await axios.post('http://localhost:3001/login', values);
        window.localStorage.setItem('myapptoken', loginData.data.token);
        navigate('/home');
      } catch (error) {
        console.log(error);
        alert('Something went wrong');
      }
    },
  });
  return (
    <div className="container">
      <form onSubmit={formik.handleSubmit}>
        <div className="row">
          <div className="col-lg-12">
            <label>Email</label>
            <input
              type={'email'}
              className="form-control"
              name="email"
              id="email"
              onChange={formik.handleChange}
              value={formik.values.email}
            />
          </div>
          <div className="col-lg-12">
            <label>Password</label>
            <input
              type={'password'}
              className="form-control"
              name="password"
              id="password"
              onChange={formik.handleChange}
              value={formik.values.password}
            />
          </div>
          <div className="col-lg-12 mt-2">
            <input
              type={'submit'}
              className="btn btn-primary"
              value={'Login'}
            />
          </div>
        </div>
      </form>
    </div>
  );
}

export default Login;
