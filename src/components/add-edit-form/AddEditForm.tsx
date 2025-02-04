import { MouseEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MyStore } from "../../store/store";
import {
  closeAddEditOption,
  setShowSearchFilter,
} from "../../store/slices/app-slice";
import "./AddEditForm.scss";
import HalfSheet from "../half-sheet/HalfSheet";
import { SongInfo, useSongInfo } from "../../hooks/api-hook/useSongInfo";
import FilterSelection, { DataItem } from "../filter-selection/FilterSelection";

const AddEditForm = () => {
  const initialSongInfo = {
    name: "",
    type: "",
    raga: "",
    tala: "",
    refLink: "",
  };

  const { setSongDetails, updateSongDetails } = useSongInfo();
  const showFilter = useSelector(
    (store: MyStore) => store.app.showSearchFilter
  );
  const dispatch = useDispatch();
  const isEditOptionEnabled = useSelector(
    (store: MyStore) => store.app.isEditOption
  );
  const editInfo = useSelector((store: MyStore) => store.app.editInfo);
  const [songInfo, setSongInfo] = useState<SongInfo>(initialSongInfo);
  const [showSelectionItem, setShowSelectionIem] = useState(true);
  const [selectionType, setSelectionType] = useState<DataItem>(
    DataItem.Default
  );

  useEffect(() => {
    setShowSelectionIem(showFilter);
  }, [showFilter]);

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
    setSongInfo(initialSongInfo);
    dispatch(closeAddEditOption());
  };

  const handleSearchFilter = (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    dispatch(setShowSearchFilter());
    const inputType = (e.target as HTMLInputElement).id as DataItem;
    setSelectionType(inputType);
  };

  const handleSelectItem = (item: string, id: string) => {
    setSongInfo({
      ...songInfo,
      [id]: item,
    });
  };

  return (
    <div
      className="add-edit-form"
      onClick={(event) => handleHalfSheet(event as MouseEvent)}
    >
      <HalfSheet>
        <div className="text-input">
          <input
            id="name"
            type="text"
            placeholder="Song Name"
            name="name"
            value={songInfo.name}
            onChange={(e: React.FormEvent<HTMLInputElement>) =>
              handleInputChange(e)
            }
          />
          <input
            id="type"
            type="text"
            placeholder="Song Type"
            name="type"
            value={songInfo.type}
            onChange={(e: React.FormEvent<HTMLInputElement>) =>
              handleInputChange(e)
            }
            onClick={(e) => handleSearchFilter(e)}
            readOnly
          />
          <input
            id="raga"
            type="text"
            placeholder="Song Raga"
            name="raga"
            value={songInfo.raga}
            onChange={(e: React.FormEvent<HTMLInputElement>) =>
              handleInputChange(e)
            }
            onFocus={(e) => handleSearchFilter(e)}
            readOnly
          />
          <input
            id="tala"
            name="tala"
            type="text"
            placeholder="Select Tala"
            value={songInfo.tala}
            onChange={(e: React.FormEvent<HTMLInputElement>) =>
              handleInputChange(e)
            }
            onFocus={(e) => handleSearchFilter(e)}
            readOnly
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
      {showSelectionItem && (
        <FilterSelection
          selectionType={selectionType}
          selectItem={(item: string, id: string) => handleSelectItem(item, id)}
        />
      )}
    </div>
  );
};

export default AddEditForm;
