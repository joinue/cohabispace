import {
  ListItem,
  Flex,
  HStack,
  VStack,
  Text,
  IconButton,
  Badge,
} from '@chakra-ui/react';
import { DeleteIcon, CheckIcon } from '@chakra-ui/icons';

interface TaskItemProps {
  task: {
    id: string;
    title: string;
    completed: boolean;
    assignedTo: string;
    priority: string;
    createdAt: Date;
  };
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'red';
      case 'medium':
        return 'orange';
      case 'low':
        return 'green';
      default:
        return 'gray';
    }
  };

  return (
    <ListItem
      p={4}
      borderWidth={1}
      borderRadius="md"
      bg={task.completed ? 'gray.50' : 'white'}
    >
      <Flex justify="space-between" align="center">
        <HStack>
          <IconButton
            aria-label="Toggle task completion"
            icon={<CheckIcon />}
            size="sm"
            colorScheme={task.completed ? 'green' : 'gray'}
            onClick={() => onToggle(task.id)}
          />
          <VStack align="start" spacing={1}>
            <Text
              textDecoration={task.completed ? 'line-through' : 'none'}
              color={task.completed ? 'gray.500' : 'black'}
            >
              {task.title}
            </Text>
            <HStack>
              <Badge colorScheme="purple">{task.assignedTo}</Badge>
              <Badge colorScheme={getPriorityColor(task.priority)}>
                {task.priority}
              </Badge>
              <Text fontSize="xs" color="gray.500">
                {task.createdAt.toLocaleDateString()}
              </Text>
            </HStack>
          </VStack>
        </HStack>
        <IconButton
          aria-label="Delete task"
          icon={<DeleteIcon />}
          size="sm"
          colorScheme="red"
          variant="ghost"
          onClick={() => onDelete(task.id)}
        />
      </Flex>
    </ListItem>
  );
} 