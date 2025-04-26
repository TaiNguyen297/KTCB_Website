import ktstnTeamMissionData from "../../../../../utils/data/json/teams/mission/kien-truc-su-tinh-nguyen.json";
import ktstnTeamCoverImageData from "../../../../../utils/data/json/teams/banner/kien-truc-su-tinh-nguyen.json";
import { CoverImageSlide } from "../../components/CoverImageSlide";
import ListNewsHome from "../../components/ListNews";
import { MissionComponent } from "../../components/MissionComponent";

export const KtstnTeamContent = () => {
  return (
    <>
      <CoverImageSlide coverImageData={ktstnTeamCoverImageData} />
      <MissionComponent missionCartData={ktstnTeamMissionData} />
      <ListNewsHome team="kien-truc-su-tinh-nguyen" />
    </>
  );
};
