import ROUTES from "../routes"
import { Link } from "react-router-dom";
import '../styles/Header.css';

export default function Header () {
    return (
        <header>
            <p className="nav-bound">It's a logo</p>
            <div className="nav-center">
                <button>
                    <Link to={ROUTES.INCOMES}>
                        Income
                    </Link>
                </button>
                <button>
                    <Link to={ROUTES.EXPENSES}>
                        Expenses
                    </Link>
                </button>
                <button>
                    <Link to={ROUTES.INVESTMENTS}>
                        Investments
                    </Link>
                </button>
            </div>
            <div className="nav-bound">
                <Link to={ROUTES.USER}>
                    My profile
                </Link>
            </div>
        </header>
    )
}