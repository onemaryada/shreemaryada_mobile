import { colors } from './colors';

export type TaskStatus = 'Todo' | 'In Progress' | 'Review' | 'Done';
export type ProjectStatus = 'Active' | 'Completed' | 'On Hold';
export type Priority = 'Low' | 'Medium' | 'High';

export const getTaskStatusBadgeColor = (status: TaskStatus) => {
  switch (status) {
    case 'Todo':
      return { bg: colors.badgeTodo, text: colors.badgeTodoText };
    case 'In Progress':
      return { bg: colors.badgeInProgress, text: colors.badgeInProgressText };
    case 'Review':
      return { bg: colors.badgeReview, text: colors.badgeReviewText };
    case 'Done':
      return { bg: colors.badgeDone, text: colors.badgeDoneText };
    default:
      return { bg: colors.badgeTodo, text: colors.badgeTodoText };
  }
};

export const getProjectStatusBadgeColor = (status: ProjectStatus) => {
  switch (status) {
    case 'Active':
      return { bg: colors.badgeActive, text: colors.badgeActiveText };
    case 'Completed':
      return { bg: colors.badgeCompleted, text: colors.badgeCompletedText };
    case 'On Hold':
      return { bg: colors.badgeOnHold, text: colors.badgeOnHoldText };
    default:
      return { bg: colors.badgeActive, text: colors.badgeActiveText };
  }
};

export const getPriorityBadgeColor = (priority: Priority) => {
  switch (priority) {
    case 'Low':
      return { bg: colors.badgePriorityLow, text: colors.badgePriorityLowText };
    case 'Medium':
      return { bg: colors.badgePriorityMedium, text: colors.badgePriorityMediumText };
    case 'High':
      return { bg: colors.badgePriorityHigh, text: colors.badgePriorityHighText };
    default:
      return { bg: colors.badgePriorityLow, text: colors.badgePriorityLowText };
  }
};
