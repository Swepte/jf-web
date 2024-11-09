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
  PinInput,
} from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import { useForm, yupResolver } from "@mantine/form";
import * as yup from "yup";
import { post, postForm } from "@/utils/http";
import { notifications } from "@mantine/notifications";
import { HttpStatusCode } from "axios";

const otherSchema = yup.object({
  referenceNo: yup.string().min(6).required(),
  file: yup.mixed(),
});

type TotherSchema = yup.InferType<typeof otherSchema>;

const postSchema = yup.object({
  positions: yup.array(yup.string()).required("Position is required."),
  Applicants: yup
    .object({
      firstName: yup.string().required("Firstname is required."),
      middleName: yup.string().optional(),
      lastName: yup.string().required("Lastname is required."),
      mobileNo: yup.array(yup.string()).required("Mobile No is required."),
      phoneNo: yup.array(yup.string()).optional(),
      address: yup.array(yup.string()).required("Address is required."),
      degree: yup.string().optional(),
      email: yup.string().email("Invalid email address").required(),
      university: yup.string().optional(),
    })
    .required("Applicants information is required"),
});

type TSchema = yup.InferType<typeof postSchema>;

export default function Home() {
  const [loading, setLoading] = useState<boolean>(false);
  const [agree, setAgree] = useState<boolean>(false);
  const form = useForm<TSchema>({
    validate: yupResolver(postSchema),
    initialValues: {
      Applicants: {
        email: "",
        firstName: "",
        middleName: "",
        lastName: "",
        mobileNo: [""],
        phoneNo: [""],
        address: [""],
        degree: "",
      },
      positions: [""],
    },
  });
  const otherForm = useForm<TotherSchema>({
    validate: yupResolver(otherSchema),
    initialValues: {
      referenceNo: "",
      file: [],
    },
  });

  const openRef = useRef<() => void>(null);
  const [active, setActive] = useState(0);
  const nextStep = () =>
    setActive((current) => (current < 3 ? current + 1 : current));
  const sendEmail = async (recipientEmail: string) => {
    setLoading(true);
    try {
      const sendmail = await post("/api/emails", {
        recipientEmail,
      });
      if (sendmail.status === HttpStatusCode.Accepted) {
        notifications.show({
          title: "Success",
          message: "Successfully send email",
        });
        setLoading(false);
        nextStep();
      }
    } catch {
      setLoading(false);
      notifications.show({
        color: "red",
        title: "Error",
        message: "Invalid Password",
      });
    }
  };

  const FormSubmit = form.onSubmit(async (e) => {
    try {
      const req = await post("/api/applications", e);
      if (req.status === HttpStatusCode.Accepted) {
        console.log(req);
        const form = new FormData();
        // @ts-expect-error req data
        form.append("applicationId", req?.data?.data?.uuid);
        form.append("cvFile", otherForm.values.file[0]);
        const upload = await postForm("/api/applications/upload", form);
        if (upload.status === HttpStatusCode.Accepted) {
          notifications.show({
            title: "Success",
            message: "Successfully send email",
          });
        }
      }
    } catch {
      notifications.show({
        color: "red",
        title: "Error",
        message: "Invalid Password",
      });
    }
  });
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
        <form onSubmit={FormSubmit}>
          {loading ? (
            <Loader color="blue" />
          ) : active === 0 ? (
            <>
              <TextInput
                withAsterisk
                label="Email"
                placeholder="your@email.com"
                {...form.getInputProps("Applicants.email")}
              />
              <Checkbox
                mt="md"
                label="I agree to sell my privacy"
                checked={agree}
                onChange={(event) => setAgree(event.currentTarget.checked)}
              />
              <Group justify="flex-end" mt="md">
                <Button
                  onClick={() => {
                    form.validateField("Applicants.email");
                    if (
                      form.validateField("Applicants.email").hasError === false
                    ) {
                      sendEmail(form.values.Applicants.email);
                    }
                  }}
                  disabled={agree === false}
                >
                  Continue
                </Button>
              </Group>
            </>
          ) : active === 1 ? (
            <>
              <PinInput
                {...otherForm.getInputProps("referenceNo")}
                length={6}
              />
              <Group justify="flex-end" mt="md">
                <Button
                  onClick={async () => {
                    otherForm.validateField("referenceNo");
                    console.log(otherForm.validateField("referenceNo"));
                    if (
                      otherForm.validateField("referenceNo").hasError === false
                    ) {
                      setLoading(true);
                      try {
                        const req = await post("/api/emails/verify", {
                          code: otherForm.values.referenceNo,
                          email: form.values.Applicants.email,
                        });
                        if (req.status === HttpStatusCode.Accepted) {
                          notifications.show({
                            color: "green",
                            title: "Success",
                            message: "tama nag code mo idol",
                          });
                          setLoading(false);
                          nextStep();
                        }
                      } catch {
                        setLoading(false);
                        notifications.show({
                          color: "red",
                          title: "Error",
                          message: "Invalid Password",
                        });
                      }
                    }
                  }}
                >
                  Continue
                </Button>
              </Group>
            </>
          ) : (
            active === 2 && (
              <Grid grow w="40vw">
                <Grid.Col span={4}>
                  <TextInput
                    withAsterisk
                    label="First Name"
                    {...form.getInputProps("Applicants.firstName")}
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <TextInput
                    withAsterisk
                    label="Middle Name"
                    {...form.getInputProps("Applicants.middleName")}
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <TextInput
                    withAsterisk
                    label="Last Name"
                    {...form.getInputProps("Applicants.lastName")}
                  />
                </Grid.Col>
                <Grid.Col span={12}>
                  <TextInput
                    disabled
                    withAsterisk
                    label="Email"
                    {...form.getInputProps("Applicants.email")}
                  />
                </Grid.Col>
                <Grid.Col span={12}>
                  <TextInput
                    withAsterisk
                    label="Address"
                    {...form.getInputProps("Applicants.address.0")}
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <TextInput
                    withAsterisk
                    label="Phone No."
                    {...form.getInputProps("Applicants.mobileNo.0")}
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <TextInput
                    withAsterisk
                    label="Tel No."
                    {...form.getInputProps("Applicants.phoneNo.0")}
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <TextInput
                    withAsterisk
                    label="Degree"
                    {...form.getInputProps("Applicants.degree")}
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <TextInput
                    withAsterisk
                    label="Position"
                    {...form.getInputProps("positions.0")}
                  />
                </Grid.Col>
                <Grid.Col span={12}>
                  <Dropzone
                    openRef={openRef}
                    onDrop={(files) => otherForm.setFieldValue("file", files)}
                  />
                </Grid.Col>
                <Grid.Col span={12}>
                  <Button type="submit" w="100%">
                    Submit
                  </Button>
                </Grid.Col>
              </Grid>
            )
          )}
        </form>
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
