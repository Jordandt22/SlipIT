import React, { useState } from "react";

// Components
import GamesSection from "./Games/GamesSection";
import PlayersSection from "./Players/PlayersSection";

function Home() {
  const [activeTab, setActiveTab] = useState(0);
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

      {activeTab === 0 ? <GamesSection /> : <PlayersSection />}
    </div>
  );
}

export default Home;
