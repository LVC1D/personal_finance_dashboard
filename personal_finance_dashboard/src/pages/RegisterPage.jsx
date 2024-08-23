import {useRef, useState, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, checkLoginStatus } from '../slices/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import ROUTES from '../routes';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  password: Yup.string().required('Password is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  name: Yup.string().required('Name is required')
});

const RegisterPage = () => {
  const dispatch = useDispatch();
  const { user, isLoading, error, hasError } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const registrationRef = useRef(false);

  const initialValues = {
    email: '',
    name: '',
    password: '',
  };

  useEffect(() => {
    const handleUserRegistration = async () => {
      if (registrationSuccess && user && !registrationRef.current) {
        registrationRef.current = true; // Mark the registration process as initiated
        try {
          navigate(ROUTES.HOME);
        } catch (error) {
          console.error("Error creating cart or fetching cart:", error);
          registrationRef.current = false; // Reset if there's an error
        }
      }
    };

    handleUserRegistration();
  }, [registrationSuccess, dispatch, navigate, user]);

  const handleRegister = async (values) => {
    try {
      await dispatch(registerUser(values)).unwrap();
      await dispatch(checkLoginStatus()).unwrap();
      setRegistrationSuccess(true);
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        setSubmitting(true);
        handleRegister(values); // or handleLogin(values) depending on the form
        setSubmitting(false);
      }}
    >
      {({ isSubmitting }) => (
        <div className='register-form'>
          <div className='banner'>
            <h1>Register here</h1>
          </div>
          <Form className='fields'>

            <Field type="email" name="email" placeholder="Email" />
            <ErrorMessage name="email" component="div" />

            <Field type="text" name="name" placeholder="Name" />
            <ErrorMessage name="name" component="div" />

            <Field type="password" name="password" placeholder="Password" />
            <ErrorMessage name="password" component="div" />

            <button id='register' type="submit" disabled={isSubmitting}>
              Register
            </button>
            {/* Login button can be added similarly */}
            {isLoading && <p>Loading...</p>}
            {hasError && <p>{error}</p>}
          </Form>
          <Link to={ROUTES.HOME}>
            <p>Return</p>
          </Link>
        </div>
      )}
    </Formik>
  );
};

export default RegisterPage;