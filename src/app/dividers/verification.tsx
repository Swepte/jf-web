import { post } from "@/utils/http";
import {
  Flex,
  RingProgress,
  TextInput,
  Group,
  Button,
  Text,
} from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import { useMediaQuery } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconMailFilled } from "@tabler/icons-react";
import { HttpStatusCode } from "axios";
import { useState } from "react";
import * as yup from "yup";

const postSchema = yup.object({
  email: yup.string().email("Invalid email address").required(),
});
type TSchema = yup.InferType<typeof postSchema>;

export default function Verification({
  setEmail,
  setStepper,
}: {
  setEmail: (email: string) => void;
  setStepper: (step: number) => void;
}) {
  const matches = useMediaQuery("(min-width: 75em)");
  const form = useForm<TSchema>({
    validate: yupResolver(postSchema),
    initialValues: {
      email: "",
    },
  });
  const [loading, setLoading] = useState<boolean>(false);
  const sendEmail = async (recipientEmail: string) => {
    setLoading(true);
    try {
      const sendmail = await post("/api/emails", {
        recipientEmail,
      });
      if (sendmail.status === HttpStatusCode.Accepted) {
        notifications.show({
          color: "green",
          title: "Success",
          message: "Email sent!",
        });
        setLoading(false);
        setStepper(2);
        setEmail(form.values.email);
      }
    } catch {
      setLoading(false);
      notifications.show({
        color: "red",
        title: "Error",
        message: "There's a problem",
      });
    }
  };

  const formSubmit = form.onSubmit(async () => {
    form.validateField("email");
    if (form.validateField("email").hasError === false) {
      sendEmail(form.values.email);
    }
  });

  return (
    <>
      <Flex
        style={{
          width: matches ? "50vw" : "100vw",
          height: "80vh",
        }}
        p={matches ? 100 : 30}
      >
        <Flex
          style={{
            width: "100%",
            height: "100%",
          }}
          direction="column"
        >
          <Flex direction="row" align="center">
            <RingProgress
              size={70}
              thickness={8}
              label={
                <Text
                  size="md"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    pointerEvents: "none",
                    height: "100%",
                  }}
                >
                  <IconMailFilled size={24} fill="gray" />
                </Text>
              }
              sections={[{ value: 25, color: "green" }]}
              rootColor="gray"
            />
            <Text
              style={{
                fontSize: "1.3rem",
              }}
            >
              FIRST STEP
            </Text>
          </Flex>
          <Text
            style={{
              fontSize: "2.5rem",
            }}
            fw="bold"
          >
            Email Verification
          </Text>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              formSubmit();
            }}
          >
            <TextInput
              mt={50}
              label="Email Address"
              placeholder="your-email@domain.com"
              radius={10}
              styles={{
                input: {
                  fontSize: matches ? 30 : 20,
                  paddingTop: matches ? 30 : 25,
                  paddingBottom: matches ? 30 : 25,
                },
              }}
              {...form.getInputProps("email")}
            />
            <Group justify="flex-end" mt="md">
              <Button
                onClick={() => formSubmit()}
                radius={10}
                style={{
                  width: "100%",
                }}
                color="black"
                loading={loading}
                disabled={form.values.email.length <= 0}
              >
                Send Code
              </Button>
            </Group>
          </form>
        </Flex>
      </Flex>
    </>
  );
}
