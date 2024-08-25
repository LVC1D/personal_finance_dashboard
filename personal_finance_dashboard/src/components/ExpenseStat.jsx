import { useSelector, useDispatch } from 'react-redux';
import { loadExpenses, updateExpense, deleteExpense } from '../slices/expenseSlice';
import PieChart from './PieChart';
import '../styles/Income.css';
import { useState, useEffect, useRef } from 'react';
import trashIcon from '../assets/Trash_icon.svg';
import EntryTooltip from './EntryTooltip';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

export default function ExpenseStat() {
    const dispatch = useDispatch();
    const { expenses, isLoading, hasError } = useSelector((state) => state.expenses);
    const { user } = useSelector((state) => state.auth);
    const [visibleTooltipId, setVisibleTooltipId] = useState(null);
    const tooltipRef = useRef(null);

    const expenseSchema = Yup.object().shape({
        category: Yup.string().required('Category is required'),
        amount: Yup.number().required('Amount is required'),
    });

    const initialValues = {
        category: '',
        amount: '',
        description: ''
    };

    const handleDeleteExpense = (expenseId) => {
        dispatch(deleteExpense(expenseId))
            .then(() => dispatch(loadExpenses({
                userId: user.id
            })))
    };

    const handleTooltip = (expenseId) => {
        setVisibleTooltipId((prevId) => (prevId === expenseId ? null : expenseId));
    }

    const handleUpdateExpense = (expenseId, category, amount, description) => {
        dispatch(updateExpense({
            expenseId,
            category,
            amount,
            description
        }))
            .then(() => dispatch(loadExpenses({
                userId: user.id
            })));
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
                setVisibleTooltipId(null);
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div>
            <section>
                <div className="pie-chart">
                    <PieChart data={expenses} />
                    <div className='extra'>
                        <h2>Expenses: ${user?.total_expenses}</h2>
                    </div>
                </div>
            </section>
            <div className="income-list">
                {isLoading && <p>Loading data...</p>}
                {expenses.map(item => (
                    <li key={item.id} className='income-item'>
                        <div onClick={() => handleTooltip(item.id)} style={{ cursor: 'pointer', textDecoration: 'underline' }}>
                            <EntryTooltip
                                content={
                                    <div ref={tooltipRef} onClick={(e) => e.stopPropagation()}>
                                        <h4>Update the entry here</h4>
                                        <Formik
                                            initialValues={initialValues}
                                            validationSchema={expenseSchema}
                                            onSubmit={(values, { setSubmitting }) => {
                                                setSubmitting(true);
                                                handleUpdateExpense(item.id, values.category, values.amount, values.description);
                                                setSubmitting(false);
                                            }}
                                        >
                                            {({ isSubmitting }) => (
                                                <div>

                                                    <Form>
                                                        <Field  type="text" name="category" placeholder="Category" />
                                                        <ErrorMessage name="category" component="div" />

                                                        <Field  type="text" name="amount" placeholder="Amount" />
                                                        <ErrorMessage name="amount" component="div" />

                                                        <Field type="text" name="description" placeholder="Description (optional)" />
                                                        <ErrorMessage name="descripiton" component="div" />

                                                        <button id="update-income" type="submit" disabled={isSubmitting}>
                                                            Update an expense
                                                        </button>
                                                        {isLoading && <p>Loading...</p>}
                                                        {hasError && <p>Failed to update an expense</p>}
                                                    </Form>
                                                </div>
                                            )}
                                        </Formik>
                                    </div>
                                }
                                isVisible={visibleTooltipId === item.id}
                            >
                            </EntryTooltip>
                            <p><strong>Category:</strong> {item.category}</p>
                            <p>${item.amount}</p>
                            <p>Description: {item.description ? item.description : 'N/A'}</p>
                        </div>
                        <button onClick={() => handleDeleteExpense({
                            expenseId: item.id
                        })}>
                            <img src={trashIcon} />
                        </button>
                    </li>
                ))}
            </div>
            {hasError && <p>Something went wrong.</p>}
        </div>
    )
}