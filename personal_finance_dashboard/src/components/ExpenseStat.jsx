import {useSelector, useDispatch} from 'react-redux';
import { useEffect } from 'react';
import { loadExpenses, loadExpense, deleteExpense } from '../slices/expenseSlice';
import PieChart from './PieChart';
import '../styles/Income.css';

export default function ExpenseStat() {
    const dispatch = useDispatch();
    const {expenses, isLoading, hasError} = useSelector((state) => state.expenses);
    const {user} = useSelector((state) => state.auth);

    useEffect(() => {
        if (user?.id) {
            dispatch(loadExpenses({ userId: user.id }));
        }
    }, [dispatch, user]);

    return (
        <div>
            <div className="pie-chart">
                <PieChart data={expenses} />
            </div>
            <h2>Your total expenses: ${user?.total_expenses}</h2>
            <div className="income-list">
                {isLoading && <p>Loading data...</p>}
                {expenses.map(item => (
                    <li key = {item.id} className='income-item'>
                        <p>{item.category}</p>
                        <p>{item.amount}</p>
                        <p>{item.description}</p>
                    </li>
                ))}
            </div>
            {hasError && <p>Something went wrong.</p>}
        </div>
    )
}