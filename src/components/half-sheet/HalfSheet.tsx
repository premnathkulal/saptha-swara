import { useDispatch, useSelector } from "react-redux";
import "./HalfSheet.scss";
import { MyStore } from "../../store/store";
import { closeHalfSheet } from "../../store/slices/app-slice";
import { MouseEvent } from "react";

const HalfSheet = () => {
    const dispatch = useDispatch();
    const isEditOptionEnabled = useSelector(
        (store: MyStore) => store.app.isEditOption
    );

    const handleHalfSheet = (event: MouseEvent) => {
        if ((event.target as HTMLElement).className === 'half-sheet-container')
            dispatch(closeHalfSheet());
    };


    return (
        <div className="half-sheet-container" onClick={(event) => handleHalfSheet(event as MouseEvent)}>
            <div className="half-sheet">
                <div className="text-input">
                    <input type="text" placeholder="Song Name" />
                    <input type="text" placeholder="Song Type" />
                    <input type="text" placeholder="Song Raga" />
                    <input type="text" placeholder="Song Tala" />
                    <input type="text" placeholder="Refference Link" />
                </div>
                <button className="btn">
                    {!isEditOptionEnabled ? "Add" : "Edit"} To The List
                </button>
            </div>
        </div>
    );
};

export default HalfSheet;
