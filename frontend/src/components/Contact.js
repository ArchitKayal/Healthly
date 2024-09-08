import React from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  Input,
  Textarea,
  Button,
  useColorMode,
} from "@chakra-ui/react";

const ContactPage = () => {
  const { colorMode } = useColorMode();

  return (
    <Box bg={colorMode === "light" ? "gray.200" : "gray.700"} py={16}>
      <Container maxW="xl">
        <Box
          bg={colorMode === "light" ? "white" : "gray.800"}
          p={8}
          borderRadius="md"
          boxShadow="lg"
          textAlign="center"
          animation="scale-in-center 0.5s"
        >
          <Heading
            as="h1"
            size="xl"
            mb={4}
            color={colorMode === "light" ? "black" : "white"}
          >
            Contact Us
          </Heading>
          <Text
            fontSize="lg"
            color={colorMode === "light" ? "gray.600" : "gray.400"}
          >
            We'd love to hear from you! Please fill out the form below to get in
            touch with us.
          </Text>
          <Box mt={8}>
            <form>
              <Box mb={4}>
                <Input
                  type="text"
                  placeholder="Your Name"
                  bg={colorMode === "light" ? "white" : "gray.700"}
                  color={colorMode === "light" ? "black" : "white"}
                />
              </Box>
              <Box mb={4}>
                <Input
                  type="email"
                  placeholder="Your Email"
                  bg={colorMode === "light" ? "white" : "gray.700"}
                  color={colorMode === "light" ? "black" : "white"}
                />
              </Box>
              <Box mb={4}>
                <Textarea
                  placeholder="Your Message"
                  rows={5}
                  bg={colorMode === "light" ? "white" : "gray.700"}
                  color={colorMode === "light" ? "black" : "white"}
                />
              </Box>
              <Button
                colorScheme={colorMode === "light" ? "blue" : "teal"}
                type="submit"
                _hover={{ bg: colorMode === "light" ? "blue.500" : "teal.600" }}
              >
                Send Message
              </Button>
            </form>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default ContactPage;
