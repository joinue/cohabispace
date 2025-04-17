import { Category, Task } from '../../utils/taskData';
import TaskCard from './TaskCard';
import './TaskCategory.css';
import { useEffect } from 'react';

interface PartnerNames {
  partner1: string;
  partner2: string;
}

interface TaskCategoryProps {
  category: Category;
  updatedTasks: Task[];
  assignments: { taskId: string; assignedTo: string }[];
  onAssignmentChange: (taskId: string, assignedTo: string) => void;
  onDifficultyChange?: (taskId: string, difficulty: number) => void;
  onFrequencyChange?: (taskId: string, frequency: string) => void;
  partnerNames: PartnerNames;
}

export default function TaskCategory({ 
  category, 
  updatedTasks,
  assignments, 
  onAssignmentChange,
  onDifficultyChange,
  onFrequencyChange,
  partnerNames
}: TaskCategoryProps) {
  const getAssignmentForTask = (taskId: string) => {
    const assignment = assignments.find(a => a.taskId === taskId);
    const assignedTo = assignment ? assignment.assignedTo : 'unassigned';
    console.log(`TaskCategory: Task ${taskId} is assigned to ${assignedTo}`);
    return assignedTo;
  };

  // Get category color based on category ID or use a default color
  const getCategoryColor = (categoryId: string) => {
    const colorMap: Record<string, string> = {
      'habitat': '#4CAF50', // Green
      'orbit': '#2196F3', // Blue
      'care': '#9C27B0', // Purple
      'spark': '#FF9800', // Orange
      'thrive': '#E91E63', // Pink
      'storms': '#607D8B', // Gray
      'default': '#607D8B' // Default gray
    };
    
    const color = colorMap[categoryId] || colorMap.default;
    console.log(`TaskCategory: Category ${categoryId} has color: ${color}`);
    return color;
  };

  // Log assignments for debugging
  useEffect(() => {
    console.log(`TaskCategory: Received assignments:`, assignments);
    console.log(`TaskCategory: Updated tasks:`, updatedTasks);
  }, [assignments, updatedTasks]);

  return (
    <div className="task-category">
      <h3 className="category-title">{category.name}</h3>
      <p className="category-description">{category.description}</p>
      
      <div className="tasks-list">
        {updatedTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            categoryColor={getCategoryColor(category.id)}
            currentAssignment={getAssignmentForTask(task.id)}
            onAssignmentChange={onAssignmentChange}
            onDifficultyChange={onDifficultyChange}
            onFrequencyChange={onFrequencyChange}
            partnerNames={partnerNames}
          />
        ))}
      </div>
    </div>
  );
} 