import { MouseEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MyStore } from "../../store/store";
import { closeAddEditOption } from "../../store/slices/app-slice";
import "./AddEditForm.scss";
import HalfSheet from "../half-sheet/HalfSheet";
import { SongInfo, useSongInfo } from "../../hooks/api-hook/useSongInfo";

const AddEditForm = () => {
    const intialSongInfo = {
        name: "",
        type: "",
        raga: "",
        tala: "",
        refLink: "",
    };

    const { setSongDetails, updateSongDetails } = useSongInfo();
    const dispatch = useDispatch();
    const isEditOptionEnabled = useSelector(
        (store: MyStore) => store.app.isEditOption
    );
    const editInfo = useSelector((store: MyStore) => store.app.editInfo);
    const [songInfo, setSongInfo] = useState<SongInfo>(intialSongInfo);

    useEffect(() => {
        if (editInfo) {
            setSongInfo(editInfo);
        }
    }, [isEditOptionEnabled]);

    const handleHalfSheet = (event: MouseEvent) => {
        if ((event.target as HTMLElement).className === "half-sheet-container")
            dispatch(closeAddEditOption());
    };

    const handleInputChange = (e: React.FormEvent<HTMLInputElement>) => {
        const { name, value } = e.target as HTMLInputElement;
        setSongInfo({
            ...songInfo,
            [name]: value,
        });
    };

    const handleSubmit = () => {
        if (editInfo) {
            updateSongDetails(songInfo);
        } else {
            setSongDetails(songInfo);
        }
        setSongInfo(intialSongInfo);
        dispatch(closeAddEditOption());
    };

    return (
        <div
            className="add-edit-form"
            onClick={(event) => handleHalfSheet(event as MouseEvent)}
        >
            <HalfSheet>
                <div className="text-input">
                    <input
                        type="text"
                        placeholder="Song Name"
                        name="name"
                        value={songInfo.name}
                        onChange={(e: React.FormEvent<HTMLInputElement>) =>
                            handleInputChange(e)
                        }
                    />
                    <input
                        type="text"
                        placeholder="Song Type"
                        name="type"
                        value={songInfo.type}
                        onChange={(e: React.FormEvent<HTMLInputElement>) =>
                            handleInputChange(e)
                        }
                    />
                    <input
                        type="text"
                        placeholder="Song Raga"
                        name="raga"
                        value={songInfo.raga}
                        onChange={(e: React.FormEvent<HTMLInputElement>) =>
                            handleInputChange(e)
                        }
                    />
                    <input
                        type="text"
                        placeholder="Song Tala"
                        value={songInfo.tala}
                        name="tala"
                        onChange={(e: React.FormEvent<HTMLInputElement>) =>
                            handleInputChange(e)
                        }
                    />
                    <input
                        type="text"
                        placeholder="Refference Link"
                        name="refLink"
                        value={songInfo.refLink}
                        onChange={(e: React.FormEvent<HTMLInputElement>) =>
                            handleInputChange(e)
                        }
                    />
                </div>
                <button className="btn" onClick={handleSubmit}>
                    {!editInfo ? "Add" : "Edit"} To The List
                </button>
            </HalfSheet>
        </div>
    );
};

export default AddEditForm;
