import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import '../styles/Dashboard.css';
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {loadIncomes} from '../slices/incomeSlice';
import {loadExpenses} from '../slices/expenseSlice';
import { logoutUser } from "../slices/authSlice";
// import { checkLoginStatus, setUser } from "../slices/authSlice";

export default function Root() {
    const {user, isAuth} = useSelector((state) => state.auth);
    // console.log("Current user:", user);
    const dispatch = useDispatch();
    

    useEffect(() => {
        if (user) {
            dispatch(loadIncomes({userId: user?.id}));
            dispatch(loadExpenses({userId: user?.id}));
        } else {
            dispatch(logoutUser());
        }
    }, [dispatch, user]);   

    return (
        <>
            <Header/>
            <div className="main">
                <Outlet/>
            </div>
        </>
    )
}