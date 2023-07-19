import { Flex, Image } from "@chakra-ui/react";
import React from "react";
import SearchInput from "./SearchInput";
import RightContent from "./RightContent/RightContent";

const Navbar = () => {
  return (
    <Flex bg="white" height="44px" padding="6px 12px">
      <Flex align="center">
        <Image alt="" src="/images/redditFace.svg" height="30px" />
        <Image
          alt=""
          src="/images/redditText.svg"
          height="46px"
          display={{ base: "none", md: "unset" }}
        />
        {/* <Directory /> */}
        <SearchInput />
        <RightContent />
      </Flex>
    </Flex>
  );
};

export default Navbar;
