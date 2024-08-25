import ROUTES from "../routes";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import '../styles/Header.css';
import { logoutUser } from "../slices/authSlice";
import {useState} from 'react';
import UserProfile from "../pages/UserProfile";

export default function Header () {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isUserModalVisible, setUserModalVisible] = useState(false);

    const handleLogout = () => {
        dispatch(logoutUser());
        navigate(ROUTES.HOME);
    };
    
    const {isAuth, user} = useSelector(state => state.auth);

    const toggleUserModal = () => {
        setUserModalVisible(!isUserModalVisible);
    }

    return (
        <header>
            <div className="nav-left">
                <Link to={ROUTES.HOME}>
                    <p>Home</p>
                </Link>
            </div>
            <div className="nav-center">
                <Link to={ROUTES.INCOMES(parseInt(user?.id))}>
                    <button disabled={!isAuth}>
                        Income
                    </button>
                </Link>
                <Link to={ROUTES.EXPENSES(parseInt(user?.id))}>
                    <button disabled={!isAuth}>
                        Expenses
                    </button>
                </Link>
                <Link to={ROUTES.INVESTMENTS(parseInt(user?.id))}>
                    <button disabled={!isAuth}>
                        Investments
                    </button>
                </Link>
            </div>
            <div className="nav-right">
                <div onClick={toggleUserModal} style={{ cursor: 'pointer' }} >
                    <button hidden={!isAuth}>My profile</button>    
                </div>
                {isUserModalVisible && <UserProfile isVisible={isUserModalVisible} onClose={toggleUserModal} />}
                <button onClick={handleLogout} hidden={!isAuth}>
                    Log out
                </button>
            </div>
        </header>
    )
}