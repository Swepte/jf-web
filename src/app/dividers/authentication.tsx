import { post } from "@/utils/http";
import {
  Flex,
  RingProgress,
  Group,
  Button,
  Text,
  PinInput,
} from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import { useMediaQuery } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconKeyFilled } from "@tabler/icons-react";
import { HttpStatusCode } from "axios";
import { useState } from "react";
import * as yup from "yup";

const postSchema = yup.object({
  authorizationCode: yup.number().required(),
});
type TSchema = yup.InferType<typeof postSchema>;

export default function Authentication({
  email,
  setStepper,
}: {
  email: string;
  setStepper: (step: number) => void;
}) {
  const matches = useMediaQuery("(min-width: 75em)");

  const form = useForm<TSchema>({
    validate: yupResolver(postSchema),
    initialValues: {
      authorizationCode: 0,
    },
  });
  const [loading, setLoading] = useState<boolean>(false);
  const verifyEmail = async (code: number) => {
    setLoading(true);
    try {
      const req = await post("/api/emails/verify", {
        code: code,
        email: email,
      });
      if (req.status === HttpStatusCode.Accepted) {
        notifications.show({
          color: "green",
          title: "Success",
          message: "Authenticated!",
        });
        setStepper(3);
        setLoading(false);
      }
    } catch {
      setLoading(false);
      notifications.show({
        color: "red",
        title: "Error",
        message: "Invalid Authentication Code",
      });
    }
  };

  const formSubmit = form.onSubmit(async () => {
    form.validateField("authorizationCode");
    if (form.validateField("authorizationCode").hasError === false) {
      verifyEmail(form.values.authorizationCode);
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
                  <IconKeyFilled size={24} fill="gray" />
                </Text>
              }
              sections={[{ value: 50, color: "green" }]}
              rootColor="gray"
            />
            <Text
              style={{
                fontSize: "1.3rem",
              }}
            >
              SECOND STEP
            </Text>
          </Flex>
          <Text
            style={{
              fontSize: "2.5rem",
            }}
            fw="bold"
          >
            Email Authentication
          </Text>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              formSubmit();
            }}
          >
            <Text mt={50} mb={20} ta="center">
              Authentication Code
            </Text>
            <PinInput
              length={6}
              radius={10}
              placeholder="○"
              type="number"
              size="xl"
              styles={{
                pinInput: {
                  width: "auto",
                  height: "80px",
                },
                input: {
                  height: matches ? "80px" : "50px",
                  fontSize: matches ? 50 : 30,
                  paddingTop: matches ? 30 : 20,
                  paddingBottom: matches ? 30 : 20,
                },
                root: {
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                },
              }}
              {...form.getInputProps("authorizationCode")}
            />
            <Group justify="flex-end" mt={matches ? "md" : "xs"}>
              <Button
                type="submit"
                radius={10}
                style={{
                  width: "100%",
                }}
                color="black"
                loading={loading}
              >
                Verify Code
              </Button>
            </Group>
          </form>
        </Flex>
      </Flex>
    </>
  );
}
