// Form and data validation utilities
export const validators = {
  // Email validation
  email: (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  },

  // URL validation
  url: (value: string): boolean => {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  },

  // GitHub repo URL validation
  githubUrl: (value: string): boolean => {
    const githubRegex = /^https?:\/\/(www\.)?github\.com\/[\w-]+\/[\w.-]+\/?$/i;
    return githubRegex.test(value);
  },

  // String length validation
  minLength: (value: string, min: number): boolean => {
    return value.trim().length >= min;
  },

  maxLength: (value: string, max: number): boolean => {
    return value.trim().length <= max;
  },

  // Required field validation
  required: (value: string | number | any): boolean => {
    if (typeof value === 'string') {
      return value.trim().length > 0;
    }
    return value != null && value !== '';
  },

  // Number validation
  number: (value: string): boolean => {
    return !isNaN(Number(value)) && Number.isFinite(Number(value));
  },

  // Password strength validation
  passwordStrength: (password: string): {
    isStrong: boolean;
    score: number;
    message: string;
  } => {
    let score = 0;
    const messages: string[] = [];

    if (password.length >= 8) score++;
    else messages.push('At least 8 characters');

    if (/[A-Z]/.test(password)) score++;
    else messages.push('At least one uppercase letter');

    if (/[a-z]/.test(password)) score++;
    else messages.push('At least one lowercase letter');

    if (/[0-9]/.test(password)) score++;
    else messages.push('At least one number');

    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score++;
    else messages.push('At least one special character');

    const isStrong = score >= 4;
    const message = isStrong ? 'Strong password' : messages.join(', ');

    return { isStrong, score, message };
  },

  // Array validation
  minArrayLength: (array: any[], min: number): boolean => {
    return Array.isArray(array) && array.length >= min;
  },

  maxArrayLength: (array: any[], max: number): boolean => {
    return Array.isArray(array) && array.length <= max;
  },
};

// Error message generators
export const getErrorMessage = (field: string, rule: string): string => {
  const messages: Record<string, Record<string, string>> = {
    email: {
      required: 'Email is required',
      email: 'Please enter a valid email address',
    },
    password: {
      required: 'Password is required',
      minLength: 'Password must be at least 8 characters',
      passwordStrength: 'Password is not strong enough',
    },
    username: {
      required: 'Username is required',
      minLength: 'Username must be at least 3 characters',
    },
    projectName: {
      required: 'Project name is required',
      minLength: 'Project name must be at least 3 characters',
    },
    description: {
      required: 'Description is required',
      minLength: 'Description must be at least 10 characters',
    },
    taskName: {
      required: 'Task name is required',
      minLength: 'Task name must be at least 3 characters',
    },
    repositoryUrl: {
      required: 'Repository URL is required',
      url: 'Please enter a valid URL',
      githubUrl: 'Please enter a valid GitHub repository URL',
    },
  };

  return messages[field]?.[rule] || `${field} is invalid`;
};
