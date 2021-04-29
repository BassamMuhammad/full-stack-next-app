import { Box, Flex, Link, Button } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { withUrqlClient } from "next-urql";
import router from "next/router";
import React, { useState } from "react";
import { InputField } from "../components/InputField";
import { Wrapper } from "../components/Wrapper";
import { toErrorMap } from "../utils/toErrorMap";
import login from "./login";
import NextLink from "next/link";
import { useForgetPasswordMutation } from "../generated/graphql";
import { NextPage } from "next";
import { createUrqlClient } from "../utils/createUrqlClient";

const ForgotPassword = () => {
  const [, forgetPaassword] = useForgetPasswordMutation();
  const [complete, setComplete] = useState(false);
  return (
    <Wrapper variant="regular">
      <Formik
        initialValues={{ email: "" }}
        onSubmit={async (values) => {
          await forgetPaassword(values);
        }}
      >
        {complete ? (
          <Box>Message sent to the email</Box>
        ) : (
          ({ isSubmitting }) => {
            return (
              <Form>
                <InputField name="eail" label="Email" placeholder="email" />

                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  mt={4}
                  colorScheme="teal"
                >
                  Change Password
                </Button>
              </Form>
            );
          }
        )}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(ForgotPassword);
