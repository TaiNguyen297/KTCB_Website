import { EventManagementTable } from "@/components/features/event-management/event/EventManagementTable";
import { ContainerXL } from "@/components/layouts/ContainerXL";
import { SEO } from "@/configs/seo.config";
import { Typography } from "@mui/material";
import { DefaultSeo } from "next-seo";
import React from "react";
import { QueryClient, dehydrate, useQuery } from "@tanstack/react-query";
import { getEventList } from "@/components/features/event-management/event/service/get-event-list";

const EventManagementPage = () => {
  const { data } = useQuery({
    queryKey: ["eventList"],
    queryFn: () => getEventList(),
  });

  console.log(data);

  return (
    <ContainerXL>
      <div className="flex flex-col mt-9 gap-4">
        <DefaultSeo {...SEO} title="Quản lý sự kiện" />
        <EventManagementTable data = {data}/>
      </div>
    </ContainerXL>
  );
};

export async function getStaticProps() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["eventList"], getEventList);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}

export default EventManagementPage;
