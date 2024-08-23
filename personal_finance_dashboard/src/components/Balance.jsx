import {useSelector, useDispatch} from 'react-redux';
import BalanceChart from './BalanceChart';
import '../styles/Income.css';

export default function Balance() {
    const dispatch = useDispatch();
    const {user} = useSelector((state) => state.auth);
    const {userBalances} = useSelector((state) => state.users);

    // console.log('Current balance: ', userBalances)
    
    return (
        <div>
            <h3>Balance</h3>
            <div className='pie-chart'>
                <BalanceChart data={userBalances} />
            </div>
            <h2>Your current net balance is: ${user.total_income - user.total_expenses}</h2>
        </div>
    )
};