import React from "react";

// Contexts
import { useGlobal } from "../../../../context/Global/Global.context";
import { useAPI } from "../../../../context/API/API.context";

function DeletePlayerPopup(props) {
  const {
    deletePlayerPopup: { playerID, refetch },
    closePopup,
  } = props;
  const { deletePlayer } = useAPI();
  const { showLoading, hideLoading } = useGlobal();

  return (
    <div className="shadow-container center">
      <div className="ap-popup center-vertical">
        <p className="ap-popup__main-msg">
          Are you sure you want to delete this player?
        </p>
        <p className="ap-popup__sub-msg">
          All Player Stats and Data will be gone forever
        </p>

        {/* Form Buttons */}
        <div className="ap-popup__btns row">
          <button type="button" className="ap-popup__save" onClick={closePopup}>
            Cancel
          </button>
          <button
            type="button"
            className="ap-popup__cancel"
            onClick={async () => {
              showLoading("Deleting Game...");
              await deletePlayer(playerID);
              closePopup();
              hideLoading();
              refetch();
            }}
          >
            Delete Player
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeletePlayerPopup;
