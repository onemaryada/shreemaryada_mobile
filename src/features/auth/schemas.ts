import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const signupSchema = z.object({
  // Personal Details
  fullName: z.string().min(2, 'Full Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters').optional().or(z.literal('')),
  phone: z.string().min(10, 'Phone number is required'),
  address: z.string().min(5, 'Address is required'),
  gender: z.enum(['Male', 'Female', 'Other']),
  dob: z.string().min(1, 'Date of Birth is required'),
  
  // Employment Details
  department: z.string().min(2, 'Department is required'),
  designation: z.string().min(2, 'Designation is required'),
  role: z.enum(['Admin', 'Manager', 'Employee']),
  status: z.enum(['Active', 'Inactive']),
  employeeId: z.string().min(1, 'Employee ID is required'),
  joiningDate: z.string().min(1, 'Joining Date is required'),

  // Banking Details
  bankName: z.string().min(2, 'Bank Name is required'),
  accountHolder: z.string().min(2, 'Account Holder Name is required'),
  ifsc: z.string().min(2, 'IFSC Code is required'),
  accountNumber: z.string().min(5, 'Account Number is required'),
  accountType: z.enum(['Savings', 'Current']),
  branch: z.string().min(2, 'Branch is required'),
});

export type SignupFormData = z.infer<typeof signupSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
