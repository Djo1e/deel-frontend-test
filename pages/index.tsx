import type { NextPage } from "next";

import React, { useEffect, useRef } from "react";
import citiesJSON from "../cities.json";
import { AutoComplete } from "../components/AutoComplete";

const Home: NextPage = () => {
  return (
    <div className="flex bg-[#15357a] flex-col items-center justify-center min-h-screen py-2">
      <AutoComplete data={citiesJSON.cities} />
    </div>
  );
};

export default Home;
