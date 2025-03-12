import React from 'react';
import { cn } from '@/lib/utils';
import { Trash2, Edit, CheckCircle, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const TaskCard = ({ task, onDelete, onToggleComplete, onEdit }) => {
  const taskId = task.id || task._id || '';
  
  if (!taskId) {
    return null;
  }

  const handleToggle = () => {
    onToggleComplete(taskId, !task.completed);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={cn(
        "task-card p-4 rounded-xl border",
        task.completed 
          ? "bg-secondary/50 border-secondary" 
          : "bg-white border-border"
      )}
    >
      <div className="flex items-start gap-3">
        <Button 
          variant="ghost" 
          size="icon" 
          className={cn(
            "h-6 w-6 rounded-full p-0 mt-0.5",
            task.completed ? "text-primary" : "text-muted-foreground"
          )}
          onClick={handleToggle}
        >
          {task.completed ? <CheckCircle className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
        </Button>
        
        <div className="flex-1 min-w-0">
          <h3 className={cn(
            "font-medium text-base mb-1 break-words",
            task.completed && "line-through text-muted-foreground"
          )}>
            {task.title}
          </h3>
          
          {task.description && (
            <p className={cn(
              "text-sm text-muted-foreground break-words",
              task.completed && "line-through opacity-70"
            )}>
              {task.description}
            </p>
          )}
        </div>
        
        <div className="task-actions flex items-center gap-1 ml-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-accent"
            onClick={() => onEdit(task)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-destructive"
            onClick={() => onDelete(taskId)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;