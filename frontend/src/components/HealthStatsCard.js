import React from "react";
import {
  Box,
  Flex,
  Text,
  Stat,
  StatNumber,
  Icon,
  useToken,
} from "@chakra-ui/react";
import {
  GiBodyHeight,
  GiWeight,
  GiHeartBeats,
  GiRunningShoe,
} from "react-icons/gi";
import { FaHeartbeat } from "react-icons/fa";

import { motion } from "framer-motion";

const AnimatedBox = motion(Box);

const HealthStatsCard = ({ weight, height, BP, step, heart }) => {
  const [bgColor] = useToken("colors", ["blue.500"]);

  const cardVariants = {
    initial: { opacity: 0, scale: 0.5 },
    animate: { opacity: 1, scale: 1 },
  };
  const decimalheight = height;
  const minimizedheight = Math.floor(decimalheight);

  const number = step;
  const formattedNumber = number?.toLocaleString();
  return (
    <Flex justify="center" align="center" gap={4} py={2} m={2}>
      <AnimatedBox
        as="button"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        variants={cardVariants}
        initial="initial"
        animate="animate"
        transition={{ duration: 0.3 }}
        width="250px"
        p={4}
        shadow="md"
        borderWidth="2px"
        borderRadius="xl"
        bg={bgColor}
        display="flex"
        alignItems="center"
        flexDirection="column"
      >
        <Icon as={GiBodyHeight} boxSize={8} color="white" mb={4} />
        <Text fontSize="lg" fontWeight="bold" color="white" mb={2}>
          Height
        </Text>
        <Stat>
          <StatNumber color="white">{minimizedheight} cm</StatNumber>
        </Stat>
      </AnimatedBox>

      <AnimatedBox
        as="button"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        variants={cardVariants}
        initial="initial"
        animate="animate"
        transition={{ duration: 0.3 }}
        width="250px"
        p={4}
        shadow="md"
        borderWidth="2px"
        borderRadius="xl"
        bg="green.500"
        display="flex"
        alignItems="center"
        flexDirection="column"
      >
        <Icon as={GiWeight} boxSize={8} color="white" mb={4} />
        <Text fontSize="lg" fontWeight="bold" color="white" mb={2}>
          Weight
        </Text>
        <Stat>
          <StatNumber color="white">{parseInt(weight, 10)} kg</StatNumber>
        </Stat>
      </AnimatedBox>

      <AnimatedBox
        as="button"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        variants={cardVariants}
        initial="initial"
        animate="animate"
        transition={{ duration: 0.3 }}
        width="250px"
        p={4}
        shadow="md"
        borderWidth="2px"
        borderRadius="xl"
        bg="red.500"
        display="flex"
        alignItems="center"
        flexDirection="column"
      >
        <Icon as={FaHeartbeat} boxSize={8} color="white" mb={4} />
        <Text fontSize="lg" fontWeight="bold" color="white" mb={2}>
          Blood Pressure
        </Text>
        <Stat>
          {/* //120/80 */}
          <StatNumber color="white">
            {/* {
            BP[0]? JSON.stringify(BP[0] + "/" + BP[1]) : 120/80
            } */}
          </StatNumber>
        </Stat>
      </AnimatedBox>
      <AnimatedBox
        as="button"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        variants={cardVariants}
        initial="initial"
        animate="animate"
        transition={{ duration: 0.3 }}
        width="250px"
        p={4}
        shadow="md"
        borderWidth="2px"
        borderRadius="xl"
        bg="pink.500"
        display="flex"
        alignItems="center"
        flexDirection="column"
      >
        <Icon as={GiRunningShoe} boxSize={8} color="white" mb={4} />
        <Text fontSize="lg" fontWeight="bold" color="white" mb={2}>
          Step Count{" "}
        </Text>
        <Stat>
          <StatNumber color="white">{formattedNumber}</StatNumber>
        </Stat>
      </AnimatedBox>
      <Flex justify="center" align="center" gap={4}>
        <AnimatedBox
          as="button"
          whileHover={{ scale: 1.05, boxShadow: "2xl" }}
          whileTap={{ scale: 0.95 }}
          variants={cardVariants}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.3 }}
          width="250px"
          p={4}
          shadow="md"
          borderWidth="2px"
          borderRadius="xl"
          bg={bgColor}
          display="flex"
          alignItems="center"
          flexDirection="column"
        >
          <Icon as={GiHeartBeats} boxSize={8} color="white" mb={4} />
          <Text fontSize="lg" fontWeight="bold" color="white" mb={2}>
            Heart Rate
          </Text>
          <Stat>
            <StatNumber color="white">{heart} bpm</StatNumber>
          </Stat>
        </AnimatedBox>
      </Flex>
    </Flex>
  );
};

export default HealthStatsCard;
