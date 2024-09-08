import React from "react";
import { Box, Container, Heading, Text, Image, Grid } from "@chakra-ui/react";
import { FaDumbbell, FaHeart, FaChartLine } from "react-icons/fa";
import colorfulGif from "../giphy.gif";

const AboutPage = () => {
  return (
    <Box bg="gray.800" py={16}>
      <Container maxW="xl">
        <Box
          bg="white"
          p={8}
          borderRadius="md"
          boxShadow="lg"
          textAlign="center"
          animation="scale-in-center 0.5s"
        >
          <Heading as="h1" size="xl" mb={4} color="black">
            <FaDumbbell /> About Fitness Track
          </Heading>
          <Text fontSize="lg" color="black">
            Fitness Track is a comprehensive fitness tracking app designed to
            help you monitor and improve your physical health and wellness. With
            our app, you can easily track your workouts, set fitness goals,
            monitor your progress, and stay motivated on your fitness journey.
          </Text>
          <Text fontSize="lg" mt={4} color="black">
            Our mission is to empower individuals to lead healthier lives by
            providing them with the tools and insights they need to make
            positive changes. Whether you're a beginner or an advanced fitness
            enthusiast, Fitness Track is here to support you every step of the
            way.
          </Text>

          <Grid templateColumns="repeat(3, 1fr)" gap={6} mt={12} color="black">
            <AdvantageCard
              icon={<FaHeart />}
              title="Health Benefits"
              description="Improve cardiovascular health, boost energy levels, and enhance overall well-being."
            />
            <AdvantageCard
              icon={<FaChartLine />}
              title="Progress Tracking"
              description="Track your fitness progress over time and stay motivated by seeing results."
            />
            <AdvantageCard
              icon={<FaDumbbell />}
              title="Workout Variety"
              description="Access a wide range of workout programs and exercises to keep your routine fresh."
            />
          </Grid>

          <Text fontSize="lg" mt={4}>
            Start your fitness journey with Fitness Track today and take control
            of your health and well-being!
          </Text>
          <Image
            src={colorfulGif}
            alt="Colorful GIF"
            mt={8}
            mx="auto"
            w={200}
          />
        </Box>
      </Container>
    </Box>
  );
};

const AdvantageCard = ({ icon, title, description }) => {
  return (
    <Box
      bg="gray.100"
      p={4}
      borderRadius="md"
      boxShadow="md"
      textAlign="center"
    >
      <Box fontSize="3xl" mb={4}>
        {icon}
      </Box>
      <Heading as="h3" size="md" mb={2}>
        {title}
      </Heading>
      <Text>{description}</Text>
    </Box>
  );
};

export default AboutPage;
