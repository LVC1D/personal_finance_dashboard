import {useSelector, useDispatch} from 'react-redux';
import BalanceChart from './BalanceChart';
import '../styles/Income.css';

export default function Balance() {
    const dispatch = useDispatch();
    const {user} = useSelector((state) => state.auth);
    const {userBalances} = useSelector((state) => state.users);
    
    return (
        <div>
            <section>
                <div className='pie-chart'>
                    <BalanceChart data={userBalances} />
                    <div className='extra'>
                        <h2>Net Balance: ${user.total_income - user.total_expenses}</h2>
                        <p><em>excluding investments</em></p>
                    </div>
                </div>
            </section>
            <div className='income-list'>
            {userBalances.map(item => (
                    <li key = {userBalances.indexOf(item) + 1} className='income-item'>
                        <div>
                            <p><strong>Total {item.type}: </strong> ${item.data}</p>
                        </div>
                    </li>
                ))}
            </div>
        </div>
    )
};