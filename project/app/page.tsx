'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Code2, 
  Trophy, 
  Users, 
  Brain,
  Target,
  Zap,
  Shield,
  Globe
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 z-0" />
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97"
            alt="Code Arena Background"
            fill
            className="object-cover opacity-10"
            priority
          />
        </div>
        <div className="container mx-auto px-4 py-24 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="flex justify-center mb-6">
              <Link href="/" className="flex items-center gap-2">
                <Code2 className="w-12 h-12 text-primary" />
                <span className="text-4xl font-bold">Code Arena</span>
              </Link>
            </div>
            <h1 className="text-5xl font-bold tracking-tight mb-6">
              Master Coding Through <span className="text-primary">Competition</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of developers worldwide in competitive programming challenges. 
              Practice, compete, and level up your coding skills.
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/auth/signup">Get Started</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/auth/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Code Arena?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6">
              <Brain className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Practice & Learn</h3>
              <p className="text-muted-foreground">
                Access hundreds of coding challenges across multiple programming languages and difficulty levels
              </p>
            </Card>
            <Card className="p-6">
              <Trophy className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Compete</h3>
              <p className="text-muted-foreground">
                Join live coding competitions and prove your skills against developers worldwide
              </p>
            </Card>
            <Card className="p-6">
              <Target className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
              <p className="text-muted-foreground">
                Monitor your improvement with detailed statistics and performance analytics
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">100K+</div>
              <div className="text-muted-foreground">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">1000+</div>
              <div className="text-muted-foreground">Coding Challenges</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">50+</div>
              <div className="text-muted-foreground">Weekly Competitions</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">95%</div>
              <div className="text-muted-foreground">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Platform Benefits</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center">
              <Shield className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Secure Environment</h3>
              <p className="text-muted-foreground">
                Sandboxed code execution and secure testing environment
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Globe className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Global Community</h3>
              <p className="text-muted-foreground">
                Connect with developers from around the world
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Zap className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Real-time Feedback</h3>
              <p className="text-muted-foreground">
                Instant code evaluation and performance metrics
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Users className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Team Features</h3>
              <p className="text-muted-foreground">
                Create and manage coding competitions for your team
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Coding?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join Code Arena today and take your programming skills to the next level
          </p>
          <Button asChild size="lg">
            <Link href="/auth/signup">Create Free Account</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}