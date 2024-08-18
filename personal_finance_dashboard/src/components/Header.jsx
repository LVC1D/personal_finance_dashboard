import ROUTES from "../routes";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import '../styles/Header.css';
import { logoutUser } from "../slices/authSlice";

export default function Header () {
    const dispatch = useDispatch();
    const handleLogout = () => dispatch(logoutUser());
    
    const {isAuth} = useSelector(state => state.auth);

    return (
        <header>
            <div className="nav-left">
                <Link to={ROUTES.HOME}>
                    <p>It's a logo</p>
                </Link>
            </div>
            <div className="nav-center">
                <Link to={ROUTES.INCOMES}>
                    <button disabled={!isAuth}>
                        Income
                    </button>
                </Link>
                <Link to={ROUTES.EXPENSES}>
                    <button disabled={!isAuth}>
                        Expenses
                    </button>
                </Link>
                <Link to={ROUTES.INVESTMENTS}>
                    <button disabled={!isAuth}>
                        Investments
                    </button>
                </Link>
            </div>
            <div className="nav-right">
                <Link to={ROUTES.USER}>
                    <p hidden={!isAuth}>My profile</p>
                </Link>
                <button onClick={handleLogout}>
                    Log out
                </button>
            </div>
        </header>
    )
}