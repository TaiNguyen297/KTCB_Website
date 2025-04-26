/* eslint-disable @next/next/no-img-element */
import { Team } from "@/@types/team";
import Image from "next/image";

const TeamCard = ({ team }: { team: Team }) => {
  return (
    <div className="team-card">
      <div className="team-card-top">
        <img src={team.imgUrl} alt="" />
      </div>
      <div className="team-card-bottom">
        <h4>{team.position}</h4>
        <ul className="flex justify-center items-center gap-3">
          <li>
            <a href="#">
              <i className="fa-brands fa-facebook"></i>
            </a>
          </li>
          <li>
            <a href="#">
              <i className="fa-brands fa-facebook-messenger"></i>
            </a>
          </li>
          <li>
            <a href="#">
              <i className="fa-solid fa-envelope"></i>
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default TeamCard;
