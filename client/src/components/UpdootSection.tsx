import React from "react";
import { Flex, IconButton } from "@chakra-ui/react";
import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import {
  PostSnippetFragment,
  PostsQuery,
  useVoteMutation,
} from "../generated/graphql";

interface UpdootProps {
  post: PostSnippetFragment;
}

const UpdootSection: React.FC<UpdootProps> = ({ post }) => {
  const [{ fetching }, vote] = useVoteMutation();
  return (
    <Flex direction="column" justifyContent="center" alignItems="center" mr={4}>
      <IconButton
        onClick={() => vote({ postId: post.id, value: 1 })}
        colorScheme={post.voteStatus === 1 ? "green" : undefined}
        aria-label="updoot post"
        isLoading={fetching}
        icon={<ChevronUpIcon />}
      />
      {post.points}
      <IconButton
        onClick={() => vote({ postId: post.id, value: -1 })}
        colorScheme={post.voteStatus === -1 ? "red" : undefined}
        aria-label="downdoot post"
        isLoading={fetching}
        icon={<ChevronDownIcon />}
      />
    </Flex>
  );
};

export default UpdootSection;
