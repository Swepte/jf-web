import {
  Flex,
  RingProgress,
  TextInput,
  Button,
  Text,
  Grid,
  FileInput,
  ComboboxData,
  MultiSelect,
  Modal,
} from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { IconConfetti, IconListCheck } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import * as yup from "yup";
import { get, post, postForm } from "@/utils/http";
import { HttpStatusCode } from "axios";
import { notifications } from "@mantine/notifications";
import _ from "lodash";
import Image from "next/image";

const otherSchema = yup.object({
  referenceNo: yup.string().min(6).required(),
  cvFile: yup.mixed().required(),
  otherFile: yup.mixed(),
});

const postSchema = yup.object({
  positions: yup.array(yup.string()).required("Position is required."),
  Applicants: yup
    .object({
      firstName: yup.string().required("Firstname is required."),
      middleName: yup.string().optional(),
      lastName: yup.string().required("Lastname is required."),
      mobileNo: yup.string().max(12).required("Mobile No is required."),
      phoneNo: yup.string().optional(),
      address: yup.string().required("Address is required."),
      degree: yup.string().optional(),
      email: yup.string().email("Invalid email address").required(),
      university: yup.string().optional(),
    })
    .required("Applicants information is required"),
});

type TSchema = yup.InferType<typeof postSchema>;
type TotherSchema = yup.InferType<typeof otherSchema>;
interface Position {
  uuid: string;
  department: string;
  value: string;
}

export default function Registration({
  email,
  setStepper,
}: {
  email: string;
  setStepper: (step: number) => void;
}) {
  const matches = useMediaQuery("(min-width: 75em)");
  const [opened, { open, close }] = useDisclosure(false);
  const form = useForm<TSchema>({
    validate: yupResolver(postSchema),
    initialValues: {
      Applicants: {
        email: email,
        firstName: "",
        middleName: "",
        lastName: "",
        mobileNo: "",
        phoneNo: "",
        address: "",
        degree: "",
      },
      positions: [],
    },
  });
  const otherForm = useForm<TotherSchema>({
    validate: yupResolver(otherSchema),
    initialValues: {
      referenceNo: "",
      cvFile: [],
    },
  });

  const [loading, setLoading] = useState<boolean>(false);

  const formSubmit = form.onSubmit(async (e) => {
    try {
      setLoading(true);
      const req = await post("/api/applications", {
        ...e,
        Applicants: {
          ...e.Applicants,
          mobileNo: [e.Applicants.mobileNo],
          phoneNo: [e.Applicants.phoneNo],
          address: [e.Applicants.address],
        },
      });
      if (req.status === HttpStatusCode.Accepted) {
        const form = new FormData();
        // @ts-expect-error req data
        form.append("applicationId", req?.data?.data?.uuid);
        form.append("cvFile", otherForm.values.cvFile as File);
        otherForm.values.otherFile
          ? form.append("otherFile", otherForm?.values?.otherFile)
          : undefined;
        console.log(form);
        const upload = await postForm("/api/applications/upload", form);
        if (upload.status === HttpStatusCode.Accepted) {
          notifications.show({
            color: 'green',
            title: "Success",
            message: "Application Successful!",
          });
          setLoading(false);
          open();
        }
      }
    } catch {
      setLoading(false);
      notifications.show({
        color: "red",
        title: "Error",
        message: "There's a problem",
      });
    }
  });

  const positions = async (): Promise<ComboboxData | undefined> => {
    try {
      const x = await get("/api/positions");

      const z = _.uniqBy(x.data.data as Position[], "department").map((v) => {
        return {
          group: v.department.replace("_", " "),
          items: _.filter(x.data.data, { department: v.department }),
        };
      });

      return z as ComboboxData;
    } catch {
      notifications.show({
        color: "red",
        title: "Error",
        message: "There's an error retrieving the positions.",
      });
    }
  };

  const [getPositions, setPositions] = useState<ComboboxData | undefined>(
    undefined
  );

  // Fetch positions when the component mounts
  useEffect(() => {
    const fetchPositions = async () => {
      const fetchedData = await positions();
      setPositions(fetchedData);
    };

    fetchPositions();
  }, []);

  return (
    <>
      <Flex
        style={{
          width: matches ? "50vw" : "100vw",
          height: "80vh",
        }}
      >
        <Flex
          style={{
            width: "100%",
            height: "100%",
          }}
          direction="column"
        >
          <Flex direction="row" align="center" pl={20}>
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
                  <IconListCheck size={24} fill="gray" />
                </Text>
              }
              sections={[{ value: 75, color: "green" }]}
              rootColor="gray"
            />
            <Text
              style={{
                fontSize: "1.3rem",
              }}
              fw="bold"
            >
              Job Registration
            </Text>
          </Flex>
          <Modal
            centered
            opened={opened}
            onClose={() => window.location.replace("https://cryptex.ph/")}
            title={
              <Flex align="center">
                <Image
                  src={process.env.NEXT_PUBLIC_LOGO_URL as string}
                  alt="Cryptex logo"
                  width={30}
                  height={30}
                  style={{
                    marginRight: 10,
                  }}
                />
                Cryptex Consulting Services Ltd, Co.
              </Flex>
            }
          >
            <Flex direction="column" justify="center" align="center" my={40}>
              <IconConfetti size={70} style={{ marginBottom: 20 }} />
              <Text ta="center" size="sm">
                Thank you for submitting your application! Our team has
                successfully received it, and we'll be in touch with updates as
                soon as we've reviewed everything. We appreciate your interest!
              </Text>
              <Button
                color="black"
                mt={30}
                w={100}
                onClick={() => window.location.replace("https://cryptex.ph/")}
              >
                EXIT
              </Button>
            </Flex>
          </Modal>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              formSubmit();
            }}
          >
            <Grid grow p={10} px={30}>
              <Grid.Col span={4}>
                <TextInput
                  withAsterisk
                  label={matches ? "First Name" : "F.N"}
                  {...form.getInputProps("Applicants.firstName")}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <TextInput
                  label={matches ? "Middle name" : "M.I"}
                  {...form.getInputProps("Applicants.middleName")}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <TextInput
                  withAsterisk
                  label={matches ? "Last Name" : "L.N"}
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
                  {...form.getInputProps("Applicants.address")}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <TextInput
                  withAsterisk
                  maxLength={12}
                  minLength={11}
                  label="Mobile No."
                  {...form.getInputProps("Applicants.mobileNo")}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <TextInput
                  label="Tel No."
                  {...form.getInputProps("Applicants.phoneNo")}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <TextInput
                  label="Degree"
                  {...form.getInputProps("Applicants.degree")}
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <MultiSelect
                  withAsterisk
                  label="Position"
                  data={getPositions}
                  {...form.getInputProps("positions")}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <FileInput
                  withAsterisk
                  accept="application/pdf"
                  label="CV File Upload"
                  {...otherForm.getInputProps("cvFile")}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <FileInput
                  label="Other File Upload"
                  {...otherForm.getInputProps("otherFile")}
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <Button type="submit" loading={loading} w="100%" color="black">
                  Submit
                </Button>
              </Grid.Col>
            </Grid>
          </form>
        </Flex>
      </Flex>
    </>
  );
}
