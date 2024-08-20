import IncomeStat from '../components/IncomeStat';
import IncomeAdder from '../components/IncomeAdder';
import '../styles/Dashboard.css';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { checkLoginStatus } from '../slices/authSlice';

export default function Income() {
    const {user, isAuth} = useSelector((state) => state.auth);
    
    const dispatch = useDispatch();

    return (
        <div className="grid-container">
            <div className="grid-balance">
                <IncomeStat/>
            </div>
            <div className="grid-balance">
                <IncomeAdder/>
            </div>
        </div>
    );
}