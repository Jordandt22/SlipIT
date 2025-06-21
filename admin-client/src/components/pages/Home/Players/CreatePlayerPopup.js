import React, { useState } from "react";

// Contexts
import { useGlobal } from "../../../../context/Global/Global.context";
import { useAPI } from "../../../../context/API/API.context";

function CreatePlayerPopup(props) {
  const { setCreatePlayerPopup, refetch } = props;
  const { createPlayer } = useAPI();
  const { showLoading, hideLoading } = useGlobal();
  const [form, setForm] = useState({
    name: "",
    image: "jordan",
  });

  const updateFormInput = (inputName, value) =>
    setForm((curForm) => ({ ...curForm, [inputName]: value }));

  const playerProfilePictures = [
    "jordan",
    "kevin",
    "jeffrey",
    "jayden",
    "sunny",
    "cody",
    "ivan",
    "leandro",
  ];
  return (
    <div className="shadow-container center">
      <div className="cg-popup">
        <h2 className="cg-popup__title">Create a Player</h2>

        {/* Name */}
        <div className="cg-popup__box">
          <label className="cg-popup__label">Player's Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={(e) => updateFormInput("name", e.target.value)}
            placeholder="Enter the player's name..."
            className="cg-popup__input"
            autoComplete="off"
          />
        </div>

        {/* Image */}
        <div className="cg-popup__box">
          <label className="cg-popup__label">Player Profile Picture</label>
          <select
            name="sport"
            value={form.image}
            onChange={(e) => updateFormInput("image", e.target.value)}
            className="cg-popup__dropdown"
          >
            {playerProfilePictures.map((image) => {
              return (
                <option key={image + "-dropdown-opt"} value={image}>
                  {image}
                </option>
              );
            })}
          </select>
        </div>

        {form.name.length > 0 && (
          <button
            type="button"
            className="cg-popup__submit player-form__submit"
            onClick={async () => {
              showLoading("Creating New Player...");
              await createPlayer({
                playerInfo: {
                  ...form,
                  image: `https://res.cloudinary.com/dmayqxip7/image/upload/v1748049394/SlipIT/Players/Headshots/${form.image}.png`,
                },
              });
              setCreatePlayerPopup({ show: false });
              hideLoading();
              refetch();
            }}
          >
            Create
          </button>
        )}
        <button
          type="button"
          className="cg-popup__cancel"
          onClick={() => {
            setCreatePlayerPopup({ show: false });
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default CreatePlayerPopup;
