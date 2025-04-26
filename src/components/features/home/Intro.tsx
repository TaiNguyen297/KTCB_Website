import React from "react";

interface Props {
  title: string;
  content: string;
  banner_url?: string;
}

export const Intro: React.FC<Props> = ({ title, content, banner_url }) => {
  return (
    <section
      className="background-intro mb-5"
      style={{
        backgroundImage: `url(${banner_url})`,
      }}
    >
      <div className="background-intro-text">
        <h2 className="mb-5 font-bold text-center relative text-2xl  max-[576px]:text-xl">
          {title}
          <i
            className="fa-solid fa-quote-right d-none d-mflex"
            data-aos="flip-right"
            data-aos-duration="2000"
          ></i>
        </h2>
        <span className="text-center mb-4">
          <em>{content}</em>
        </span>
      </div>
    </section>
  );
};
