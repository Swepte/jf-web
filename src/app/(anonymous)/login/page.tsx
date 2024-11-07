import { signIn } from "@/app/api/auth/auth";
import { GoogleButton } from "@/components/GoogleButton";
import { Divider, Flex, Group, Paper, Text } from "@mantine/core";

export default function Home() {
  return (
    <Flex h="100vh" w="100vw">
      <Paper radius="md" p="xl" withBorder w="400px" m="auto">
        <Text size="lg" fw={500}>
          Welcome to Cryptex, <br /> Register using UE Email
        </Text>
        <form
          action={async () => {
            "use server";
            await signIn("google");
          }}
        >
          <Group grow mb="md" mt="md">
            <GoogleButton radius="xl" type="submit">
              Google
            </GoogleButton>
          </Group>
        </form>

        <Divider
          label="Or continue with email"
          labelPosition="center"
          my="lg"
        />
      </Paper>
    </Flex>
  );
}
