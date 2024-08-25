import {useSelector, useDispatch} from 'react-redux';
import { loadIncomes, updateIncome, deleteIncome } from '../slices/incomeSlice';
import PieChart from './PieChart';
import '../styles/Income.css';
import trashIcon from '../assets/Trash_icon.svg';
import { useState, useEffect, useRef } from 'react';
import EntryTooltip from './EntryTooltip';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

export default function IncomeStat() {
    const dispatch = useDispatch();
    const {incomes, isLoading, hasError} = useSelector((state) => state.incomes);
    const {user} = useSelector((state) => state.auth);
    const [visibleTooltipId, setVisibleTooltipId] = useState(null);
    const tooltipRef = useRef(null);

    const incomeSchema = Yup.object().shape({
        category: Yup.string().required('Category is required'),
        amount: Yup.number().required('Amount is required'),
    });
    
    const initialValues = {
        category: '',
        amount: '',
        description: ''
    };

    const handleDeleteIncome = (incomeId) => {
        dispatch(deleteIncome(incomeId))
        .then(() => dispatch(loadIncomes({
            userId: user.id
        })))
    }

    const handleTooltip = (incomeId) => {
        setVisibleTooltipId((prevId) => (prevId === incomeId ? null : incomeId));
    }

    const handleUpdateIncome = (incomeId, category, amount, description) => {
        dispatch(updateIncome({
            incomeId,
            category,
            amount,
            description
        }))
            .then(() => dispatch(loadIncomes({
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
                    <PieChart data={incomes} />
                    <div className={'extra'}>
                        <h2>Income: ${user?.total_income}</h2>
                    </div>
                </div>
            </section>
            <div className="income-list">
                {isLoading && <p>Loading data...</p>}
                {incomes.map(item => (
                    <li key = {item.id} className='income-item'>
                        <div onClick={() => handleTooltip(item.id)} style={{ cursor: 'pointer', textDecoration: 'underline' }}>
                        <EntryTooltip
                                content={
                                    <div ref={tooltipRef} onClick={(e) => e.stopPropagation()}>
                                        <h4>Update the entry here</h4>
                                        <Formik
                                            initialValues={initialValues}
                                            validationSchema={incomeSchema}
                                            onSubmit={(values, { setSubmitting }) => {
                                                setSubmitting(true);
                                                handleUpdateIncome(item.id, values.category, values.amount, values.description);
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

                                                        <button id='update-income' type="submit" disabled={isSubmitting}>
                                                            Update an income
                                                        </button>
                                                        {isLoading && <p>Loading...</p>}
                                                        {hasError && <p>Failed to update an income</p>}
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
                        <button onClick={() => handleDeleteIncome({
                            incomeId: item.id
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