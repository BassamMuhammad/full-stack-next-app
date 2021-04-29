import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import {
  Box,
  Button,
  Flex,
  Heading,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Layout } from "../components/Layout";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import React, { useState } from "react";
import UpdootSection from "../components/UpdootSection";
import { EditDeleteButton } from "../components/EditDeleteButton";

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 10,
    cursor: null as null | string,
  });
  const [{ data, fetching }] = usePostsQuery({ variables });
  if (!data && !fetching)
    return (
      <Layout variant="regular">
        <Flex alignItems="center" justifyContent="center">
          <Heading>Something wrong with query</Heading>
        </Flex>
      </Layout>
    );
  return (
    <Layout variant="regular">
      <br />
      {!data && fetching ? (
        <div>Loading.... </div>
      ) : (
        <Box p={5}>
          <Stack spacing={8}>
            {data.posts.posts?.map((post) =>
              !post ? null : (
                <Flex
                  key={post.id}
                  p={5}
                  shadow="md"
                  borderWidth="5px"
                  align="center"
                  alignItems="flex-end"
                >
                  <UpdootSection post={post} />
                  <Box>
                    <NextLink href={`/post/${post.id}`}>
                      <Link>
                        <Heading fontSize="xl">{post.title}</Heading>
                      </Link>
                    </NextLink>
                    <Text>posted by {post.creator.username}</Text>
                    <Text mt={4}>{post.bodySnippet}</Text>
                  </Box>
                  <Box ml="auto">
                    <EditDeleteButton id={post.id} creatorId={post.creatorId} />
                  </Box>
                </Flex>
              )
            )}
          </Stack>
        </Box>
      )}
      {data && data.posts.hasMore ? (
        <Box>
          <Flex alignItems="center" justifyContent="center">
            <Button
              onClick={() => {
                setVariables({
                  limit: variables.limit,
                  cursor:
                    data.posts.posts[data.posts.posts.length - 1].createdAt,
                });
              }}
              isLoading={fetching}
              my={8}
            >
              Load More
            </Button>
          </Flex>
        </Box>
      ) : null}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
