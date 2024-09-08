import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Flex,
  Button,
  Image,
  Avatar,
  Text,
  useColorMode,
  Stack,
  Link,
} from "@chakra-ui/react";
import Logo from "../fitness.png";
import { useNavigate } from "react-router-dom";
import HealthStatsCard from "./HealthStatsCard";
import ActivityCard from "./ActivityCard";
import FatGraph from "./FatGraph";
import Loading from "./Loader";

const Dashboard = () => {
  const [fitnessData, setFitnessData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { colorMode, toggleColorMode } = useColorMode();

  useEffect(() => {
    setIsLoading(true);
    axios.get("http://localhost:8000/fetch-data")
      .then((response) => {
        setFitnessData(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      });
  }, []);

  const handleLogout = () => {
    navigate("/");
  };

  if (isLoading) {
    return <Loading />;
  }

  // Compute maximum values
  const maxWeight = fitnessData?.formattedData.reduce(
    (max, item) => (item.weight > max ? item.weight : max),
    0
  );
  const maxHeight = fitnessData?.formattedData.reduce(
    (max, item) => (item.height_in_cms > max ? item.height_in_cms : max),
    0
  );

  let maxBPArray = [];

  fitnessData?.formattedData.forEach((item) => {
    const itemMaxBP = Math.max(...item.blood_pressure);
    if (itemMaxBP > Math.max(...maxBPArray)) {
      maxBPArray = item.blood_pressure;
    }
  });

  const StepCount = fitnessData?.formattedData.reduce(
    (max, item) => (item.step_count > max ? item.step_count : max),
    0
  );
  const heartrate = fitnessData?.formattedData.reduce(
    (max, item) => (item.heart_rate > max ? item.heart_rate : max),
    0
  );

  return (
    <Box>
      {/* Header */}
      <Box
        bg={colorMode === "light" ? "teal.500" : "pink.800"}
        px={4}
        py={2}
        color="white"
      >
        <Flex align="center" justify="space-between">
          <Flex align="center">
            <Image
              src={Logo}
              alt="Fitness Tracker Logo"
              width="40px"
              mr={3}
            />
            <Text fontSize="xl" fontWeight="bold">
              Fitness Tracker
            </Text>
          </Flex>
          <Flex align="center">
            <Avatar
              size="sm"
              name="John Doe"
              src={fitnessData?.profilePhoto}
              mr={2}
            />
            <Text fontWeight="bold">{fitnessData?.userName}</Text>
            <Button
              colorScheme={colorMode === "light" ? "white" : "blue"}
              variant="outline"
              size="sm"
              ml={4}
              onClick={handleLogout}
            >
              Logout
            </Button>
            <Button
              colorScheme={colorMode === "light" ? "white" : "blue"}
              variant="outline"
              size="sm"
              ml={4}
              onClick={toggleColorMode}
            >
              Toggle {colorMode === "light" ? "Dark" : "Light"} Mode
            </Button>
          </Flex>
        </Flex>
      </Box>

      {/* Main Content */}
      <Flex>
        {/* Sidebar */}
        <Box
          w="20%"
          h="110vh"
          p={4}
          bg={colorMode === "light" ? "gray.100" : "gray.700"}
        >
          <Stack spacing={7}>
            <Link
              href="#"
              color={colorMode === "light" ? "teal.500" : "white"}
              fontWeight="bold"
              _hover={{ textDecoration: "none" }}
              _focus={{ outline: "none" }}
              as="a"
              _notLast={{ mb: 2 }}
            >
              Home
            </Link>
            <Link
              href="#"
              color={colorMode === "light" ? "teal.500" : "white"}
              fontWeight="bold"
              _hover={{ textDecoration: "none" }}
              _focus={{ outline: "none" }}
              as="a"
              _notLast={{ mb: 2 }}
            >
              About Us
            </Link>
            <Link
              href="#"
              color={colorMode === "light" ? "teal.500" : "white"}
              fontWeight="bold"
              _hover={{ textDecoration: "none" }}
              _focus={{ outline: "none" }}
              as="a"
              _notLast={{ mb: 2 }}
            >
              Contacts
            </Link>
            <Link
              href="#"
              color={colorMode === "light" ? "teal.500" : "white"}
              fontWeight="bold"
              _hover={{ textDecoration: "none" }}
              _focus={{ outline: "none" }}
              as="a"
              _notLast={{ mb: 2 }}
            >
              Services
            </Link>
          </Stack>
        </Box>
        
        {/* Main Content */}
        <Flex direction="column" w="80%" p={4}>
          <Stack spacing={4}>
            {/* Health Stats Card */}
            <HealthStatsCard
              weight={maxWeight}
              height={maxHeight}
              BP={maxBPArray}
              step={StepCount}
              heart={heartrate}
            />
            {/* Activity Card */}
            <ActivityCard
              result={fitnessData?.formattedData.map(({ date, step_count }) => {
                const trimmeddate = date.substr(0, 3);
                return { date: trimmeddate, step_count };
              })}
              glucose={fitnessData?.formattedData.map((item) => ({
                glucose_level: item.glucose_level,
              }))}
            />
            {/* Fat Graph */}
            <FatGraph
              fat={fitnessData?.formattedData.map((item) => ({
                body_fat_in_percent: item.body_fat_in_percent,
              }))}
            />
          </Stack>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Dashboard;