import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import '../styles/Dashboard.css';
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {loadIncomes} from '../slices/incomeSlice';
import {loadExpenses} from '../slices/expenseSlice';
import { checkLoginStatus } from "../slices/authSlice";
import {loadBalances} from '../slices/userSlice'

export default function Root() {
    const {user, isAuth, isLoading} = useSelector((state) => state.auth);
    // console.log("Current user:", user);
    const dispatch = useDispatch();
    
    useEffect(() => {
        dispatch(checkLoginStatus());
    }, [dispatch]);

    useEffect(() => {
        if (isAuth && user) {
            // console.log('Dispatching loadIncomes with userId:', user.id);
            dispatch(loadIncomes({userId: user.id}))
            .then(() => {
                dispatch(loadExpenses({userId: user.id}));
            })
            .then(() => {
                dispatch(loadBalances({
                    userId: user.id
                }));
            })
        }
    }, [dispatch, isAuth, user]);   

    return (
        <>
            <Header/>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <div className="main">
                    <Outlet/>
                </div>
            )}
        </>
    )
}