import React, { useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { Post } from "@/src/atoms/postAtom";
import About from "../../../../components/Community/About";
import PageContentLayout from "@/src/components/Layout/PageContentLayout";
import { auth, firestore } from "../../../../firebase/clientApp";
import useCommunityData from "../../../../hooks/useCommunityData";
import usePosts from "../../../../hooks/usePosts";
import PostItem from "@/src/components/Posts/PostItem";
import PostLoader from "@/src/components/Posts/PostLoader";

type PostPageProps = {};

const PostPage = ({}: PostPageProps) => {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const { community, pid } = router.query;
  const { communityStateValue } = useCommunityData();

  // Need to pass community data here to see if current post [pid] has been voted on
  const {
    postStateValue,
    setPostStateValue,
    onDeletePost,
    loading,
    setLoading,
    onVote,
  } = usePosts(communityStateValue.currentCommunity);

  const fetchPost = async (postId: string) => {
    console.log("FETCHING POST");

    setLoading(true);
    try {
      const postDocRef = doc(firestore, "posts", postId);
      const postDoc = await getDoc(postDocRef);
      setPostStateValue((prev) => ({
        ...prev,
        selectedPost: { id: postDoc.id, ...postDoc.data() } as Post,
      }));
    } catch (error: any) {
      console.log("fetchPost error", error.message);
    }
    setLoading(false);
  };

  // Fetch post if not in already in state
  useEffect(() => {
    const { pid } = router.query;

    if (pid && !postStateValue.selectedPost) {
      fetchPost(pid as string);
    }
  }, [router.query, postStateValue.selectedPost]);

  return (
    <PageContentLayout>
      {/* Left Content */}
      <>
        {loading ? (
          <PostLoader />
        ) : (
          <>
            {postStateValue.selectedPost && (
              <>
                <PostItem
                  post={postStateValue.selectedPost}
                  // postIdx={postStateValue.selectedPost.postIdx}
                  onVote={onVote}
                  onDeletePost={onDeletePost}
                  userVoteValue={
                    postStateValue.postVotes.find(
                      (item) => item.postId === postStateValue.selectedPost?.id
                    )?.voteValue
                  }
                  userIsCreator={
                    user?.uid === postStateValue.selectedPost.creatorId
                  }
                  router={router}
                />
                {/* <Comments
                  user={user}
                  community={community as string}
                  selectedPost={postStateValue.selectedPost}
                /> */}
              </>
            )}
          </>
        )}
      </>
      {/* Right Content */}
      <>
        <About
          communityData={
            communityStateValue.currentCommunity
            // communityStateValue.visitedCommunities[community as string]
          }
          loading={loading}
        />
      </>
    </PageContentLayout>
  );
};
export default PostPage;
