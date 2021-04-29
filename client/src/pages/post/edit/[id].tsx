import { Box, Flex, Link, Button } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { InputField } from "../../../components/InputField";
import { Layout } from "../../../components/Layout";
import { useUpdatePostMutation } from "../../../generated/graphql";
import { createUrqlClient } from "../../../utils/createUrqlClient";
import { useGetPostFromUrl } from "../../../utils/useGetPostFromUrl";
import { useIsAuth } from "../../../utils/useIsAuth";

const EditPost = () => {
  const router = useRouter();
  const id =
    typeof router.query.id === "string" ? parseInt(router.query.id) : -1;
  useIsAuth();
  const [{ data, fetching }] = useGetPostFromUrl();
  const [, updatePost] = useUpdatePostMutation();

  if (fetching) return <Layout variant="small">Loading...</Layout>;
  if (!data.post || id === -1)
    return <Layout variant="small">Could not find post</Layout>;

  return (
    <Layout variant="small">
      <Formik
        initialValues={{ title: data.post.title, body: data.post.body }}
        onSubmit={async (values, { setErrors }) => {
          await updatePost({ id, ...values });
          router.back();
        }}
      >
        {({ isSubmitting }) => {
          return (
            <Form>
              <InputField name="title" label="Title" placeholder="title" />
              <Box mt={4}>
                <InputField
                  name="body"
                  label="Body"
                  placeholder="text...."
                  textArea
                />
              </Box>

              <Button
                type="submit"
                isLoading={isSubmitting}
                mt={4}
                colorScheme="teal"
              >
                Create Post
              </Button>
            </Form>
          );
        }}
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(EditPost);
