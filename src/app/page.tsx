"use client";

import { useRef, useState } from "react";
import {
  Stepper,
  Button,
  Group,
  Flex,
  Text,
  TextInput,
  Checkbox,
  Grid,
} from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";

export default function Home() {
  const openRef = useRef<() => void>(null);
  const [active, setActive] = useState(1);
  const nextStep = () =>
    setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));
  return (
    <>
      <Flex
        h={"100vh"}
        w={"100vw"}
        pos="relative"
        align="center"
        justify="center"
        direction="column"
      >
        {active === 0 ? (
          <form>
            <TextInput
              withAsterisk
              label="Email"
              placeholder="your@email.com"
            />
            <Checkbox mt="md" label="I agree to sell my privacy" />
            <Group justify="flex-end" mt="md">
              {/* <Button type="submit">Submit</Button> */}
              <Button onClick={nextStep}>Submit</Button>
            </Group>
          </form>
        ) : active === 1 ? (
          <form>
            <TextInput
              withAsterisk
              label="Reference No."
              placeholder="your@email.com"
            />
            <Group justify="flex-end" mt="md">
              {/* <Button type="submit">Submit</Button> */}
              <Button onClick={nextStep}>Submit</Button>
            </Group>
          </form>
        ) : active === 2 ? (
          <form>
            <Grid grow w="40vw">
              <Grid.Col span={4}>
                <TextInput
                  withAsterisk
                  label="First Name"
                  placeholder="your@email.com"
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <TextInput
                  withAsterisk
                  label="Middle Name"
                  placeholder="your@email.com"
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <TextInput
                  withAsterisk
                  label="Last Name"
                  placeholder="your@email.com"
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <TextInput
                  withAsterisk
                  label="Email"
                  placeholder="your@email.com"
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <TextInput
                  withAsterisk
                  label="Email"
                  placeholder="your@email.com"
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <Dropzone openRef={openRef} onDrop={() => {}}>
                  {/* children */}
                </Dropzone>
              </Grid.Col>
            </Grid>
          </form>
        ) : (
          "error"
        )}

        {/* <Group justify="center" mt="xl">
          <Button variant="default" onClick={prevStep}>
            Back
          </Button>
          <Button onClick={nextStep}>Next step</Button>
        </Group> */}
        <Stepper
          active={active}
          onStepClick={setActive}
          px="lg"
          style={{
            position: "absolute",
            bottom: 40,
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <Stepper.Step label="First step" description="Create an account">
            Step 1 content: Create an account
          </Stepper.Step>
          <Stepper.Step label="Second step" description="Verify email">
            Step 2 content: Verify email
          </Stepper.Step>
          <Stepper.Step label="Final step" description="Get full access">
            Step 3 content: Get full access
          </Stepper.Step>
          <Stepper.Completed>
            <Text truncate="end">
              Completed, click back button to get to previous step
            </Text>
          </Stepper.Completed>
        </Stepper>
      </Flex>
    </>
  );
}
