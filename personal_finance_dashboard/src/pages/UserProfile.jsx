import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { updateUser } from "../slices/userSlice";
import * as Yup from 'yup';
import UserModal from "../components/UserModal";
import PropTypes from 'prop-types';

export default function UserProfile({ isVisible, onClose }) {
    const {user, isLoading, hasError, isSuccess} = useSelector(state => state.auth);
    const dispatch = useDispatch();

    const userSchema = Yup.object().shape({
        email: Yup.string(),
        name: Yup.string(),
        password: Yup.string()
    });

    const initialValues = {
        email: '',
        name: '',
        password: ''
    };

    const handleUpdateUser = (values) => {
        dispatch(updateUser({
            userId: user.id,
            email: values.email,
            name: values.name,
            password: values.password
        }));
    }

    return (
        <UserModal onClose={onClose} isVisible={isVisible}>
            <div>
                <h3>Update your details here</h3>
                <Formik
                    initialValues={initialValues}
                    validationSchema={userSchema}
                    onSubmit={(values, { setSubmitting }) => {
                        setSubmitting(true);
                        handleUpdateUser(values); // or handleLogin(values) depending on the form
                        setSubmitting(false);
                    }}
                    >
                    {({ isSubmitting }) => (
                        <div className='register-form'>
                            <Form className='fields'>

                                <Field type="email" name="email" placeholder="Email" />
                                <ErrorMessage name="email" component="div" />

                                <Field type="text" name="name" placeholder="Name" />
                                <ErrorMessage name="name" component="div" />

                                <Field type="password" name="password" placeholder="Password" />
                                <ErrorMessage name="password" component="div" />

                                <button id='register' type="submit" disabled={isSubmitting}>
                                    Update
                                </button>
                                {/* Login button can be added similarly */}
                                {isLoading && <p>Loading...</p>}
                                {hasError && <p>{error}</p>}
                                {isSuccess && <p className={'success-message'}>Updated successfully! You may close this window</p>}
                            </Form>
                        </div>
                    )}
                    </Formik>
                    
            </div>
        </UserModal>
    )
}

UserProfile.propTypes = {
    isVisible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
};