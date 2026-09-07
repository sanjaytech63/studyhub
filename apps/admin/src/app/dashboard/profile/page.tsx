'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  User,
  Mail,
  Lock,
  Camera,
  Trash2,
  CheckCircle2,
  Loader,
  Eye,
  EyeOff,
  ArrowRight,
  KeyRound,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input, Label } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Modal } from '@/components/ui/modal';
import { useAuthStore } from '@/store/auth.store';
import {
  adminProfileQueryOptions,
  useUpdateAdminProfileMutation,
  useChangeAdminPasswordMutation,
  useRequestAdminEmailChangeMutation,
  useVerifyAdminEmailChangeMutation,
  useResendAdminEmailChangeOtpMutation,
  useUploadAdminSelfAvatarMutation,
  useDeleteAdminSelfAvatarMutation,
} from '@/lib/admin/profile.queries';
import { getApiErrorMessage } from '@/lib/api/api-client';
import {
  adminProfileSchema,
  type AdminProfileFormValues,
  adminChangePasswordSchema,
  type AdminChangePasswordFormValues,
  adminChangeEmailSchema,
  type AdminChangeEmailFormValues,
  adminVerifyEmailOtpSchema,
  type AdminVerifyEmailOtpFormValues,
} from '@/lib/admin/profile.schema';

