import Balance from "../components/Balance";
import LiveStockFeed from "../components/LiveStockFeed";
import ExtraFeatures from "../components/ExtraFeatures";

export default function Dashboard() {
    return (
        <>
            <div className="grid-container">
                <div className="grid-balance">
                    <Balance/>
                </div>
                <div className="grid-column">
                    <div className="grid-item">
                        <LiveStockFeed/>
                    </div>
                    <div className="grid-item">
                        <ExtraFeatures/>
                    </div>
                </div>
            </div>
        </>
    )
}