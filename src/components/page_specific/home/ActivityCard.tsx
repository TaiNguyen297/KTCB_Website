/* eslint-disable @next/next/no-img-element */

const ActivityCard = ({ activity }: { activity: Activity }) => {
  return (
    <div
      className="flex flex-col align-center gap-3 px-3"
      data-aos="fade-up"
      data-aos-delay="400"
      data-aos-duration="2000"
      data-carousel-item
    >
      <a href="/pages/news.html" className="activity-hover">
        <div className="activity-card">
          <div className="activity-card-img">
            <img src={activity.imgUrl} alt="" />
          </div>
          <div className="activity-card-content">
            <span>{activity.tag}</span>
            <h3>{activity.title}</h3>
            <p>{activity.description}</p>
            <i className="fa-solid fa-arrow-right"></i>
          </div>
        </div>
      </a>
    </div>
  );
};

export default ActivityCard;
