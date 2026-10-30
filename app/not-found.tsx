import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-thaw-950 text-thaw-100 flex flex-col items-center justify-center px-6">
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-thaw-900 border border-thaw-800 text-sage-400 flex items-center justify-center mb-6">
          <Sparkles className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-serif text-white mb-2">Not found</h1>
        <p className="text-sm text-thaw-300 mb-8">
          This page isn't here, but Thaw is. Return to the dashboard and find your next small step.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-sage-500 text-thaw-950 font-medium hover:bg-sage-400 transition shadow-lg"
        >
          Back to dashboard
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
