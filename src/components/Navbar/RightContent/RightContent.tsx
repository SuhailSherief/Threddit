import React from "react";
import { Flex } from "@chakra-ui/react";
import { User } from "firebase/auth";
import AuthButtons from "./AuthButtons";
import AuthModal from "../../Modal/Auth/AuthModal";

type RightContentProps = {
  //user: User;
};

const RightContent = () => {
  return (
    <>
      <AuthModal />
      <AuthButtons />
      {/* <Flex justifyContent="space-between" alignItems="center">
        {user ? <Icons /> : <AuthButtons />}
        <MenuWrapper />
      </Flex> */}
    </>
  );
};
export default RightContent;
