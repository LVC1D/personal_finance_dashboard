import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../slices/authSlice';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import ROUTES from '../routes';
import {useNavigate, Link} from 'react-router-dom';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  email: Yup.string().required('Email is required'),
  password: Yup.string().required('Password is required'),
});

const LoginPage = () => {
  const dispatch = useDispatch();
  const { isLoading, error, hasError, isAuth } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const initialValues = {
    email: '',
    password: '',
  };

  const handleLogin = (values) => {
    dispatch(loginUser(values));
  };

  useEffect(() => {
    if (isAuth) {
      navigate(ROUTES.HOME);
    }
  }, [isAuth, navigate]);

  return (
      <div>
          <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={(values, { setSubmitting }) => {
                  setSubmitting(true);
                  handleLogin(values);
                  setSubmitting(false);
              }}
          >
              {({ isSubmitting }) => (
                  <div className='login-form'>
                      <div className='login-banner'>
                          <h1>Login here</h1>
                      </div>
                      <Form className='login-fields'>
                          <Field type="email" name="email" placeholder="Email" />
                          <ErrorMessage name="email" component="div" />

                          <Field type="password" name="password" placeholder="Password" />
                          <ErrorMessage name="password" component="div" />

                          <button id='login' type="submit" disabled={isSubmitting}>
                              Login
                          </button>
                          {isLoading && <p>Loading...</p>}
                          {hasError && <p>{error}</p>}
                      </Form>
                      <Link to={ROUTES.HOME}>
                        <p>Return</p>
                       </Link>
                  </div>
              )}
          </Formik>
      </div>
  );
};

export default LoginPage;