export default function AdminProfilePage() {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Queries
  const { data: profile, isLoading, refetch } = useQuery(adminProfileQueryOptions);

  // Mutations
  const updateProfileMutation = useUpdateAdminProfileMutation();
  const changePasswordMutation = useChangeAdminPasswordMutation();
  const requestEmailMutation = useRequestAdminEmailChangeMutation();
  const verifyEmailMutation = useVerifyAdminEmailChangeMutation();
  const resendOtpMutation = useResendAdminEmailChangeOtpMutation();
  const uploadAvatarMutation = useUploadAdminSelfAvatarMutation();
  const deleteAvatarMutation = useDeleteAdminSelfAvatarMutation();

  // Password visibility state
  const [showCurrentPassword, setShowCurrentPassword] = React.useState(false);
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  // Email Change State & Modals
  const [isEmailModalOpen, setIsEmailModalOpen] = React.useState(false);
  const [isOtpStep, setIsOtpStep] = React.useState(false);

  // 1. Personal Info Form
  const profileForm = useForm<AdminProfileFormValues>({
    resolver: zodResolver(adminProfileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
    },
  });

  // 2. Password Change Form
  const passwordForm = useForm<AdminChangePasswordFormValues>({
    resolver: zodResolver(adminChangePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  // 3. Email Request Form
  const emailForm = useForm<AdminChangeEmailFormValues>({
    resolver: zodResolver(adminChangeEmailSchema),
    defaultValues: {
      newEmail: '',
    },
  });

  const currentTargetEmail = useWatch({ control: emailForm.control, name: 'newEmail' });

  // 4. Email Verify OTP Form
  const otpForm = useForm<AdminVerifyEmailOtpFormValues>({
    resolver: zodResolver(adminVerifyEmailOtpSchema),
    defaultValues: {
      otp: '',
    },
  });

  // Sync profile into personal info form and auth store when data arrives
  React.useEffect(() => {
    if (profile) {
      profileForm.reset({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
      });
      const currentUser = useAuthStore.getState().user;
      if (
        currentUser &&
        (currentUser.avatarUrl !== profile.avatarUrl ||
          currentUser.firstName !== profile.firstName ||
          currentUser.lastName !== profile.lastName)
      ) {
        useAuthStore.getState().setUser({
          ...currentUser,
          firstName: profile.firstName,
          lastName: profile.lastName,
          avatarUrl: profile.avatarUrl,
        });
      }
    }
  }, [profile, profileForm]);

  // Handle Avatar Upload
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error('Please upload a valid image (JPEG, PNG, or WebP).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB.');
      return;
    }

    try {
      const res = await uploadAvatarMutation.mutateAsync(file);
      toast.success(res?.message || 'Avatar updated successfully!');
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to upload avatar.'));
    }
  };

  // Handle Avatar Delete
  const handleDeleteAvatar = async () => {
    try {
      const res = await deleteAvatarMutation.mutateAsync();
      toast.success(res?.message || 'Avatar removed.');
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to remove avatar.'));
    }
  };

  // Handle Profile (Name) Submit
  const onProfileSubmit = async (values: AdminProfileFormValues) => {
    try {
      const res = await updateProfileMutation.mutateAsync({
        firstName: values.firstName.trim(),
        lastName: values.lastName?.trim() || null,
      });
      toast.success(res?.message || 'Profile details updated successfully!');
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to update profile.'));
    }
  };

  // Handle Password Change Submit
  const onPasswordSubmit = async (values: AdminChangePasswordFormValues) => {
    try {
      const res = await changePasswordMutation.mutateAsync({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      toast.success(res?.message || 'Password changed successfully!');
      passwordForm.reset();
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to change password.'));
    }
  };

  // Handle Request Email Change
  const onRequestEmailSubmit = async (values: AdminChangeEmailFormValues) => {
    if (values.newEmail.toLowerCase() === profile?.email.toLowerCase()) {
      emailForm.setError('newEmail', {
        message: 'New email must be different from your current email.',
      });
      return;
    }

    try {
      const res = await requestEmailMutation.mutateAsync({ newEmail: values.newEmail });
      toast.success(res?.message || `Verification code sent to ${values.newEmail}`);
      setIsOtpStep(true);
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to request email change.'));
    }
  };

  // Handle Verify Email Change OTP
  const onVerifyOtpSubmit = async (values: AdminVerifyEmailOtpFormValues) => {
    try {
      const res = await verifyEmailMutation.mutateAsync({ otp: values.otp });
      toast.success(res?.message || 'Email address updated successfully!');
      setIsEmailModalOpen(false);
      setIsOtpStep(false);
      emailForm.reset();
      otpForm.reset();
      void refetch();
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Invalid or expired OTP code.'));
    }
  };

  // Handle Resend OTP
  const handleResendOtp = async () => {
    const currentNewEmail = emailForm.getValues('newEmail');
    if (!currentNewEmail) return;

    try {
      const res = await resendOtpMutation.mutateAsync({ newEmail: currentNewEmail });
      toast.success(res?.message || 'New verification code sent!');
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to resend code.'));
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="h-40 rounded-2xl bg-card/60 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64 rounded-2xl bg-card/40 animate-pulse" />
          <div className="h-64 rounded-2xl bg-card/40 animate-pulse" />
        </div>
      </div>
    );
  }

  const isAvatarProcessing = uploadAvatarMutation.isPending || deleteAvatarMutation.isPending;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Page Heading */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Admin Profile & Security
        </h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Manage your personal administrator identity, email address, and authentication
          credentials.
        </p>
      </div>

      {/* Hero Profile Card */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            {/* Avatar with Camera Hover Overlay */}
            <div className="relative group shrink-0">
              <Avatar
                firstName={profile?.firstName}
                lastName={profile?.lastName}
                email={profile?.email}
                avatarUrl={profile?.avatarUrl}

                isOnline={true}
                className="h-20 w-20 text-lg"
              />

              {isAvatarProcessing ? (
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-xs">
                  <Loader className="h-6 w-6 animate-spin" />
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  title="Upload / Change Avatar"
                  aria-label="Upload / Change Avatar"
                  className="absolute inset-0 flex flex-col items-center justify-center rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <Camera className="h-5 w-5" />
                  <span className="text-[9px] font-medium tracking-tight">Edit</span>
                </button>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>

            {/* Profile Meta */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-center sm:justify-start gap-2.5 flex-wrap">
                <h2 className="text-xl font-bold tracking-tight text-foreground">
                  {profile?.firstName} {profile?.lastName || ''}
                </h2>
                <Badge variant="system">{profile?.role.name || 'ADMIN'}</Badge>
                <Badge variant="active">ACTIVE</Badge>
              </div>

              <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-mono text-muted-foreground">
                <Mail className="h-3.5 w-3.5 text-muted-foreground/70" />
                <span>{profile?.email}</span>
                {profile?.emailVerifiedAt && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-sans">
                    <CheckCircle2 className="h-3 w-3" />
                    Verified
                  </span>
                )}
              </div>

              {profile?.avatarUrl && (
                <div className="pt-1">
                  <button
                    type="button"
                    disabled={isAvatarProcessing}
                    onClick={handleDeleteAvatar}
                    className="inline-flex items-center gap-1 text-[11px] text-destructive/80 hover:text-destructive hover:underline transition-colors font-medium cursor-pointer"
                  >
                    <Trash2 className="h-3 w-3" />
                    Remove photo
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto justify-center">
            <Button
              variant="outline"
              onClick={() => refetch()}
              className="w-full sm:w-auto"
              leftIcon={<RefreshCw className="h-4 w-4" />}
            >
              Sync Profile
            </Button>
          </div>
        </div>
      </Card>

      {/* Forms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Personal Information Form */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              <CardTitle>Personal Information</CardTitle>
            </div>
            <CardDescription>
              Update your displayed identity and administrative names.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={profileForm.handleSubmit(onProfileSubmit)}
              className="space-y-4"
              noValidate
            >
              <div>
                <Label htmlFor="firstName" required>
                  First Name
                </Label>
                <Input
                  id="firstName"
                  placeholder="First name"
                  {...profileForm.register('firstName')}
                  error={profileForm.formState.errors.firstName?.message}
                />
              </div>

              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Last name (optional)"
                  {...profileForm.register('lastName')}
                  error={profileForm.formState.errors.lastName?.message}
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  isLoading={updateProfileMutation.isPending}
                >
                  Save Profile Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* 2. Email Address Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-blue-400" />
              <CardTitle>Email Address</CardTitle>
            </div>
            <CardDescription>
              Your primary account address used for login and notifications.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="p-3.5 rounded-xl border border-border/60 bg-secondary/30 space-y-1">
              <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider">
                Current Registered Email
              </span>
              <p className="text-sm font-semibold font-mono text-foreground">{profile?.email}</p>
              <div className="flex items-center gap-1.5 pt-1 text-[11px] text-emerald-400 font-mono">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Email verified and active</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => {
                emailForm.reset({ newEmail: '' });
                otpForm.reset({ otp: '' });
                setIsOtpStep(false);
                setIsEmailModalOpen(true);
              }}
              leftIcon={<Mail className="h-4 w-4" />}
            >
              Change Email Address
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* 3. Password & Security Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <KeyRound className="h-4 w-4 text-amber-400" />
            <CardTitle>Change Password</CardTitle>
          </div>
          <CardDescription>
            Ensure your account is using a secure password to prevent unauthorized access.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
            className="space-y-4 max-w-xl"
            noValidate
          >
            {/* Current Password */}
            <div>
              <Label htmlFor="currentPassword" required>
                Current Password
              </Label>
              <Input
                id="currentPassword"
                type={showCurrentPassword ? 'text' : 'password'}
                placeholder="••••••••••••"
                {...passwordForm.register('currentPassword')}
                error={passwordForm.formState.errors.currentPassword?.message}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword((prev) => !prev)}
                    className="cursor-pointer text-muted-foreground hover:text-foreground"
                    aria-label={
                      showCurrentPassword ? 'Hide current password' : 'Show current password'
                    }
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                }
              />
            </div>

            {/* New Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="newPassword" required>
                  New Password
                </Label>
                <Input
                  id="newPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="At least 8 characters"
                  {...passwordForm.register('newPassword')}
                  error={passwordForm.formState.errors.newPassword?.message}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowNewPassword((prev) => !prev)}
                      className="cursor-pointer text-muted-foreground hover:text-foreground"
                      aria-label={showNewPassword ? 'Hide new password' : 'Show new password'}
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  }
                />
              </div>

              {/* Confirm Password */}
              <div>
                <Label htmlFor="confirmPassword" required>
                  Confirm New Password
                </Label>
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Repeat new password"
                  {...passwordForm.register('confirmPassword')}
                  error={passwordForm.formState.errors.confirmPassword?.message}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="cursor-pointer text-muted-foreground hover:text-foreground"
                      aria-label={
                        showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  }
                />
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                className="w-full sm:w-auto"
                isLoading={changePasswordMutation.isPending}
                leftIcon={<Lock className="h-4 w-4" />}
              >
                Update Password
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Email Change Modal */}
      <Modal
        isOpen={isEmailModalOpen}
        onClose={() => {
          setIsEmailModalOpen(false);
          setIsOtpStep(false);
        }}
        title="Update Email Address"
        description={
          !isOtpStep
            ? 'Enter your new email address. A 6-digit verification code will be sent to confirm ownership.'
            : `Enter the 6-digit verification code sent to ${currentTargetEmail}.`
        }
        maxWidth="sm"
      >
        {!isOtpStep ? (
          <form
            onSubmit={emailForm.handleSubmit(onRequestEmailSubmit)}
            className="space-y-4"
            noValidate
          >
            <div>
              <Label htmlFor="newEmail" required>
                New Email Address
              </Label>
              <Input
                id="newEmail"
                type="email"
                placeholder="new.email@example.com"
                {...emailForm.register('newEmail')}
                error={emailForm.formState.errors.newEmail?.message}
              />
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2.5 pt-2 border-t border-border/50">
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => setIsEmailModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="w-full sm:w-auto"
                isLoading={requestEmailMutation.isPending}
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Send Verification Code
              </Button>
            </div>
          </form>
        ) : (
          <form onSubmit={otpForm.handleSubmit(onVerifyOtpSubmit)} className="space-y-4" noValidate>
            <div>
              <Label htmlFor="otp" required>
                6-Digit Verification Code
              </Label>
              <Input
                id="otp"
                maxLength={6}
                placeholder="123456"
                className="text-center font-mono text-lg tracking-widest"
                {...otpForm.register('otp')}
                error={otpForm.formState.errors.otp?.message}
              />
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <button
                type="button"
                disabled={resendOtpMutation.isPending}
                onClick={handleResendOtp}
                className="text-primary hover:underline font-medium cursor-pointer disabled:opacity-50"
              >
                Resend Code
              </button>
              <button
                type="button"
                onClick={() => setIsOtpStep(false)}
                className="text-muted-foreground hover:text-foreground cursor-pointer"
              >
                Change Email
              </button>
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2.5 pt-2 border-t border-border/50">
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => setIsEmailModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="w-full sm:w-auto"
                isLoading={verifyEmailMutation.isPending}
              >
                Verify & Update Email
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
