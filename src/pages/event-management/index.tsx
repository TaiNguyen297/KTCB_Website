import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { NextPage } from "next";
import { DefaultSeo } from "next-seo";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ContainerXL } from "@/components/layouts/ContainerXL";
import ToastSuccess from "@/components/shared/toasts/ToastSuccess";
import { SEO } from "@/configs/seo.config";
import { Box, Button, Typography } from "@mui/material";
import { QueryClient, dehydrate, useQuery } from "@tanstack/react-query";
import { EventManagementTable } from "@/components/features/event-management/event/EventManagementTable";
import { RegisterTable } from "@/components/features/event-management/register/RegisterTable";
import { getEventList } from "@/components/features/event-management/event/service/get-event-list";
import { getRegisterList } from "@/components/features/event-management/register/service/get-register-list";
import { getPersonInterview } from "@/components/features/recruitment-management/services/get-member-registration";


const RecruitmentManagementPage = () => {
  const [open, setOpen] = useState(false);
  // const { data: session } = useSession({
  //   required: true,
  //   onUnauthenticated() {
  //     router.push("/login");
  //   },
  // });

  // console.log(session);
  
  const router = useRouter();

  const { watch, setValue } = useForm<{ tabIndex: number }>({
    defaultValues: {
      tabIndex: 0,
    },
  });

  // This useQuery could just as well happen in some deeper child to
  // the "Posts"-page, data will be available immediately either way
  const { data } = useQuery({
    queryKey: ["eventList"],
    queryFn: () => getEventList(),
  });

  // This query was not prefetched on the server and will not start
  // fetching until on the client, both patterns are fine to mix
  const { data: RegisterData } = useQuery({
    queryKey: ["registerList"],
    queryFn: () => getRegisterList(),
  });

  console.log({
    data,
    RegisterData,
  });

  const tabElement = [
    {
      element: <EventManagementTable data={data} />,
    },
    {
      element: <RegisterTable data={RegisterData}/>,
    },
  ];

  // if (!session) {
  //   return (
  //     <div>
  //       {/* TODO: Them icon loading */}
  //       Đang tải...
  //     </div>
  //   );
  // }

  return (
    <ContainerXL>
      <div className="flex flex-col mt-9 gap-4">
        <DefaultSeo {...SEO} title="Quản lý đơn tuyển" />
        <ToastSuccess
          open={open}
          onClose={() => setOpen(false)}
          heading="Xác nhận thành công"
          content="Cảm ơn đã gửi thông tin"
        />
        <div className="flex justify-center items-center gap-2">
          <Button
            variant="contained"
            sx={{
              width: "fit-content",
              textWrap: "nowrap",
            }}
            color="secondary"
            disabled={watch("tabIndex") === 0}
            onClick={() => setValue("tabIndex", 0)}
          >
            Danh sách sự kiện
          </Button>
          <Button
            variant="contained"
            sx={{
              width: "fit-content",
              textWrap: "nowrap",
            }}
            disabled={watch("tabIndex") === 1}
            color="secondary"
            onClick={() => setValue("tabIndex", 1)}
          >
            Danh sách đăng ký
          </Button>
        </div>

        <Typography fontSize={28} fontWeight={"bold"}>
          {watch("tabIndex") === 0
            ? "Danh sách sự kiện"
            : "Danh sách đăng ký sự kiện"}
        </Typography>

        {tabElement.map((e, index) => {
          return (
            <div hidden={watch("tabIndex") !== index} key={index}>
              {watch("tabIndex") === index && <Box>{e.element}</Box>}
            </div>
          );
        })}
      </div>
    </ContainerXL>
  );
};

export async function getStaticProps() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["eventList"],
    queryFn: () => getEventList(),
  });

  await queryClient.prefetchQuery({
    queryKey: ["registerList"],
    queryFn: () => getRegisterList(),
  });

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}
export default RecruitmentManagementPage;