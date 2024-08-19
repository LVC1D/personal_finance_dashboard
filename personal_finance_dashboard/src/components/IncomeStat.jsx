import {useSelector, useDispatch} from 'react-redux';
import { useEffect } from 'react';
import { loadIncomes, loadIncome, deleteIncome } from '../slices/incomeSlice';
import PieChart from './PieChart';
import '../styles/Income.css';

export default function IncomeStat() {
    const dispatch = useDispatch();
    const {income, isLoading, hasError} = useSelector((state) => state.income);
    const {user} = useSelector((state) => state.auth);

    return (
        <div>
            <div className="pie-chart">
                <PieChart data={income} />
            </div>
            <h2>Your total income: ${user?.total_income}</h2>
            <div className="income-list">
                {isLoading && <p>Loading data...</p>}
                {income.map(item => (
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