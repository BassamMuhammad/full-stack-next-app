import { Flex } from "@chakra-ui/layout";
import { Box, Button, Heading, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useMeQuery, useLogoutMutation } from "../generated/graphql";
import { isServer } from "../utils/isServer";

export const Navbar = () => {
  const router = useRouter();
  const [{ fetching, data }] = useMeQuery({ pause: isServer });
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  let body: JSX.Element = null;

  //data is loading
  if (fetching) {
    body = null;
  } else if (!data?.me) {
    //user is not logged in
    body = (
      <>
        <NextLink href="/login">
          <Link mr={2}>Login</Link>
        </NextLink>
        <NextLink href="/register">
          <Link>Register</Link>
        </NextLink>
      </>
    );
  } else {
    //user logged in
    body = (
      <Flex align="center">
        <NextLink href="/create-post">
          <Button as={Link} mr="4">
            Create Post
          </Button>
        </NextLink>
        <Box mr={2}>{data.me.username}</Box>
        <Button
          variant="link"
          onClick={async () => {
            await logout();
            router.reload();
          }}
          isLoading={logoutFetching}
        >
          logout
        </Button>
      </Flex>
    );
  }
  return (
    <Flex pos="sticky" top={0} zIndex={1} bg="tan" p={4}>
      <Flex flex={1} maxW={800} align="center" m="auto">
        <Box>
          <NextLink href="/">
            <Link>
              <Heading>Reddit</Heading>
            </Link>
          </NextLink>
        </Box>
        <Box ml="auto">{body}</Box>
      </Flex>
    </Flex>
  );
};
