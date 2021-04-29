import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { Box, Flex, IconButton, Link } from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import { useDeletePostMutation, useMeQuery } from "../generated/graphql";

interface props {
  id: number;
  creatorId: number;
}

export const EditDeleteButton: React.FC<props> = ({ id, creatorId }) => {
  const [, deletePost] = useDeletePostMutation();
  const [{ data }] = useMeQuery();
  if (data?.me?.id !== creatorId) return null;
  return (
    <Flex>
      <NextLink href={`/post/edit/${id}`}>
        <IconButton
          icon={<EditIcon />}
          aria-label="delete post"
          mr="4"
          colorScheme="green"
        />
      </NextLink>
      <IconButton
        icon={<DeleteIcon />}
        aria-label="delete post"
        colorScheme="red"
        onClick={() => {
          deletePost({ id: id });
        }}
      />
    </Flex>
  );
};
