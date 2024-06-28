import { MouseEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MyStore } from "../../store/store";
import { closeAddEditOption } from "../../store/slices/app-slice";
import "./AddEditForm.scss";
import HalfSheet from "../half-sheet/HalfSheet";

const AddEditForm = () => {
    const dispatch = useDispatch();
    const isEditOptionEnabled = useSelector(
        (store: MyStore) => store.app.isEditOption
    );

    const handleHalfSheet = (event: MouseEvent) => {
        if ((event.target as HTMLElement).className === 'half-sheet-container')
            dispatch(closeAddEditOption());
    };


    return (
        <div className="add-edit-form" onClick={(event) => handleHalfSheet(event as MouseEvent)}>
            <HalfSheet>
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
            </HalfSheet >
        </div>
    );
};

export default AddEditForm;
