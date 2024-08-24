import {useSelector, useDispatch} from 'react-redux';
import { loadInvestments, loadInvestment, deleteInvestment } from '../slices/investmentSlice';
import InvestmentChart from './PieChart';
import '../styles/Income.css';
import trashIcon from '../assets/Trash_icon.svg';

export default function InvestmentStat() {
    const dispatch = useDispatch();
    const {investments, isLoading, hasError} = useSelector((state) => state.investments);
    const {user} = useSelector((state) => state.auth);

    const handleShowInvestment = (investmentId, userId) => dispatch(loadInvestment({investmentId, userId}));
    const handleDeleteInvestment = (investmentId) => {
        dispatch(deleteInvestment(investmentId))
        .then(() => dispatch(loadInvestments({
            userId: user.id
        })))
    }

    return (
        <div>
            <section>
                <div className="pie-chart">
                    <InvestmentChart data={investments} />
                    <div className='extra'>
                        <h2>Your portfolio: ${user?.total_investments}</h2>
                    </div>
                </div>
            </section>
            <div className="income-list">
                {isLoading && <p>Loading data...</p>}
                {investments.map(item => (
                    <li key = {item.id} className='income-item'>
                        <div onClick={() => handleShowInvestment(item.id, user.id)}>
                            <p><strong>Asset Name:</strong> {item.asset_name}</p>
                            <p>Invested capital: ${item.amount}</p>
                            <p>At the price of: ${parseFloat(item.open_price)}</p>
                        </div>
                        <button onClick={() => handleDeleteInvestment({
                            investmentId: item.id
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