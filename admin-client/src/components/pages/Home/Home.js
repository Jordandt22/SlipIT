import React, { useState } from "react";

// Components
import GamesSection from "./Games/GamesSection";
import PlayersSection from "./Players/PlayersSection";
import DeletePlayerPopup from "./Players/DeleteGamePopup";

function Home() {
  const [activeTab, setActiveTab] = useState(0);
  const [deletePlayerPopup, setDeletePlayerPopup] = useState({
    show: false,
    playerID: null,
    refetch: null,
  });
  const tabs = [
    {
      name: "Games",
    },
    {
      name: "Players",
    },
  ];

  return (
    <div className="home-container">
      <div className="home-section__tabs row">
        {tabs.map((tab, i) => {
          const { name } = tab;

          return (
            <button
              key={name}
              className={`home-section__tab ${
                activeTab === i ? "home-section__tab-active" : ""
              }`}
              onClick={() => setActiveTab(i)}
            >
              {name}
            </button>
          );
        })}
      </div>

      {activeTab === 0 ? (
        <GamesSection />
      ) : (
        <PlayersSection
          openPopup={(playerID, refetch) =>
            setDeletePlayerPopup({ show: true, playerID, refetch })
          }
        />
      )}

      {/* Delete Player Popup */}
      {deletePlayerPopup.show && (
        <DeletePlayerPopup
          deletePlayerPopup={deletePlayerPopup}
          closePopup={() =>
            setDeletePlayerPopup({ show: false, playerID: null, refetch: null })
          }
        />
      )}
    </div>
  );
}

export default Home;
