import { useSelector, useDispatch } from "react-redux";
import { addExpense, loadExpenses } from "../slices/expenseSlice";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import '../styles/Income.css';

export default function ExpenseAdder() {
    const {isLoading, hasError} = useSelector((state) => state.expenses);
    const {user} = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    
    const expenseSchema = Yup.object().shape({
        category: Yup.string().required('Category is required'),
        amount: Yup.number().required('Amount is required'),
    });

    const initialValues = {
        category: '',
        amount: '',
        description: ''
    }

    const handleAddIncome = (values) => {
        dispatch(addExpense({
            userId: user.id,
            category: values.category,
            amount: values.amount,
            description: values.description
        })).then(() => {
            dispatch(loadExpenses({
                userId: user.id
            }));
        })
        
    }
    
    return (
        <div>
            <div>
          <Formik
              initialValues={initialValues}
              validationSchema={expenseSchema}
              onSubmit={(values, { setSubmitting }) => {
                  setSubmitting(true);
                  handleAddIncome(values);
                  setSubmitting(false);
              }}
          >
              {({ isSubmitting }) => (
                  <div className='income-form'>
                      <div className='income-banner'>
                          <h2>Expense Adder</h2>
                      </div>
                      <Form className='income-fields'>
                          <Field className='field-input' type="text" name="category" placeholder="Category" />
                          <ErrorMessage name="category" component="div" />

                          <Field className='field-input' type="text" name="amount" placeholder="Amount" />
                          <ErrorMessage name="amount" component="div" />

                          <Field className='field-input' type="text" name="description" placeholder="Description (optional)" />
                          <ErrorMessage name="descripiton" component="div" />

                          <button id='add-income' type="submit" disabled={isSubmitting}>
                              Add an expense
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