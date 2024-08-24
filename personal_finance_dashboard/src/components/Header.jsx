import ROUTES from "../routes";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import '../styles/Header.css';
import { logoutUser } from "../slices/authSlice";
import { loadIncomes } from "../slices/incomeSlice";

export default function Header () {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const userId = searchParams.get('userId');

    const handleLogout = () => {
        dispatch(logoutUser());
        navigate(ROUTES.HOME);
    };
    
    const {isAuth, user} = useSelector(state => state.auth);

    return (
        <header>
            <div className="nav-left">
                <Link to={ROUTES.HOME}>
                    <p>It's a logo</p>
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
                <Link to={ROUTES.USER(parseInt(user?.id))}>
                    <p hidden={!isAuth}>My profile</p>
                </Link>
                <button onClick={handleLogout} hidden={!isAuth}>
                    Log out
                </button>
            </div>
        </header>
    )
}