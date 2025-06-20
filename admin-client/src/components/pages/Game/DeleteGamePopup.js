import React from "react";
import { useNavigate } from "react-router-dom";

// Contexts
import { useAPI } from "../../../context/API/API.context";
import { useGlobal } from "../../../context/Global/Global.context";

function DeleteGamePopup(props) {
  const { gameID, closePopup } = props;
  const { deleteGame } = useAPI();
  const { showLoading, hideLoading } = useGlobal();
  const navigate = useNavigate();

  return (
    <div className="shadow-container center">
      <div className="ap-popup center-vertical">
        <p className="ap-popup__main-msg">
          Are you sure you want to delete this game?
        </p>
        <p className="ap-popup__sub-msg">
          All Player Stats and Game Data will be gone forever
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
              await deleteGame(gameID);
              closePopup();
              hideLoading();
              navigate("/");
            }}
          >
            Delete Game
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteGamePopup;
