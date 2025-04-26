// import Slider from 'react-slick';
// import { LazyLoadTypes } from 'react-slick';
// import ActivityCard from './ActivityCard';

// const PrevArrow = (props: { onClick: any; }) => {
//   const { onClick } = props;
//   return (
//     <div className="slick-next absolute" onClick={onClick}>
//       <i className="fa fa-angle-left" aria-hidden="true"></i>
//     </div>
//   );
// }

// const NextArrow = (props: { onClick: any; }) => {
//   const { onClick } = props;
//   return (
//     <div className="slick-next absolute" onClick={onClick}>
//       <i className="fa fa-angle-right" aria-hidden="true"></i>
//     </div>
//   )
// }

// const lazyLoad: LazyLoadTypes = 'ondemand';

// const defaultSettings = {
//   infinite: true,
//   lazyLoad: lazyLoad,
//   dots: false,
//   autoPlay: true,
//   autoPlaySpeed: 500,
//   cssEase: 'linear',
//   arrows: true,
//   prevArrow: <PrevArrow onClick={() => {}} />,
//   nextArrow: <NextArrow onClick={() => {}} />,
// }

// const settings = {
//   ...defaultSettings,
//   slidesToShow: 3,
//   slidesToScroll: 1,
//   responsive: [
//     {
//       breakpoint: 1024,
//       settings: {
//         slidesToShow: 2,
//         slidesToScroll: 1,
//         ...defaultSettings,
//       },
//     },
//     {
//       breakpoint: 768,
//       settings: {
//         slidesToShow: 1,
//         slidesToScroll: 1,
//         ...defaultSettings,
//       },
//     },
//   ]
// };

// const ActivitySlider = ({activities}: { activities: Activity[] }) => {
//   return (
//     <div className="activities-slider">
//       <Slider {...settings}>
//         {activities.map((activity) => (
//           <ActivityCard activity={activity} key={activity.imgUrl} />
//         ))}
//       </Slider>
//     </div>
//   );
// };

// export default ActivitySlider;
