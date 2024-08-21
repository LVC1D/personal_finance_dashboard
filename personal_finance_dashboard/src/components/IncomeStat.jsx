import {useSelector, useDispatch} from 'react-redux';
import { loadIncomes, loadIncome, deleteIncome } from '../slices/incomeSlice';
import PieChart from './PieChart';
import '../styles/Income.css';
import trashIcon from '../assets/Trash_icon.svg';

export default function IncomeStat() {
    const dispatch = useDispatch();
    const {incomes, isLoading, hasError} = useSelector((state) => state.incomes);
    const {user} = useSelector((state) => state.auth);

    const handleShowIncome = (incomeId, userId) => dispatch(loadIncome({incomeId, userId}));
    const handleDeleteIncome = (incomeId) => {
        dispatch(deleteIncome(incomeId))
        .then(() => dispatch(loadIncomes({
            userId: user.id
        })))
    }

    return (
        <div>
            <div className="pie-chart">
                <PieChart data={incomes} />
            </div>
            <h2>Your total income: ${user?.total_income}</h2>
            <div className="income-list">
                {isLoading && <p>Loading data...</p>}
                {incomes.map(item => (
                    <li key = {item.id} className='income-item'>
                        <div onClick={() => handleShowIncome(item.id, user.id)}>
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