import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import Balance from "../components/Balance";
import LiveStockFeed from "../components/LiveStockFeed";
import ExtraFeatures from "../components/ExtraFeatures";
import { Link } from "react-router-dom";
import ROUTES from "../routes";
import { checkLoginStatus, setUser } from "../slices/authSlice";

export default function Dashboard() {
    const {user, isAuth} = useSelector((state) => state.auth);
    // console.log("Current user:", user);
    const dispatch = useDispatch();

    console.log(`User ID is ${user?.id}`);

    useEffect(() => {
        dispatch(checkLoginStatus());
        
    }, [dispatch]);

    return (
        <>
            {isAuth ? (
                <div className="grid-container">
                    <div className="grid-balance">
                        <Balance />
                    </div>
                    <div className="grid-column">
                        <div className="grid-item">
                            <LiveStockFeed />
                        </div>
                        <div className="grid-item">
                            <ExtraFeatures />
                        </div>
                    </div>
                </div>
            ) : (
                <div>
                    <h1>Hello there! Please login or sign up</h1>
                    <div>
                        <button>
                            <Link to={ROUTES.REGISTER}>Register</Link>
                        </button>
                        <button>
                            <Link to={ROUTES.LOGIN}>Login</Link>
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}