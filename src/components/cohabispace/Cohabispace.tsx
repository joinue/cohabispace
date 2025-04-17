import { useState, useEffect } from 'react';
import { Task, fairPlayCategories, Frequency } from '../../utils/taskData';
import TaskCategory from './TaskCategory';
import { Link } from 'react-router-dom';
import './Cohabispace.css';
import { FaCog, FaSave, FaFileExport } from 'react-icons/fa';

interface Assignment {
  taskId: string;
  assignedTo: string;
}

interface TaskModification {
  id: string;
  difficulty?: number;
  frequency?: Frequency;
}

interface LoadScore {
  total: number;
  partner1: number;
  partner2: number;
  difference: number;
  isBalanced: boolean;
  balanceStatus: 'perfect' | 'close' | 'moderate' | 'unbalanced';
}

interface PartnerNames {
  partner1: string;
  partner2: string;
}

// Storage keys
const STORAGE_KEYS = {
  ASSIGNMENTS: 'cohabispace_assignments',
  TASK_MODIFICATIONS: 'cohabispace_task_modifications',
  ACTIVE_TAB: 'cohabispace_active_tab',
  ACTIVE_FILTER: 'cohabispace_active_filter',
  LOAD_SCORE: 'cohabispace_load_score',
  PARTNER_NAMES: 'cohabispace_partner_names',
};

