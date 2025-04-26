import Layout from "@/components/layouts";
import { SEO } from "@/configs/seo.config";
import { Box, Container, Grid, Typography } from "@mui/material";
import { DefaultSeo } from "next-seo";
import Image from "next/image";
import Link from "next/link";
import React from "react";

function Error404() {
  return (
    <>
      <DefaultSeo {...SEO} title="404" />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Container maxWidth="md">
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="h1">404</Typography>
              <Typography variant="h6">Trang bạn đang truy cập không tồn tại</Typography>
              <Link href={"/"}>
                <button className="btn-filled-pink mt-2">
                  Quay lại trang chủ
                </button>
              </Link>
            </Grid>
            <Grid item xs={6}>
              <Image
                src="https://cdn.pixabay.com/photo/2017/03/09/12/31/error-2129569__340.jpg"
                alt="not-found"
                width={500}
                height={250}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}

export default Error404;

Error404.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};
