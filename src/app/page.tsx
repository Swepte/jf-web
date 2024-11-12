"use client";
import { Flex, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useState } from "react";
import Authentication from "./dividers/authentication";
import Verification from "./dividers/verification";
import Registration from "./dividers/registration";
import Image from "next/image";
import * as _ from "lodash";

export default function Home() {
  const matches = useMediaQuery("(min-width: 75em)");
  const [email, setEmail] = useState("");
  const [step, setStepper] = useState(1);
  return (
    <>
      <Flex
        h={"100vh"}
        w={"100vw"}
        pos="relative"
        align="center"
        justify="center"
        direction="row"
      >
        <Flex
          style={{
            background:
              "linear-gradient(18deg, rgba(255,255,255,1) 0%, rgba(220,227,237,1) 100%)",
            width: matches ? "50vw" : "100vw",
            height: "100vh",
          }}
          direction="column"
        >
          <Flex ml={20} my={20} align="center">
            <Image
              src={process.env.NEXT_PUBLIC_LOGO_URL as string}
              alt="Cryptex logo"
              width={60}
              height={60}
            />
            <Text fw="bold" ml={15}>
              Cryptex Consulting Services Ltd, Co.
            </Text>
          </Flex>
          {step === 2 && !_.isEmpty(email) ? (
            <Authentication email={email} setStepper={setStepper} />
          ) : step === 3 && !_.isEmpty(email) ? (
            <Registration email={email} setStepper={setStepper} />
          ) : (
            <Verification setEmail={setEmail} setStepper={setStepper} />
          )}
        </Flex>
        {matches && (
          <Flex
            style={{
              background: "white",
              width: "50vw",
              height: "100vh",
              filter: "brightness(65%)",
            }}
          >
            <video
              autoPlay
              muted
              loop
              playsInline
              className="-z-10 absolute object-cover w-full h-full"
            >
              <source src={process.env.NEXT_PUBLIC_VIDEO_URL || undefined} />
            </video>
          </Flex>
        )}
      </Flex>
    </>
  );
}