export default function Cohabispace() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loadScore, setLoadScore] = useState<LoadScore>({
    total: 0,
    partner1: 0,
    partner2: 0,
    difference: 0,
    isBalanced: true,
    balanceStatus: 'perfect',
  });
  const [activeTab, setActiveTab] = useState<number>(0);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [isStickyVisible, setIsStickyVisible] = useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [partnerNames, setPartnerNames] = useState<PartnerNames>(() => {
    const savedNames = localStorage.getItem(STORAGE_KEYS.PARTNER_NAMES);
    return savedNames ? JSON.parse(savedNames) : { partner1: 'Partner 1', partner2: 'Partner 2' };
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [tempPartnerNames, setTempPartnerNames] = useState(partnerNames);

  // Load saved data from localStorage
  useEffect(() => {
    console.log('Initializing Cohabispace component');
    
    // Load saved assignments
    const savedAssignments = localStorage.getItem(STORAGE_KEYS.ASSIGNMENTS);
    console.log('Saved assignments from localStorage:', savedAssignments);
    
    let loadedAssignments: Assignment[] = [];
    
    if (savedAssignments) {
      try {
        loadedAssignments = JSON.parse(savedAssignments);
        console.log('Parsed assignments:', loadedAssignments);
      } catch (error) {
        console.error('Error parsing saved assignments:', error);
      }
    }

    // Load saved task modifications
    const savedModifications = localStorage.getItem(STORAGE_KEYS.TASK_MODIFICATIONS);
    console.log('Saved task modifications from localStorage:', savedModifications);
    
    let taskModifications: TaskModification[] = [];
    
    if (savedModifications) {
      try {
        taskModifications = JSON.parse(savedModifications);
        console.log('Parsed task modifications:', taskModifications);
      } catch (error) {
        console.error('Error parsing saved task modifications:', error);
      }
    }

    // Load saved load score
    const savedLoadScore = localStorage.getItem(STORAGE_KEYS.LOAD_SCORE);
    console.log('Saved load score from localStorage:', savedLoadScore);
    
    if (savedLoadScore) {
      try {
        const parsedLoadScore = JSON.parse(savedLoadScore);
        console.log('Parsed load score:', parsedLoadScore);
        setLoadScore(parsedLoadScore);
      } catch (error) {
        console.error('Error parsing saved load score:', error);
      }
    }

    // Initialize tasks from categories and apply modifications
    initializeTasksWithModifications(taskModifications);
    
    // Set assignments after tasks are initialized
    setAssignments(loadedAssignments);
    
    // Mark data as loaded
    setIsDataLoaded(true);
  }, []);

  // Initialize tasks from categories and apply modifications
  const initializeTasksWithModifications = (modifications: TaskModification[] = []) => {
    console.log('Initializing tasks with modifications:', modifications);
    
    // Get original tasks from categories
    const allTasks: Task[] = [];
    fairPlayCategories.forEach(category => {
      allTasks.push(...category.tasks);
    });
    console.log('Original tasks from categories:', allTasks.length);

    // Apply modifications to tasks
    const modifiedTasks = allTasks.map(task => {
      const modification = modifications.find(m => m.id === task.id);
      if (modification) {
        return {
          ...task,
          difficulty: modification.difficulty !== undefined ? modification.difficulty : task.difficulty,
          frequency: modification.frequency || task.frequency,
        };
      }
      return task;
    });

    console.log('Modified tasks after applying changes:', modifiedTasks.length);
    setTasks(modifiedTasks);
  };

  // Save assignments to localStorage whenever they change
  useEffect(() => {
    if (isDataLoaded) {
      console.log('Saving assignments to localStorage:', assignments);
      localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(assignments));
    }
  }, [assignments, isDataLoaded]);

  // Save task modifications to localStorage whenever tasks change
  useEffect(() => {
    if (isDataLoaded) {
      // Only save the modifications (difficulty and frequency changes)
      const modifications: TaskModification[] = [];
      
      // Get original tasks for comparison
      const originalTasks: Task[] = [];
      fairPlayCategories.forEach(category => {
        originalTasks.push(...category.tasks);
      });
      
      // Find tasks that have been modified
      tasks.forEach(task => {
        const originalTask = originalTasks.find(t => t.id === task.id);
        if (originalTask && (
          task.difficulty !== originalTask.difficulty || 
          task.frequency !== originalTask.frequency
        )) {
          modifications.push({
            id: task.id,
            difficulty: task.difficulty,
            frequency: task.frequency,
          });
        }
      });
      
      console.log('Saving task modifications to localStorage:', modifications);
      localStorage.setItem(STORAGE_KEYS.TASK_MODIFICATIONS, JSON.stringify(modifications));
    }
  }, [tasks, isDataLoaded]);

  // Save load score to localStorage whenever it changes
  useEffect(() => {
    if (isDataLoaded) {
      console.log('Saving load score to localStorage:', loadScore);
      localStorage.setItem(STORAGE_KEYS.LOAD_SCORE, JSON.stringify(loadScore));
    }
  }, [loadScore, isDataLoaded]);

  // Update load score when assignments or tasks change
  useEffect(() => {
    if (isDataLoaded && tasks.length > 0) {
      console.log('Calculating new load score based on current assignments and tasks');
      console.log('Current assignments:', assignments);
      const newLoadScore = calculateLoadScore(assignments);
      console.log('Setting new load score:', newLoadScore);
      setLoadScore(newLoadScore);
    }
  }, [assignments, tasks, isDataLoaded]);

  // Calculate load score based on assignments
  const calculateLoadScore = (currentAssignments: Assignment[]) => {
    console.log('Calculating load score for assignments:', currentAssignments);
    
    // Ensure we have valid tasks data
    if (!tasks || tasks.length === 0) {
      console.warn('No tasks available for load score calculation');
      return {
        total: 0,
        partner1: 0,
        partner2: 0,
        difference: 0,
        isBalanced: true,
        balanceStatus: 'perfect' as const,
      };
    }

    // Calculate scores for each partner
    const partner1Score = currentAssignments
      .filter(a => a.assignedTo === 'Partner 1')
      .reduce((score, assignment) => {
        const task = tasks.find(t => t.id === assignment.taskId);
        if (!task) {
          console.warn(`Task not found for assignment: ${assignment.taskId}`);
          return score;
        }
        const taskScore = calculateTaskScore(task);
        console.log(`Task ${task.name} (${task.id}) has score: ${taskScore}`);
        return score + taskScore;
      }, 0);

    const partner2Score = currentAssignments
      .filter(a => a.assignedTo === 'Partner 2')
      .reduce((score, assignment) => {
        const task = tasks.find(t => t.id === assignment.taskId);
        if (!task) {
          console.warn(`Task not found for assignment: ${assignment.taskId}`);
          return score;
        }
        const taskScore = calculateTaskScore(task);
        console.log(`Task ${task.name} (${task.id}) has score: ${taskScore}`);
        return score + taskScore;
      }, 0);

    console.log(`Partner 1 score: ${partner1Score}, Partner 2 score: ${partner2Score}`);

    const total = partner1Score + partner2Score;
    const difference = Math.abs(partner1Score - partner2Score);
    
    // Determine balance status based on percentage difference
    let balanceStatus: 'perfect' | 'close' | 'moderate' | 'unbalanced';
    let isBalanced: boolean;
    
    if (total === 0) {
      balanceStatus = 'perfect';
      isBalanced = true;
    } else {
      const percentageDifference = (difference / total) * 100;
      
      if (percentageDifference <= 5) {
        balanceStatus = 'perfect';
        isBalanced = true;
      } else if (percentageDifference <= 15) {
        balanceStatus = 'close';
        isBalanced = true;
      } else if (percentageDifference <= 30) {
        balanceStatus = 'moderate';
        isBalanced = false;
      } else {
        balanceStatus = 'unbalanced';
        isBalanced = false;
      }
    }

    const newLoadScore = {
      total,
      partner1: partner1Score,
      partner2: partner2Score,
      difference,
      isBalanced,
      balanceStatus,
    };
    
    console.log('New load score calculated:', newLoadScore);
    return newLoadScore;
  };

  // Calculate individual task score based on difficulty and frequency
  const calculateTaskScore = (task: Task) => {
    const frequencyMultiplier = {
      'daily': 7,
      'every-other-day': 3.5,
      'weekly': 1,
      'every-other-week': 0.5,
      'monthly': 0.25,
      'quarterly': 0.083,
      'annually': 0.021,
      'weekends': 2,
      'weekdays': 5,
      'as-needed': 0.5,
    };

    return task.difficulty * (frequencyMultiplier[task.frequency] || 1);
  };

  // Handle task assignment changes
  const handleAssignmentChange = (taskId: string, assignedTo: string) => {
    console.log(`Assignment change: Task ${taskId} assigned to ${assignedTo}`);
    
    // Validate the assignment
    if (!taskId || !assignedTo) {
      console.error('Invalid assignment data:', { taskId, assignedTo });
      return;
    }
    
    // Find the task to ensure it exists
    const task = tasks.find(t => t.id === taskId);
    if (!task) {
      console.error(`Task not found: ${taskId}`);
      return;
    }
    
    setAssignments(prev => {
      // Remove any existing assignment for this task
      const filtered = prev.filter(a => a.taskId !== taskId);
      
      // If the task is being unassigned, just return the filtered list
      if (assignedTo === 'unassigned') {
        console.log(`Removing assignment for task ${taskId}`);
        return filtered;
      }
      
      // Add the new assignment
      const newAssignment = { taskId, assignedTo };
      console.log(`Adding new assignment:`, newAssignment);
      return [...filtered, newAssignment];
    });
  };

  // Handle task difficulty changes
  const handleDifficultyChange = (taskId: string, difficulty: number) => {
    console.log(`Updating difficulty for task ${taskId} to ${difficulty}`);
    setTasks(prev => 
      prev.map(task => 
        task.id === taskId ? { ...task, difficulty } : task
      )
    );
  };

  // Handle task frequency changes
  const handleFrequencyChange = (taskId: string, frequency: string) => {
    console.log(`Updating frequency for task ${taskId} to ${frequency}`);
    setTasks(prev => 
      prev.map(task => 
        task.id === taskId ? { ...task, frequency: frequency as Frequency } : task
      )
    );
  };

  // Handle partner name changes
  const handlePartnerNameChange = (partner: 'partner1' | 'partner2', value: string) => {
    setTempPartnerNames(prev => ({ ...prev, [partner]: value }));
  };

  // Save partner names
  const savePartnerNames = () => {
    setPartnerNames(tempPartnerNames);
    localStorage.setItem(STORAGE_KEYS.PARTNER_NAMES, JSON.stringify(tempPartnerNames));
    setIsSettingsOpen(false);
  };

  // Handle mobile dropdown toggle
  const toggleMobileDropdown = () => {
    setIsMobileDropdownOpen(!isMobileDropdownOpen);
  };

  // Handle category selection from dropdown
  const handleCategorySelect = (index: number) => {
    setActiveTab(index);
    setIsMobileDropdownOpen(false);
  };

  // Handle filter change
  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };

  // Handle partner score click
  const handlePartnerScoreClick = (partner: string) => {
    console.log(`Partner score clicked: ${partner}`);
    const filterValue = partner === 'Partner 1' ? 'partner1' : 'partner2';
    console.log(`Setting active filter to: ${filterValue}`);
    setActiveFilter(filterValue);
  };

  // Get filtered tasks based on active filter
  const getFilteredTasks = (categoryTasks: Task[]) => {
    console.log('Filtering tasks with active filter:', activeFilter);
    console.log('Current assignments:', assignments);
    
    if (activeFilter === 'all') {
      return categoryTasks;
    } else if (activeFilter === 'partner1') {
      const filtered = categoryTasks.filter(task => {
        const assignment = assignments.find(a => a.taskId === task.id);
        const isAssignedToPartner1 = assignment && assignment.assignedTo === 'Partner 1';
        console.log(`Task ${task.name} (${task.id}) assigned to Partner 1: ${isAssignedToPartner1}`);
        return isAssignedToPartner1;
      });
      console.log('Partner 1 filtered tasks:', filtered.length);
      return filtered;
    } else if (activeFilter === 'partner2') {
      const filtered = categoryTasks.filter(task => {
        const assignment = assignments.find(a => a.taskId === task.id);
        const isAssignedToPartner2 = assignment && assignment.assignedTo === 'Partner 2';
        console.log(`Task ${task.name} (${task.id}) assigned to Partner 2: ${isAssignedToPartner2}`);
        return isAssignedToPartner2;
      });
      console.log('Partner 2 filtered tasks:', filtered.length);
      return filtered;
    } else if (activeFilter === 'unassigned') {
      const filtered = categoryTasks.filter(task => {
        const isUnassigned = !assignments.some(a => a.taskId === task.id);
        console.log(`Task ${task.name} (${task.id}) is unassigned: ${isUnassigned}`);
        return isUnassigned;
      });
      console.log('Unassigned filtered tasks:', filtered.length);
      return filtered;
    }
    return categoryTasks;
  };

  // Get balance status message
  const getBalanceStatusMessage = () => {
    switch (loadScore.balanceStatus) {
      case 'perfect':
        return 'Perfectly Balanced';
      case 'close':
        return 'Nearly Balanced';
      case 'moderate':
        return 'Slightly Unbalanced';
      case 'unbalanced':
        return 'Significantly Unbalanced';
      default:
        return 'Balanced';
    }
  };

  // Get balance status class
  const getBalanceStatusClass = () => {
    switch (loadScore.balanceStatus) {
      case 'perfect':
        return 'status-perfect';
      case 'close':
        return 'status-close';
      case 'moderate':
        return 'status-moderate';
      case 'unbalanced':
        return 'status-unbalanced';
      default:
        return 'status-balanced';
    }
  };

  // Get badge class based on balance status
  const getBadgeClass = () => {
    switch (loadScore.balanceStatus) {
      case 'perfect':
        return 'badge-success';
      case 'close':
        return 'badge-success';
      case 'moderate':
        return 'badge-warning';
      case 'unbalanced':
        return 'badge-danger';
      default:
        return 'badge-success';
    }
  };

  // Export data to CSV
  const exportToCSV = () => {
    // Create CSV header
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Task Name,Category,Difficulty,Frequency,Assigned To\n';
    
    // Add task data
    tasks.forEach(task => {
      const category = fairPlayCategories.find(cat => 
        cat.tasks.some(t => t.id === task.id)
      )?.name || 'Unknown';
      
      const assignment = assignments.find(a => a.taskId === task.id);
      const assignedTo = assignment ? assignment.assignedTo : 'Unassigned';
      
      const row = [
        `"${task.name}"`,
        `"${category}"`,
        task.difficulty,
        task.frequency,
        `"${assignedTo}"`
      ].join(',');
      
      csvContent += row + '\n';
    });
    
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'cohabispace_tasks.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Save all data to localStorage
  const saveAllData = () => {
    console.log('Manually saving all data to localStorage');
    
    // Save assignments
    localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(assignments));
    console.log('Saved assignments:', assignments);
    
    // Save task modifications
    const modifications: TaskModification[] = [];
    const originalTasks: Task[] = [];
    fairPlayCategories.forEach(category => {
      originalTasks.push(...category.tasks);
    });
    
    tasks.forEach(task => {
      const originalTask = originalTasks.find(t => t.id === task.id);
      if (originalTask && (
        task.difficulty !== originalTask.difficulty || 
        task.frequency !== originalTask.frequency
      )) {
        modifications.push({
          id: task.id,
          difficulty: task.difficulty,
          frequency: task.frequency,
        });
      }
    });
    
    localStorage.setItem(STORAGE_KEYS.TASK_MODIFICATIONS, JSON.stringify(modifications));
    console.log('Saved task modifications:', modifications);
    
    // Save active tab
    localStorage.setItem(STORAGE_KEYS.ACTIVE_TAB, activeTab.toString());
    
    // Save active filter
    localStorage.setItem(STORAGE_KEYS.ACTIVE_FILTER, activeFilter);
    
    // Save load score
    localStorage.setItem(STORAGE_KEYS.LOAD_SCORE, JSON.stringify(loadScore));
    
    // Show success message
    alert('All data saved successfully!');
  };

  // Add back the scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsStickyVisible(scrollPosition > 200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="cohabispace-container">
      <div className="cohabispace-header">
        <Link to="/dashboard" className="logo-link">
          <div className="logo">
            <img src="/images/logo.png" alt="Cohabispace Logo" className="logo-image" />
          </div>
        </Link>
        <div className="header-buttons">
          <button className="settings-button" onClick={() => setIsSettingsOpen(true)}>
            <FaCog /> Settings
          </button>
          <button className="save-button" onClick={saveAllData}>
            <FaSave /> Save Data
          </button>
          <button className="export-button" onClick={exportToCSV}>
            <FaFileExport /> Export CSV
          </button>
        </div>
      </div>
      
      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="settings-modal">
          <div className="settings-content">
            <div className="settings-header">
              <h2>Settings</h2>
              <button className="close-button" onClick={() => setIsSettingsOpen(false)}>×</button>
            </div>
            <div className="settings-body">
              <div className="partner-name-settings">
                <h3>Partner Names</h3>
                <div className="partner-name-input">
                  <label>Partner 1:</label>
                  <input
                    type="text"
                    value={tempPartnerNames.partner1}
                    onChange={(e) => handlePartnerNameChange('partner1', e.target.value)}
                    placeholder="Enter name for Partner 1"
                  />
                </div>
                <div className="partner-name-input">
                  <label>Partner 2:</label>
                  <input
                    type="text"
                    value={tempPartnerNames.partner2}
                    onChange={(e) => handlePartnerNameChange('partner2', e.target.value)}
                    placeholder="Enter name for Partner 2"
                  />
                </div>
              </div>
            </div>
            <div className="settings-footer">
              <button className="cancel-button" onClick={() => setIsSettingsOpen(false)}>Cancel</button>
              <button className="save-button" onClick={savePartnerNames}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {!isDataLoaded ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your data...</p>
        </div>
      ) : (
        <>
          <div className="load-score-card">
            <h2 className="load-score-title">Mental Load Score</h2>
            <p className={`load-score-status ${getBalanceStatusClass()}`}>
              {getBalanceStatusMessage()}
            </p>
            
            <div className="load-score-grid">
              <div 
                className="load-score-partner" 
                onClick={() => handlePartnerScoreClick(partnerNames.partner1)}
                style={{ cursor: 'pointer' }}
              >
                <p className="partner-label">{partnerNames.partner1}</p>
                <div className="progress-bar">
                  <div 
                    className="progress-fill partner1" 
                    style={{ width: `${(loadScore.partner1 / loadScore.total) * 100}%` }}
                  ></div>
                </div>
                <p className="partner-score">Score: {loadScore.partner1.toFixed(1)}</p>
              </div>
              
              <div 
                className="load-score-partner" 
                onClick={() => handlePartnerScoreClick(partnerNames.partner2)}
                style={{ cursor: 'pointer' }}
              >
                <p className="partner-label">{partnerNames.partner2}</p>
                <div className="progress-bar">
                  <div 
                    className="progress-fill partner2" 
                    style={{ width: `${(loadScore.partner2 / loadScore.total) * 100}%` }}
                  ></div>
                </div>
                <p className="partner-score">Score: {loadScore.partner2.toFixed(1)}</p>
              </div>
            </div>
            
            <div className="load-score-badges">
              <span className={`badge ${getBadgeClass()}`}>
                Difference: {loadScore.difference.toFixed(1)}
              </span>
              <span className={`badge ${getBadgeClass()}`}>
                {getBalanceStatusMessage()}
              </span>
            </div>
            
            <div className="filter-buttons">
              <button 
                className={`filter-button ${activeFilter === 'all' ? 'active' : ''}`}
                onClick={() => handleFilterChange('all')}
              >
                All Tasks
              </button>
              <button 
                className={`filter-button ${activeFilter === 'partner1' ? 'active' : ''}`}
                onClick={() => handleFilterChange('partner1')}
              >
                {partnerNames.partner1}
              </button>
              <button 
                className={`filter-button ${activeFilter === 'partner2' ? 'active' : ''}`}
                onClick={() => handleFilterChange('partner2')}
              >
                {partnerNames.partner2}
              </button>
              <button 
                className={`filter-button ${activeFilter === 'unassigned' ? 'active' : ''}`}
                onClick={() => handleFilterChange('unassigned')}
              >
                Unassigned
              </button>
            </div>
          </div>

          <div className={`sticky-load-score ${isStickyVisible ? 'visible' : ''}`}>
            <div className="sticky-scores">
              <div 
                className="sticky-partner"
                onClick={() => handlePartnerScoreClick(partnerNames.partner1)}
                style={{ cursor: 'pointer' }}
              >
                <span className="sticky-partner-label">{partnerNames.partner1}</span>
                <div className="sticky-progress">
                  <div 
                    className="sticky-progress-fill partner1" 
                    style={{ width: `${(loadScore.partner1 / loadScore.total) * 100}%` }}
                  ></div>
                </div>
                <span className="sticky-score">{loadScore.partner1.toFixed(1)}</span>
              </div>
              <div 
                className="sticky-partner"
                onClick={() => handlePartnerScoreClick(partnerNames.partner2)}
                style={{ cursor: 'pointer' }}
              >
                <span className="sticky-partner-label">{partnerNames.partner2}</span>
                <div className="sticky-progress">
                  <div 
                    className="sticky-progress-fill partner2" 
                    style={{ width: `${(loadScore.partner2 / loadScore.total) * 100}%` }}
                  ></div>
                </div>
                <span className="sticky-score">{loadScore.partner2.toFixed(1)}</span>
              </div>
            </div>
            <div className={`sticky-status ${getBalanceStatusClass()}`}>
              {getBalanceStatusMessage()}
            </div>
          </div>

          {/* Task Categories */}
          <div className="task-categories">
            {/* Mobile Dropdown */}
            <div className="mobile-category-dropdown">
              <button 
                className="mobile-dropdown-toggle"
                onClick={toggleMobileDropdown}
                aria-expanded={isMobileDropdownOpen}
              >
                <span>{fairPlayCategories[activeTab].name}</span>
                <span className={`dropdown-arrow ${isMobileDropdownOpen ? 'open' : ''}`}>▼</span>
              </button>
              
              {isMobileDropdownOpen && (
                <div className="mobile-dropdown-menu">
                  {fairPlayCategories.map((category, index) => (
                    <button
                      key={category.id}
                      className={`mobile-dropdown-item ${activeTab === index ? 'active' : ''}`}
                      onClick={() => handleCategorySelect(index)}
                      data-category={category.id}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Desktop Tabs */}
            <div className="tabs desktop-only">
              {fairPlayCategories.map((category, index) => (
                <button 
                  key={category.id}
                  className={`tab ${activeTab === index ? 'active' : ''}`}
                  onClick={() => setActiveTab(index)}
                  data-category={category.id}
                >
                  {category.name}
                </button>
              ))}
            </div>

            <div className="tab-content">
              {fairPlayCategories.map((category, index) => (
                <div 
                  key={category.id}
                  className={`tab-panel ${activeTab === index ? 'active' : ''}`}
                >
                  <TaskCategory
                    category={category}
                    updatedTasks={getFilteredTasks(category.tasks)}
                    assignments={assignments}
                    onAssignmentChange={handleAssignmentChange}
                    onDifficultyChange={handleDifficultyChange}
                    onFrequencyChange={handleFrequencyChange}
                    partnerNames={partnerNames}
                  />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
} 