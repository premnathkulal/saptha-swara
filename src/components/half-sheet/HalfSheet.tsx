import { ReactNode } from "react";
import "./HalfSheet.scss";

interface HalfSheetProps {
    children: ReactNode
}

const HalfSheet = (props: HalfSheetProps) => {
    const { children } = props

    return (
        <div className="half-sheet-container">
            <div className="half-sheet">
                {children}
            </div>
        </div>
    );
};

export default HalfSheet;
