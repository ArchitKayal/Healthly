import React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { BarChart, Bar } from "recharts";

const ActivityCard = ({ result, glucose }) => {
  return (
    <Box
      p={4}
      bg="white"
      borderRadius="lg"
      boxShadow="md"
      mx="auto"
      h="100%"
      w="100%"
    >
      <Text fontSize="xl" fontWeight="bold" mb={4} color="black">
        Activity
      </Text>
      <Flex justify="space-between">
        <Box p={4} bg="gray.100" borderRadius="md" flex="1" mr={4}>
          <Text fontSize="lg" fontWeight="bold" mb={2} color="black">
            Step Count
          </Text>
          <ResponsiveContainer width="100%" aspect={3}>
            <BarChart data={result}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar
                type="monotone"
                dataKey="step_count"
                stroke="#8884d8"
                strokeWidth={2}
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>

        <Box p={4} bg="gray.100" borderRadius="md" flex="1" ml={4}>
          <Text fontSize="lg" fontWeight="bold" mb={2} color="black">
            Glucose Level
          </Text>
          <ResponsiveContainer width="100%" aspect={3}>
            <LineChart data={glucose}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="glucose_level"
                stroke="#82ca9d"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Flex>
    </Box>
  );
};

export default ActivityCard;
