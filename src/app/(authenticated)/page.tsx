import { signOut } from "../api/auth/auth";
import { Button, Flex } from "@mantine/core";

export default function Home() {
  return (
    <Flex bg={"red"} h={"100vh"} w={"100vw"}>
      ETO HOME PAGE PRE
      <form
        action={async () => {
          "use server";
          await signOut();
        }}
      >
        <Button type="submit">Submit</Button>
      </form>
    </Flex>
  );
}
