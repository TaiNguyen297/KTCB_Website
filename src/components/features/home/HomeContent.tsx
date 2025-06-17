import missionData from "../../../utils/data/json/teams/mission/home.json";
import homeBanner from "../../../utils/data/json/teams/banner/home.json";
import { CoverImageSlide } from "./components/CoverImageSlide";
import ListNewsHome from "./components/ListNews";
import { MissionComponent } from "./components/MissionComponent";
import VolunteerEventComponent from "./components/EventComponent";
import DonationComponent from "./components/DonationComponent";


export const HomeContent = ({ events }: { events: any[] }) => {
  const volunteerEvents = events.filter(event => event.type === "VOLUNTEER");
  const donationEvents = events.filter(event => event.type === "DONATION");
  return (
    <>
      <CoverImageSlide coverImageData={homeBanner} />
      <MissionComponent missionCartData={missionData} />
      <ListNewsHome team="" />
      <VolunteerEventComponent events={volunteerEvents}  />
      <DonationComponent events ={donationEvents} />
    </>
  );
};
