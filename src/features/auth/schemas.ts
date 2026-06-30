import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string({ required_error: 'Email is required', invalid_type_error: 'Email is required' }).min(1, 'Email is required').email('Invalid email address'),
  password: z.string({ required_error: 'Password is required', invalid_type_error: 'Password is required' }).min(1, 'Password is required'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const signupSchema = z.object({
  // Personal Details
  fullName: z.string({ required_error: 'Full Name is required', invalid_type_error: 'Full Name is required' }).min(2, 'Full Name must be at least 2 characters'),
  email: z.string({ required_error: 'Email is required', invalid_type_error: 'Email is required' }).min(1, 'Email is required').email('Invalid email address'),
  password: z.string({ required_error: 'Password is required', invalid_type_error: 'Password is required' }).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 'Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character').optional().or(z.literal('')),
  phone: z.string({ required_error: 'Phone number is required', invalid_type_error: 'Phone number is required' }).min(1, 'Phone number is required').regex(/^\+?[0-9]{10,15}$/, 'Invalid phone number format'),
  address: z.string({ required_error: 'Address is required', invalid_type_error: 'Address is required' }).min(5, 'Address is required'),
  gender: z.enum(['Male', 'Female', 'Other'], { required_error: 'Gender is required', invalid_type_error: 'Gender is required' }),
  dob: z.string({ required_error: 'Date of Birth is required', invalid_type_error: 'Date of Birth is required' }).min(1, 'Date of Birth is required').regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  
  // Employment Details
  department: z.string({ required_error: 'Department is required', invalid_type_error: 'Department is required' }).min(2, 'Department is required'),
  designation: z.string({ required_error: 'Designation is required', invalid_type_error: 'Designation is required' }).min(2, 'Designation is required'),
  role: z.enum(['Admin', 'Manager', 'Employee'], { required_error: 'Role is required', invalid_type_error: 'Role is required' }),
  status: z.enum(['Active', 'Inactive'], { required_error: 'Status is required', invalid_type_error: 'Status is required' }),
  employeeId: z.string({ required_error: 'Employee ID is required', invalid_type_error: 'Employee ID is required' }).min(2, 'Employee ID is required'),
  joiningDate: z.string({ required_error: 'Joining Date is required', invalid_type_error: 'Joining Date is required' }).min(1, 'Joining Date is required').regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),

  // Banking Details
  bankName: z.string({ required_error: 'Bank Name is required', invalid_type_error: 'Bank Name is required' }).min(2, 'Bank Name is required'),
  accountHolder: z.string({ required_error: 'Account Holder Name is required', invalid_type_error: 'Account Holder Name is required' }).min(2, 'Account Holder Name is required'),
  ifsc: z.string({ required_error: 'IFSC Code is required', invalid_type_error: 'IFSC Code is required' }).min(1, 'IFSC Code is required').regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC code format'),
  accountNumber: z.string({ required_error: 'Account Number is required', invalid_type_error: 'Account Number is required' }).min(1, 'Account Number is required').regex(/^\d{9,18}$/, 'Account Number must be 9-18 digits'),
  accountType: z.enum(['Savings', 'Current'], { required_error: 'Account Type is required', invalid_type_error: 'Account Type is required' }),
  branch: z.string({ required_error: 'Branch is required', invalid_type_error: 'Branch is required' }).min(2, 'Branch is required'),
});

export type SignupFormData = z.infer<typeof signupSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string({ required_error: 'Email is required' }).min(1, 'Email is required').email('Invalid email address'),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
