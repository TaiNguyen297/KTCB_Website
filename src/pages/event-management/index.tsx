import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { NextPage } from "next";
import { DefaultSeo } from "next-seo";
import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { ContainerXL } from "@/components/layouts/ContainerXL";
import ToastSuccess from "@/components/shared/toasts/ToastSuccess";
import { SEO } from "@/configs/seo.config";
import { Box, Button, Typography, CircularProgress } from "@mui/material";
import { QueryClient, dehydrate, useQuery, useQueryClient } from "@tanstack/react-query";
import { EventManagementTable } from "@/components/features/event-management/event/EventManagementTable";
import { RegisterTable } from "@/components/features/event-management/register/RegisterTable";
import { getEventList } from "@/components/features/event-management/event/service/get-event-list";
import { getRegisterList } from "@/components/features/event-management/register/service/get-register-list";
import EventReport from "@/components/features/event-management/event/EventReport";

const TAB_EVENT = 0;
const TAB_REGISTER = 1;
const TAB_REPORT = 2;

const RecruitmentManagementPage = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  
  // Tối ưu session check - không block render
  const { data: session, status } = useSession();
  
  const { watch, setValue } = useForm<{ tabIndex: number }>({
    defaultValues: {
      tabIndex: 0,
    },
  });
  const tabIndex = watch("tabIndex");

  // Prefetch function để tối ưu UX
  const prefetchRegisterList = useCallback(() => {
    queryClient.prefetchQuery({
      queryKey: ["registerList"],
      queryFn: () => getRegisterList(),
      staleTime: 1000 * 60 * 10,
    });
  }, [queryClient]);

  // Chỉ load dữ liệu khi cần thiết theo tab
  const {
    data: eventData,
    isLoading: isEventLoading,
    refetch: refetchEvent,
  } = useQuery({
    queryKey: ["eventList"],
    queryFn: () => getEventList(),
    staleTime: 1000 * 60 * 10, // 10 phút
    cacheTime: 1000 * 60 * 30, // 30 phút
    // Luôn enable vì eventData cần cho cả tab EVENT và REPORT
  });

  const {
    data: registerData,
    isLoading: isRegisterLoading,
  } = useQuery({
    queryKey: ["registerList"],
    queryFn: () => getRegisterList(),
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 30,
    // Chỉ load khi user click vào tab REGISTER
    enabled: tabIndex === TAB_REGISTER,
  });

  // Redirect nếu chưa login, nhưng không block render
  if (status === "unauthenticated") {
    router.push("/login");
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  // Show loading khi đang check session
  if (status === "loading") {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  const tabElement = [
    {
      element: isEventLoading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight={200}
        >
          <CircularProgress />
        </Box>
      ) : (
        <EventManagementTable data={eventData} />
      ),
    },
    {
      element: (tabIndex === TAB_REGISTER && isRegisterLoading) ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight={200}
        >
          <CircularProgress />
        </Box>
      ) : (
        <RegisterTable data={registerData} />
      ),
    },
    {
      element: isEventLoading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight={200}
        >
          <CircularProgress />
        </Box>
      ) : (
        <EventReport data={eventData} onReportAdded={refetchEvent} />
      ),
    },
  ];

  if (!session) {
    return null; // Không cần render gì vì đã redirect
  }

  return (
    <ContainerXL>
      <div className="flex flex-col mt-9 gap-4">
        <DefaultSeo {...SEO} title="Quản lý sự kiện" />
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
            disabled={tabIndex === TAB_EVENT}
            onClick={() => setValue("tabIndex", TAB_EVENT)}
          >
            Danh sách sự kiện
          </Button>
          <Button
            variant="contained"
            sx={{
              width: "fit-content",
              textWrap: "nowrap",
            }}
            disabled={tabIndex === TAB_REGISTER}
            color="secondary"
            onClick={() => {
              setValue("tabIndex", TAB_REGISTER);
            }}
            onMouseEnter={() => {
              // Prefetch on hover để tăng tốc độ
              prefetchRegisterList();
            }}
          >
            Danh sách đăng ký
          </Button>
          <Button
            variant="contained"
            sx={{
              width: "fit-content",
              textWrap: "nowrap",
            }}
            disabled={tabIndex === TAB_REPORT}
            color="secondary"
            onClick={() => setValue("tabIndex", TAB_REPORT)}
          >
            Báo cáo thống kê
          </Button>
        </div>

        <Typography fontSize={28} fontWeight={"bold"}>
          {tabIndex === TAB_EVENT
            ? "Danh sách sự kiện"
            : tabIndex === TAB_REGISTER
            ? "Danh sách đăng ký sự kiện"
            : "Tổng hợp báo cáo sự kiện"}
        </Typography>

        {tabElement.map((e, index) => {
          return (
            <div hidden={tabIndex !== index} key={index}>
              {tabIndex === index && <Box>{e.element}</Box>}
            </div>
          );
        })}
      </div>
    </ContainerXL>
  );
};

export async function getServerSideProps() {
  const queryClient = new QueryClient();
  
  // Chỉ prefetch eventList vì nó luôn cần (tab đầu tiên và tab báo cáo)
  // registerList sẽ được load lazy khi user click vào tab
  await queryClient.prefetchQuery({
    queryKey: ["eventList"],
    queryFn: () => getEventList(),
  });
  
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}
export default RecruitmentManagementPage;