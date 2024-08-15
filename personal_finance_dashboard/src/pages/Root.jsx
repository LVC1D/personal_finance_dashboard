import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import '../styles/Dashboard.css'

export default function Root() {
    return (
        <>
            <Header/>
            <div className="main">
                <Outlet/>
            </div>
        </>
    )
}