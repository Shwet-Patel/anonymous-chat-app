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
  code: string;
}

export const verificationEmail = ({ name, code }: emailProps) => (
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
          <Text className="text-blue-500 text-xs font-bold uppercase text-center mt-4">
            Verify Your Identity
          </Text>
          <Heading className="text-black text-lg font-medium text-center mt-2 mx-4">
            Enter the following code to finish your verification.
          </Heading>
          <Section className="bg-gray-100 rounded-md w-72 mx-auto my-4 py-2">
            <Text className="text-black text-4xl font-bold tracking-widest text-center">
              {code}
            </Text>
          </Section>
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
            if you did not request this code.
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
