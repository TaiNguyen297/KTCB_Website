import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DonorRegistrationInputSchema,
  DonorRegistrationInputType,
} from "./types";
import { IconButton, Modal, Button, Typography, Grid, Box } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { ContainerXL } from "@/components/layouts/ContainerXL";
import ktcbBackground from "@public/mission-background.jpg";
import { useRouter } from "next/router";
import { DonorDonate, DonorInformation } from "./components";
import QR from "@public/QR_Techcombank.jpg";
import { useCreateDonorRegistration } from "./hooks/useCreateDonorRegistration";
import {
  MODAL_TYPES,
  useGlobalModalContext,
} from "../global-modal/GlobalModal";
import { KIND_OF_DONATION_OPTIONS } from "@/utils/constants";

export const DonorRegistration = () => {
  const router = useRouter();
  const { showModal } = useGlobalModalContext();
  const [formData, setFormData] = useState<DonorRegistrationInputType | null>(null);
  const [open, setOpen] = useState(false);

  const methods = useForm<DonorRegistrationInputType>({
    resolver: zodResolver(DonorRegistrationInputSchema),
    defaultValues: {
      full_name: "",
      birthday: Date.now(),
      phone_number: "",
      email: "",

      // donate
      kind_of_donate: "",
      image_url: "",
    },
  });

  const getDonationLabel = (value: string | undefined) => {
    const option = KIND_OF_DONATION_OPTIONS.find(option => option.value === value);
    return option ? option.label : "Không xác định";
  };

  const { handleSubmit } = methods;
  const classNameCol = "md:col-span-1 xs:col-span-2";

  const mutate = useCreateDonorRegistration();

  const onSubmit = handleSubmit(async (data) => {
    try {
      setFormData(data);
      setOpen(true);
    } catch (err) {
      console.error(err);
    }
  });

  const handleConfirm = () => {
    // Xác nhận dữ liệu và đóng Dialog
    mutate.mutate(formData as DonorRegistrationInputType);
    showModal(MODAL_TYPES.MODAL_SUCCESS, { heading: "Xác nhận thành công", content: "Cảm ơn đã gửi thông tin", });
    setOpen(false);
    setFormData(null);

    // Reset form
    methods.reset();
  };

  const handleClose = () => {
    // Đóng Dialog mà không xác nhận
    setOpen(false);
  };

  return (
    <FormProvider {...methods}>
      <ContainerXL
        sx={{
          backgroundImage: `url(${ktcbBackground.src})`,
          backgroundSize: "cover",
          backgroundPosition: "top",
        }}
      >
        <div className="flex flex-col mt-9 gap-4">
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="contained"
              sx={{
                width: "fit-content",
              }}
              color="secondary"
              onClick={() => router.push("/member-registration")}
            >
              Trở thành thành viên
            </Button>
            <Button
              variant="contained"
              sx={{
                width: "fit-content",
              }}
              disabled
              color="secondary"
              onClick={() => router.push("/donor-registration")}
            >
              Trở thành nhà hảo tâm
            </Button>
          </div>

          <Typography fontSize={28} fontWeight={"bold"}>
            Đăng ký trở thành nhà hảo tâm Khoảng Trời Của Bé
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} md={9}>
              <DonorInformation />
              <DonorDonate />
            </Grid>
            <Grid
              item
              xs={12}
              md={3}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <Box
                component="img"
                src={QR.src}
                alt="qr_code"
                sx={{
                  width: "100%",
                  height: "100%",
                  maxWidth: "240px",
                }}
              />
            </Grid>
          </Grid>

          <Button
            variant="contained"
            sx={{
              marginTop: "1rem",
              width: "fit-content",
              alignSelf: "center",
            }}
            color="secondary"
            onClick={onSubmit}
          >
            Gửi thông tin
          </Button>
        </div>
      </ContainerXL>

      <Modal open={open} onClose={handleClose}>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-[60vw] w-3/4 h-auto max-h-[60vh] bg-white mx-auto shadow-xl rounded-lg overflow-hidden">
          <div className="grid grid-cols-6 h-full md:p-8 p-4 gap-4">
            <div className="lg:col-span-6 col-span-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={classNameCol}>
                <span className="font-bold">Họ và tên: </span>
                {formData?.full_name}
              </div>
              <div className={classNameCol}>
                <span className="font-bold">Ngày tháng năm sinh: </span>
                {new Date(formData?.birthday).toLocaleDateString('vi-VN')}
              </div>
              <div className={classNameCol}>
                <span className="font-bold">Email: </span>
                {formData?.email}
              </div>
              <div className={classNameCol}>
                <span className="font-bold">Số điện thoại: </span>
                {formData?.phone_number}
              </div>
              <div className={classNameCol}>
                <span className="font-bold">Quyên góp: </span>
                {getDonationLabel(formData?.kind_of_donate)}
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-4 p-4">
            <IconButton onClick={handleClose} aria-label="cancel">
              <CloseIcon />
            </IconButton>
            <IconButton onClick={handleConfirm} aria-label="confirm" color="primary">
              <CheckIcon />
            </IconButton>
          </div>
        </div>
      </Modal>
    </FormProvider>
  );
};
