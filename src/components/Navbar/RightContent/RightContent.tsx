import React from "react";
import { Button, Flex } from "@chakra-ui/react";
import { User, signOut } from "firebase/auth";
import AuthButtons from "./AuthButtons";
import AuthModal from "../../Modal/Auth/AuthModal";
import { auth } from "@/src/firebase/clientApp";
import Icons from "./Icons";
import UserMenu from "./UserMenu";

type RightContentProps = {
  user?: User | null;
};

const RightContent = ({ user }: RightContentProps) => {
  return (
    <>
      <AuthModal />
      <Flex justifyContent="space-between" alignItems="center">
        {user ? <Icons /> : <AuthButtons />}
        <UserMenu user={user} />
      </Flex>
    </>
  );
};
export default RightContent;
