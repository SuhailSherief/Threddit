import { useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import type { GetServerSidePropsContext, NextPage } from "next";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState } from "recoil";
import safeJsonStringify from "safe-json-stringify";
import { Community, communityState } from "../../../atoms/communitiesAtom";
import CommunityNotFound from "../../../components/Community/CommunityNotFound";
import Header from "../../../components/Community/Header";
import { auth, firestore } from "../../../firebase/clientApp";
import PageContentLayout from "@/src/components/Layout/PageContentLayout";
import CreatePostLink from "@/src/components/Community/CreatePostLink";
import Posts from "@/src/components/Posts/Posts";
import About from "@/src/components/Community/About";

interface CommunityPageProps {
  communityData: Community;
}

const CommunityPage = ({ communityData }: CommunityPageProps) => {
  const [user, loadingUser] = useAuthState(auth);

  const [communityStateValue, setCommunityStateValue] =
    useRecoilState(communityState);

  // useEffect(() => {
  //   // First time the user has navigated to this community page during session - add to cache
  //   const firstSessionVisit =
  //     !communityStateValue.visitedCommunities[communityData.id!];

  //   if (firstSessionVisit) {
  //     setCommunityStateValue((prev) => ({
  //       ...prev,
  //       visitedCommunities: {
  //         ...prev.visitedCommunities,
  //         [communityData.id!]: communityData,
  //       },
  //     }));
  //   }
  // }, [communityData]);

  useEffect(() => {
    setCommunityStateValue((prev) => ({
      ...prev,
      currentCommunity: communityData,
    }));
  }, []);

  // Community was not found in the database
  if (!communityData) {
    return <CommunityNotFound />;
  }

  return (
    <>
      <Header communityData={communityData} />
      <PageContentLayout>
        <>
          <CreatePostLink />
          <Posts
            communityData={communityData}
            userId={user?.uid}
            loadingUser={loadingUser}
          />
        </>
        <>
          <About communityData={communityData} />
        </>
      </PageContentLayout>
    </>
  );
};

export default CommunityPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  console.log("GET SERVER SIDE PROPS RUNNING");

  try {
    const communityDocRef = doc(
      firestore,
      "communities",
      context.query.communityId as string
    );
    const communityDoc = await getDoc(communityDocRef);
    return {
      props: {
        communityData: communityDoc.exists()
          ? JSON.parse(
              safeJsonStringify({ id: communityDoc.id, ...communityDoc.data() }) // needed for dates
            )
          : "",
      },
    };
  } catch (error) {
    // Could create error page here
    console.log("getServerSideProps error - [community]", error);
  }
}
