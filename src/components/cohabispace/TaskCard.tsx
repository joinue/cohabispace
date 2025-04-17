import { useState, useEffect } from 'react';
import { Task } from '../../utils/taskData';
import './TaskCard.css';

interface PartnerNames {
  partner1: string;
  partner2: string;
}

interface TaskCardProps {
  task: Task;
  categoryColor?: string;
  onDifficultyChange?: (taskId: string, difficulty: number) => void;
  onFrequencyChange?: (taskId: string, frequency: string) => void;
  onAssignmentChange?: (taskId: string, assignedTo: string) => void;
  currentAssignment?: string;
  isLoading?: boolean;
  error?: string;
  partnerNames: PartnerNames;
}

// Define frequency types
type FrequencyType = 'daily' | 'every-other-day' | 'weekly' | 'every-other-week' | 'monthly' | 'quarterly' | 'annually' | 'weekends' | 'weekdays' | 'as-needed';

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  categoryColor = '#607D8B',
  onDifficultyChange,
  onFrequencyChange,
  onAssignmentChange,
  currentAssignment = 'unassigned',
  isLoading = false,
  error,
  partnerNames
}) => {
  // Log the category color for debugging
  console.log(`TaskCard: ${task.name} has category color: ${categoryColor}`);
  console.log(`TaskCard: ${task.name} is assigned to: ${currentAssignment}`);
  
  // State for UI elements
  const [showFrequencyMenu, setShowFrequencyMenu] = useState(false);
  const [hoveredDifficulty, setHoveredDifficulty] = useState<number | null>(null);
  
  // State for actual values - initialize from task prop
  const [currentDifficulty, setCurrentDifficulty] = useState(task.difficulty || 3);
  const [currentFrequency, setCurrentFrequency] = useState<FrequencyType>(task.frequency);

  // Update local state when task prop changes
  useEffect(() => {
    console.log(`TaskCard: Task ${task.id} updated - difficulty: ${task.difficulty}, frequency: ${task.frequency}, assignment: ${currentAssignment}`);
    setCurrentDifficulty(task.difficulty || 3);
    setCurrentFrequency(task.frequency);
  }, [task.id, task.difficulty, task.frequency, currentAssignment]);

  const handleDifficultyChange = (difficulty: number) => {
    console.log(`TaskCard: Changing difficulty for task ${task.id} to ${difficulty}`);
    setCurrentDifficulty(difficulty);
    if (onDifficultyChange) {
      onDifficultyChange(task.id, difficulty);
    }
  };

  const handleFrequencySelect = (frequency: FrequencyType) => {
    console.log(`TaskCard: Changing frequency for task ${task.id} to ${frequency}`);
    setCurrentFrequency(frequency);
    if (onFrequencyChange) {
      onFrequencyChange(task.id, frequency);
    }
    setShowFrequencyMenu(false);
  };

  const handleAssignmentChange = (assignedTo: string) => {
    if (onAssignmentChange) {
      onAssignmentChange(task.id, assignedTo);
    }
  };

  const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
      case 1: return '#48bb78'; // green
      case 2: return '#4299e1'; // blue
      case 3: return '#ecc94b'; // yellow
      case 4: return '#ed8936'; // orange
      case 5: return '#f56565'; // red
      default: return '#a0aec0'; // gray
    }
  };

  const getDifficultyLabel = (difficulty: number) => {
    switch (difficulty) {
      case 1: return 'Very Easy';
      case 2: return 'Easy';
      case 3: return 'Medium';
      case 4: return 'Hard';
      case 5: return 'Very Hard';
      default: return 'Not Set';
    }
  };

  // Format frequency for display
  const formatFrequency = (frequency: string) => {
    return frequency.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  // Frequency options sorted by occurrence amount (from most frequent to least frequent)
  const frequencyOptions: FrequencyType[] = [
    'daily',
    'every-other-day',
    'weekdays',
    'weekends',
    'weekly',
    'every-other-week',
    'monthly',
    'quarterly',
    'annually',
    'as-needed'
  ];

  return (
    <div 
      className={`task-card ${isLoading ? 'loading' : ''} ${error ? 'error' : ''} ${currentAssignment !== 'unassigned' ? 'assigned' : ''} category-${task.category}`}
      style={{ borderTopColor: categoryColor } as React.CSSProperties}
      data-partner={currentAssignment}
    >
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <span>Loading...</span>
        </div>
      )}
      
      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}
      
      <div className="task-card-content">
        <div className="task-header">
          <h3 className="task-name">{task.name}</h3>
          <div className="task-meta">
            <span className="assignment-indicator">
              {currentAssignment === 'unassigned' ? 'Unassigned' : 
               currentAssignment === 'Partner 1' ? partnerNames.partner1 :
               currentAssignment === 'Partner 2' ? partnerNames.partner2 :
               currentAssignment}
            </span>
          </div>
        </div>
        
        <div className="task-details">
          <p className="description">{task.description}</p>
          
          <div className="task-frequency">
            <label>Frequency</label>
            <div 
              className={`task-frequency-select ${showFrequencyMenu ? 'hovered' : ''}`}
              onClick={() => setShowFrequencyMenu(!showFrequencyMenu)}
            >
              <span>{formatFrequency(currentFrequency)}</span>
              <span className="task-frequency-arrow">▼</span>
            </div>
            
            {showFrequencyMenu && (
              <div className="task-frequency-menu">
                {frequencyOptions.map((freq) => (
                  <button
                    key={freq}
                    className={`task-frequency-item ${currentFrequency === freq ? 'selected' : ''}`}
                    onClick={() => handleFrequencySelect(freq)}
                  >
                    {formatFrequency(freq)}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div className="difficulty-section">
            <label>Difficulty Level</label>
            <div className="difficulty-stars">
              {[1, 2, 3, 4, 5].map((level) => (
                <button
                  key={level}
                  className={`star ${currentDifficulty >= level ? 'active' : ''}`}
                  onClick={() => handleDifficultyChange(level)}
                  onMouseEnter={() => setHoveredDifficulty(level)}
                  onMouseLeave={() => setHoveredDifficulty(null)}
                  style={{ 
                    color: hoveredDifficulty !== null 
                      ? (level <= hoveredDifficulty ? getDifficultyColor(hoveredDifficulty) : '#ddd')
                      : (currentDifficulty >= level ? getDifficultyColor(currentDifficulty) : '#ddd')
                  }}
                  title={getDifficultyLabel(level)}
                >
                  ★
                </button>
              ))}
              <span className="difficulty-label">
                {hoveredDifficulty !== null 
                  ? getDifficultyLabel(hoveredDifficulty)
                  : getDifficultyLabel(currentDifficulty)
                }
              </span>
            </div>
          </div>
          
          <div className="assignment-section">
            <div className="assignment-buttons">
              <div className="assign-button-container">
                <button
                  className={`assign-button ${currentAssignment === 'Partner 1' ? 'assigned' : ''}`}
                  onClick={() => handleAssignmentChange('Partner 1')}
                  disabled={currentAssignment === 'Partner 1'}
                >
                  <span className="partner-icon">👤</span>
                  <span className="partner-name">{partnerNames.partner1}</span>
                </button>
                {currentAssignment === 'Partner 1' && (
                  <button 
                    className="unassign-button"
                    onClick={() => handleAssignmentChange('unassigned')}
                    title={`Unassign ${partnerNames.partner1}`}
                  >
                    ✕
                  </button>
                )}
              </div>
              <div className="assign-button-container">
                <button
                  className={`assign-button ${currentAssignment === 'Partner 2' ? 'assigned' : ''}`}
                  onClick={() => handleAssignmentChange('Partner 2')}
                  disabled={currentAssignment === 'Partner 2'}
                >
                  <span className="partner-icon">👤</span>
                  <span className="partner-name">{partnerNames.partner2}</span>
                </button>
                {currentAssignment === 'Partner 2' && (
                  <button 
                    className="unassign-button"
                    onClick={() => handleAssignmentChange('unassigned')}
                    title={`Unassign ${partnerNames.partner2}`}
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard; 