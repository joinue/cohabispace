import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";

import { Skeleton } from "@/components/ui/skeleton";
import { AuthCard } from "@/features/auth/components/auth-card";
import { SignInForm } from "@/features/auth/components/sign-in-form";

export const metadata: Metadata = { title: "Sign in" };

function SignInFormSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <Skeleton className="h-3.5 w-12" />
        <Skeleton className="h-8 w-full" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Skeleton className="h-3.5 w-16" />
        <Skeleton className="h-8 w-full" />
      </div>
      <Skeleton className="h-9 w-full" />
    </div>
  );
}

export default function SignInPage() {
  return (
    <AuthCard
      title="Welcome back"
      description="Sign in to manage your household."
      footer={
        <>
          Don&rsquo;t have an account?{" "}
          <Link href="/sign-up" className="text-foreground underline-offset-4 hover:underline">
            Create one
          </Link>
        </>
      }
    >
      <Suspense fallback={<SignInFormSkeleton />}>
        <SignInForm />
      </Suspense>
    </AuthCard>
  );
}
