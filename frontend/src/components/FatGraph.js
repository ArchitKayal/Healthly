import React from "react";
import { Box, Text } from "@chakra-ui/react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const FatGraph = ({ fat }) => {
  return (
    <Box bg="white" border="1px solid #E2E8F0" borderRadius="md">
      <Text fontSize="lg" fontWeight="bold" mb={4} p={4} color="black">
        Body Fat
      </Text>
      <ResponsiveContainer width="100%" height={265}>
        <AreaChart data={fat}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="body_fat_in_percent"
            stroke="#8884d8"
            fill="#8884d8"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default FatGraph;
