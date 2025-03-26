import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";
import * as React from "react";

interface emailProps {
  name: string;
  url: string;
}

export const verificationEmail = ({ name, url }: emailProps) => (
  <Html>
    <Head />
    <Body className="bg-white font-sans">
      <Tailwind>
        <Container className="bg-white border border-gray-200 rounded-lg shadow-lg mt-5 max-w-sm mx-auto p-10">
          <h3 className="text-center font-semibold text-3xl my-8">
            Hi, {name}
          </h3>
          <h3 className="text-center font-semibold text-xl mb-4 ">
            Welcome to
          </h3>
          <div className=" mb-12 py-8 text-center bg-sky-950 text-white ">
            <h1 className="font-bold text-4xl">True Feedback</h1>
          </div>
          <Heading className="text-black text-lg font-medium text-center mt-2 mx-4">
            Here is your anonymous feedback URL.
          </Heading>
          <Section className="bg-gray-100 rounded-md w-72 mx-auto my-4 py-2">
            <Link
              href="/"
              className="text-black text-base font-semibold flex place-self-center p-2"
            >
              {url}
            </Link>
          </Section>
          <Text className="text-gray-700 text-sm font-semibold text-center px-10 mt-4">
            Share it with anyone. so that they can use this link to give you
            feedback.
          </Text>
          <Text className="text-gray-700 text-sm text-center px-10 mt-4">
            Not expecting this email?
          </Text>
          <Text className="text-gray-700 text-sm text-center px-10">
            Contact
            <Link
              href="mailto:support@truefeedback.com"
              className="text-gray-700 underline mx-1"
            >
              support@truefeedback.com
            </Link>
            if you did not expect this email.
          </Text>
        </Container>
        <Text className="text-black text-xs font-bold text-center mt-5">
          Securely powered by Shwet.
        </Text>
      </Tailwind>
    </Body>
  </Html>
);

export default verificationEmail;
