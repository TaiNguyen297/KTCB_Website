import missionData from "../../../utils/data/json/teams/mission/home.json";
import homeBanner from "../../../utils/data/json/teams/banner/home.json";
import { CoverImageSlide } from "./components/CoverImageSlide";
import ListNewsHome from "./components/ListNews";
import { MissionComponent } from "./components/MissionComponent";

export const HomeContent = () => {
  return (
    <>
      <CoverImageSlide coverImageData={homeBanner} />
      <MissionComponent missionCartData={missionData} />
      <ListNewsHome team="" />
    </>
  );
};
