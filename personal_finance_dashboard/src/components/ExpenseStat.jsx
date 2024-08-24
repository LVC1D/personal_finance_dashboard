import {useSelector, useDispatch} from 'react-redux';
import { loadExpenses, loadExpense, deleteExpense } from '../slices/expenseSlice';
import PieChart from './PieChart';
import '../styles/Income.css';
import trashIcon from '../assets/Trash_icon.svg';

export default function ExpenseStat() {
    const dispatch = useDispatch();
    const {expenses, isLoading, hasError} = useSelector((state) => state.expenses);
    const {user} = useSelector((state) => state.auth);

    const handleShowExpense = (expenseId, userId) => dispatch(loadExpense({expenseId, userId}));

    const handleDeleteExpense = (expenseId) => {
        dispatch(deleteExpense(expenseId))
        .then(() => dispatch(loadExpenses({
            userId: user.id
        })))
    }

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
                    <li key = {item.id} className='income-item'>
                    <div onClick={() => handleShowExpense(item.id, user.id)}>
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