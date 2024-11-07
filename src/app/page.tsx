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
  Loader,
} from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import { postSchema } from "./api/applicants/route";
import { useForm, yupResolver } from "@mantine/form";
import * as yup from "yup";

type TSchema = yup.InferType<typeof postSchema>;
export default function Home() {
  console.log(process.env);
  const [result, setResult] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [agree, setAgree] = useState<boolean>(false);
  const form = useForm<TSchema>({
    validate: yupResolver(postSchema),
    initialValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      mobileNo: [],
      phoneNo: [],
      address: [],
      degree: "",
      studentId: "",
      email: "",
      university: "",
    },
  });

  const openRef = useRef<() => void>(null);
  const [active, setActive] = useState(0);
  const nextStep = () =>
    setActive((current) => (current < 3 ? current + 1 : current));
  // const prevStep = () =>
  //   setActive((current) => (current > 0 ? current - 1 : current));

  const sendEmail = (recipientEmail) => {
    setLoading(true);
    fetch("/api/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Specify the content type as JSON
      },
      body: JSON.stringify({
        recipientName: "dwdww",
        recipientEmail: recipientEmail,
      }),
    })
      .then((res) => res.json())
      .then((data) => setResult(data))
      .catch((error) => setResult(error))
      .finally(() => {
        setLoading(false);
        nextStep();
      });
  };
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
        {loading ? (
          <Loader color="blue" />
        ) : active === 0 ? (
          <>
            <TextInput
              withAsterisk
              label="Email"
              placeholder="your@email.com"
              {...form.getInputProps("email")}
            />
            <Checkbox
              mt="md"
              label="I agree to sell my privacy"
              checked={agree}
              onChange={(event) => setAgree(event.currentTarget.checked)}
            />
            <Group justify="flex-end" mt="md">
              {/* <Button onClick={nextStep} disabled={agree === false}>
                Submit
              </Button> */}
              <Button
                onClick={() => {
                  form.validateField("email");
                  if (form.validateField("email").hasError === false) {
                    sendEmail(form.values.email);
                  }
                }}
                disabled={agree === false}
              >
                Submit
              </Button>
            </Group>
          </>
        ) : active === 1 ? (
          <>
            <TextInput
              withAsterisk
              label="Reference No."
              {...form.getInputProps("studentId")}
            />
            <Group justify="flex-end" mt="md">
              {/* <Button type="submit">Submit</Button> */}
              <Button onClick={nextStep}>Submit</Button>
            </Group>
          </>
        ) : active === 2 ? (
          <form>
            <Grid grow w="40vw">
              <Grid.Col span={12}>
                <TextInput
                  withAsterisk
                  label="First Name"
                  {...form.getInputProps("firstName")}
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <TextInput
                  withAsterisk
                  label="Middle Name"
                  {...form.getInputProps("middleName")}
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <TextInput
                  withAsterisk
                  label="Last Name"
                  {...form.getInputProps("lastName")}
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <TextInput
                  withAsterisk
                  label="Email"
                  {...form.getInputProps("email")}
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <TextInput
                  withAsterisk
                  label="Address"
                  {...form.getInputProps("address")}
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <TextInput
                  withAsterisk
                  label="Degree"
                  {...form.getInputProps("degree")}
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
          <Text>{JSON.stringify(result)}</Text>
        )}
        <Stepper
          active={active}
          onStepClick={setActive}
          allowNextStepsSelect={false}
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
