import { useSelector, useDispatch } from "react-redux";
import { addIncome, loadIncomes } from "../slices/incomeSlice";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import '../styles/Income.css';
import { loadBalances } from '../slices/userSlice';
import { useEffect } from "react";

export default function IncomeAdder() {
    const {isLoading, hasError} = useSelector((state) => state.incomes);
    const {user} = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const {userBalances} = useSelector((state) => state.users);
    
    const incomeSchema = Yup.object().shape({
        category: Yup.string().required('Category is required'),
        amount: Yup.number().required('Amount is required'),
    });

    const initialValues = {
        category: '',
        amount: '',
        description: ''
    }

    const handleAddIncome = (values) => {
        dispatch(addIncome({
            userId: user.id,
            category: values.category,
            amount: values.amount,
            description: values.description
        }));
    }
    
    return (
        <div>
            <div>
          <Formik
              initialValues={initialValues}
              validationSchema={incomeSchema}
              onSubmit={(values, { setSubmitting }) => {
                  setSubmitting(true);
                  handleAddIncome(values);
                  setSubmitting(false);
              }}
          >
              {({ isSubmitting }) => (
                  <div className='income-form'>
                      <div className='income-banner'>
                          <h2>Income Adder</h2>
                      </div>
                      <Form className='income-fields'>
                          <Field className='field-input' type="text" name="category" placeholder="Category" />
                          <ErrorMessage name="category" component="div" />

                          <Field className='field-input' type="text" name="amount" placeholder="Amount" />
                          <ErrorMessage name="amount" component="div" />

                          <Field className='field-input' type="text" name="description" placeholder="Description (optional)" />
                          <ErrorMessage name="descripiton" component="div" />

                          <button id='add-income' type="submit" disabled={isSubmitting}>
                              Add an income
                          </button>
                          {isLoading && <p>Loading...</p>}
                          {hasError && <p>Failed to add an income</p>}
                      </Form>
                  </div>
              )}
          </Formik>
      </div> 
        </div>
    )
}