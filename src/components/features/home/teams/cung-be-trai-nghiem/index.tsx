import cbtnTeamMissionData from "../../../../../utils/data/json/teams/mission/cung-be-trai-nghiem.json";
import cbtnTeamCoverImageData from "../../../../../utils/data/json/teams/banner/cung-be-trai-nghiem.json";
import { CoverImageSlide } from "../../components/CoverImageSlide";
import ListNewsHome from "../../components/ListNews";
import { MissionComponent } from "../../components/MissionComponent";

export const CbtnTeamContent = () => {
  return (
    <>
      <CoverImageSlide coverImageData={cbtnTeamCoverImageData} />
      <MissionComponent missionCartData={cbtnTeamMissionData} />
      <ListNewsHome team="cung-be-trai-nghiem" />
    </>
  );
};
