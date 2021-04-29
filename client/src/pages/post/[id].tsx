import { Text, Box } from "@chakra-ui/layout";
import { Heading } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import React from "react";
import { EditDeleteButton } from "../../components/EditDeleteButton";
import { Layout } from "../../components/Layout";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { useGetPostFromUrl } from "../../utils/useGetPostFromUrl";

const Post = () => {
  const [{ data, fetching }] = useGetPostFromUrl();
  if (fetching) return <Layout variant="small">Loading....</Layout>;
  if (!data.post) return <Layout variant="small">Could not find post</Layout>;
  return (
    <Layout variant="small">
      <Heading>{data.post.title}</Heading>
      <Text mb={4}>{data.post.body}</Text>
      <EditDeleteButton id={data.post.id} creatorId={data.post.creatorId} />
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
