import { useState } from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';

interface TaskFormProps {
  onAddTask: (task: {
    title: string;
    assignedTo: string;
    priority: string;
  }) => void;
}

export default function TaskForm({ onAddTask }: TaskFormProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [title, setTitle] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [priority, setPriority] = useState('medium');
  const toast = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: 'Error',
        description: 'Task title is required',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    onAddTask({
      title,
      assignedTo: assignedTo || 'Unassigned',
      priority,
    });

    // Reset form
    setTitle('');
    setAssignedTo('');
    setPriority('medium');
    onClose();

    toast({
      title: 'Task added',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <>
      <Button colorScheme="blue" onClick={onOpen}>
        Add New Task
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleSubmit}>
            <ModalHeader>Add New Task</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Task Title</FormLabel>
                  <Input
                    placeholder="Enter task title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Assign To</FormLabel>
                  <Select
                    placeholder="Select assignee"
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                  >
                    <option value="Partner 1">Partner 1</option>
                    <option value="Partner 2">Partner 2</option>
                    <option value="Both">Both</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Priority</FormLabel>
                  <Select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </Select>
                </FormControl>
              </VStack>
            </ModalBody>

            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="blue" type="submit">
                Add Task
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
} 