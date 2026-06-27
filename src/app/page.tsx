"use client";

import { useState } from "react";

// UI Components (shadcn)
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// Shared Components
import { Logo } from "@/components/shared/logo";
import { Spinner } from "@/components/shared/spinner";
import { PageHeader } from "@/components/shared/page-header";
import { SectionHeading } from "@/components/shared/section-heading";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { LoadingState } from "@/components/shared/loading-state";
import { StatCard } from "@/components/shared/stat-card";
import { toast } from "@/components/shared/toaster";

// Layout Components
import { PublicNav } from "@/components/layouts/public-nav";
import { PublicFooter } from "@/components/layouts/public-footer";

// =============================================================================
// UI Showcase Page — Displays every design system component
// =============================================================================

export default function ShowcasePage() {
  const [progress, setProgress] = useState(68);
  const [switchOn, setSwitchOn] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Public Nav Demo */}
      <PublicNav />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">Design System v1.0</Badge>
          <h1 className="text-4xl sm:text-5xl font-heading font-bold tracking-tight text-foreground">
            MDCAT Design System
          </h1>
          <p className="text-lg text-muted-foreground mt-3 max-w-2xl mx-auto">
            A comprehensive showcase of every reusable component in the MDCAT platform.
            Inspired by the Stitch designs — deep navy, vibrant green, clean typography.
          </p>
        </div>

        {/* ================================================================== */}
        {/* LOGO */}
        {/* ================================================================== */}
        <ShowcaseSection title="Logo" description="Brand mark in multiple sizes.">
          <div className="flex items-end gap-8 flex-wrap">
            <Logo size="sm" />
            <Logo size="md" />
            <Logo size="lg" />
            <Logo size="md" showText={false} />
          </div>
        </ShowcaseSection>

        {/* ================================================================== */}
        {/* BUTTONS */}
        {/* ================================================================== */}
        <ShowcaseSection title="Buttons" description="Primary, secondary, destructive, outline, ghost, and link variants.">
          <div className="flex flex-wrap gap-3">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
          </div>
          <div className="flex flex-wrap gap-3 mt-4">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
            <Button size="icon">
              <PlusIcon className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-3 mt-4">
            <Button disabled>Disabled</Button>
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
              Accent (Green CTA)
            </Button>
          </div>
        </ShowcaseSection>

        {/* ================================================================== */}
        {/* INPUTS & FORMS */}
        {/* ================================================================== */}
        <ShowcaseSection title="Inputs & Forms" description="Text inputs, labels, textareas, selects, and switches.">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="Enter your full name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="you@example.com" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" placeholder="Write your message here..." rows={3} />
            </div>
            <div className="space-y-2">
              <Label>Subject</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="biology">Biology</SelectItem>
                  <SelectItem value="chemistry">Chemistry</SelectItem>
                  <SelectItem value="physics">Physics</SelectItem>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="logic">Logical Reasoning</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-3">
              <Switch id="dark-mode" checked={switchOn} onCheckedChange={setSwitchOn} />
              <Label htmlFor="dark-mode">Dark Mode</Label>
            </div>
          </div>
        </ShowcaseSection>

        {/* ================================================================== */}
        {/* CARDS */}
        {/* ================================================================== */}
        <ShowcaseSection title="Cards" description="Content containers with headers, descriptions, and footers.">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Biology</CardTitle>
                <CardDescription>Comprehensive coverage of zoology and botany.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Questions</span>
                  <span className="font-semibold">3,240</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Chapters</span>
                  <span className="font-semibold">18</span>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Completion</span>
                    <span className="font-semibold">45%</span>
                  </div>
                  <Progress value={45} className="h-2" />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Continue Practice →</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>Chemistry</CardTitle>
                  <Badge variant="secondary">Core</Badge>
                </div>
                <CardDescription>In-depth organic, inorganic, and physical chemistry.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-semibold text-info">42%</span>
                </div>
                <Progress value={42} className="h-2" />
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Resume →</Button>
              </CardFooter>
            </Card>

            <Card className="border-accent/30 bg-accent/5">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>Physics</CardTitle>
                  <Badge className="bg-warning text-warning-foreground">Weak Area</Badge>
                </div>
                <CardDescription>Numerical problems and conceptual questions.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-semibold text-destructive">10%</span>
                </div>
                <Progress value={10} className="h-2" />
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                  Start Practice ▶
                </Button>
              </CardFooter>
            </Card>
          </div>
        </ShowcaseSection>

        {/* ================================================================== */}
        {/* BADGES */}
        {/* ================================================================== */}
        <ShowcaseSection title="Badges" description="Status indicators and labels.">
          <div className="flex flex-wrap gap-3">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge className="bg-success text-success-foreground">Success</Badge>
            <Badge className="bg-warning text-warning-foreground">Warning</Badge>
            <Badge className="bg-info text-info-foreground">Info</Badge>
            <Badge className="bg-accent text-accent-foreground">Accent</Badge>
          </div>
        </ShowcaseSection>

        {/* ================================================================== */}
        {/* AVATARS */}
        {/* ================================================================== */}
        <ShowcaseSection title="Avatars" description="User profile indicators with initials.">
          <div className="flex items-end gap-4">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary">AM</AvatarFallback>
            </Avatar>
            <Avatar className="h-10 w-10">
              <AvatarFallback className="text-sm font-semibold bg-accent/20 text-accent-foreground">SJ</AvatarFallback>
            </Avatar>
            <Avatar className="h-12 w-12">
              <AvatarFallback className="font-semibold bg-info/20 text-info">HR</AvatarFallback>
            </Avatar>
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-lg font-bold bg-warning/20 text-warning-foreground">BK</AvatarFallback>
            </Avatar>
          </div>
        </ShowcaseSection>

        {/* ================================================================== */}
        {/* STAT CARDS */}
        {/* ================================================================== */}
        <ShowcaseSection title="Stat Cards" description="Dashboard metric cards matching the Stitch design.">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Total Attempts"
              value="1,248"
              icon={<AttemptIcon className="h-5 w-5 text-primary" />}
              trend={{ value: "+120 this week", positive: true }}
            />
            <StatCard
              label="Avg. Accuracy"
              value="68%"
              icon={<AccuracyIcon className="h-5 w-5 text-accent" />}
              trend={{ value: "+2% this week", positive: true }}
            />
            <StatCard
              label="Avg Time/Q"
              value="42s"
              icon={<TimerIcon className="h-5 w-5 text-info" />}
              trend={{ value: "-5s improvement", positive: true }}
            />
            <StatCard
              label="Peer Rank"
              value="Top 15%"
              icon={<RankIcon className="h-5 w-5 text-warning-foreground" />}
            />
          </div>
        </ShowcaseSection>

        {/* ================================================================== */}
        {/* PROGRESS */}
        {/* ================================================================== */}
        <ShowcaseSection title="Progress Bars" description="Visual progress indicators.">
          <div className="max-w-lg space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Biology</span>
                <span className="font-semibold">82%</span>
              </div>
              <Progress value={82} className="h-2.5" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Chemistry</span>
                <span className="font-semibold">65%</span>
              </div>
              <Progress value={65} className="h-2.5" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Physics</span>
                <span className="font-semibold">45%</span>
              </div>
              <Progress value={45} className="h-2.5" />
            </div>
            <div className="pt-2">
              <Label>Interactive: {progress}%</Label>
              <input
                type="range"
                min={0}
                max={100}
                value={progress}
                onChange={(e) => setProgress(Number(e.target.value))}
                className="w-full mt-2"
              />
              <Progress value={progress} className="h-3 mt-2" />
            </div>
          </div>
        </ShowcaseSection>

        {/* ================================================================== */}
        {/* TABS */}
        {/* ================================================================== */}
        <ShowcaseSection title="Tabs" description="Content section switcher.">
          <Tabs defaultValue="qbank" className="max-w-xl">
            <TabsList>
              <TabsTrigger value="qbank">Q-Bank</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="mocks">Mocks</TabsTrigger>
              <TabsTrigger value="smart-review">Smart Review</TabsTrigger>
            </TabsList>
            <TabsContent value="qbank" className="mt-4">
              <Card>
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground">
                    20,000+ MDCAT gives MCQs filtered by subject, topic, and difficulty.
                    Every question ships with a detailed rationale.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="analytics" className="mt-4">
              <Card>
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground">
                    Track your accuracy trends, compare with peers, and identify weak areas.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="mocks" className="mt-4">
              <Card>
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground">
                    Full-length mock exams that simulate PMC pacing.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="smart-review" className="mt-4">
              <Card>
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground">
                    AI-powered review sessions that focus on your weakest topics.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </ShowcaseSection>

        {/* ================================================================== */}
        {/* DIALOG & SHEET */}
        {/* ================================================================== */}
        <ShowcaseSection title="Dialog & Sheet" description="Modal overlays and side panels.">
          <div className="flex flex-wrap gap-3">
            <Dialog>
              <DialogTrigger render={<Button variant="outline" />}>
                Open Dialog
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>End Quiz?</DialogTitle>
                  <DialogDescription>
                    You have 6 unanswered questions. Are you sure you want to submit?
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline">Cancel</Button>
                  <Button variant="destructive">End Quiz</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Sheet>
              <SheetTrigger render={<Button variant="outline" />}>
                Open Sheet
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Quiz Filters</SheetTitle>
                  <SheetDescription>
                    Customize your quiz settings before starting.
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  <div className="space-y-2">
                    <Label>Subject</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="All Subjects" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bio">Biology</SelectItem>
                        <SelectItem value="chem">Chemistry</SelectItem>
                        <SelectItem value="phys">Physics</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Number of Questions</Label>
                    <Input type="number" placeholder="50" />
                  </div>
                  <Button className="w-full">Start Quiz</Button>
                </div>
              </SheetContent>
            </Sheet>

            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="outline" />}>
                Dropdown Menu
                <ChevronDownIcon className="h-4 w-4 ml-1" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem>Dashboard</DropdownMenuItem>
                <DropdownMenuItem>Bookmarks</DropdownMenuItem>
                <DropdownMenuItem>Wrong Questions</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </ShowcaseSection>

        {/* ================================================================== */}
        {/* TOAST */}
        {/* ================================================================== */}
        <ShowcaseSection title="Toasts" description="Notification feedback messages.">
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={() => toast({ title: "Quiz saved", description: "Your progress has been saved.", variant: "default" })}>
              Default Toast
            </Button>
            <Button variant="outline" onClick={() => toast({ title: "Answer correct!", description: "+10 XP earned.", variant: "success" })}>
              Success Toast
            </Button>
            <Button variant="outline" onClick={() => toast({ title: "Network error", description: "Could not save your answer.", variant: "destructive" })}>
              Error Toast
            </Button>
            <Button variant="outline" onClick={() => toast({ title: "Low time", description: "5 minutes remaining.", variant: "warning" })}>
              Warning Toast
            </Button>
          </div>
        </ShowcaseSection>

        {/* ================================================================== */}
        {/* SKELETONS */}
        {/* ================================================================== */}
        <ShowcaseSection title="Skeletons" description="Loading placeholders.">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
            <Card>
              <CardContent className="p-6 space-y-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-32" />
                <div className="space-y-2">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
                <Skeleton className="h-10 w-full rounded-lg" />
              </CardContent>
            </Card>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <Skeleton className="h-20 w-full rounded-lg" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          </div>
        </ShowcaseSection>

        {/* ================================================================== */}
        {/* SPINNERS */}
        {/* ================================================================== */}
        <ShowcaseSection title="Spinners" description="Animated loading indicators.">
          <div className="flex items-end gap-6">
            <div className="text-center">
              <Spinner size="sm" />
              <p className="text-xs text-muted-foreground mt-2">Small</p>
            </div>
            <div className="text-center">
              <Spinner size="md" />
              <p className="text-xs text-muted-foreground mt-2">Medium</p>
            </div>
            <div className="text-center">
              <Spinner size="lg" />
              <p className="text-xs text-muted-foreground mt-2">Large</p>
            </div>
          </div>
        </ShowcaseSection>

        {/* ================================================================== */}
        {/* STATES */}
        {/* ================================================================== */}
        <ShowcaseSection title="State Components" description="Empty, error, and loading states.">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <EmptyState
                icon={<BookmarkEmptyIcon className="h-7 w-7" />}
                title="No bookmarks yet"
                description="Save questions you want to revisit later."
                action={<Button size="sm">Browse Q-Bank</Button>}
              />
            </Card>
            <Card>
              <ErrorState
                title="Failed to load data"
                message="Check your network and try again."
                onRetry={() => toast({ title: "Retrying...", variant: "default" })}
              />
            </Card>
            <Card>
              <LoadingState message="Loading analytics..." />
            </Card>
          </div>
        </ShowcaseSection>

        {/* ================================================================== */}
        {/* PAGE & SECTION HEADERS */}
        {/* ================================================================== */}
        <ShowcaseSection title="Page & Section Headers" description="Consistent content headers.">
          <div className="space-y-8">
            <PageHeader
              title="Welcome back, Doctor."
              description="Let's continue your journey to medical school."
            >
              <Badge variant="outline" className="text-xs">Level 12</Badge>
            </PageHeader>
            <Separator />
            <SectionHeading
              title="Unlocked Badges"
              description="Your earned achievements."
            >
              <Button variant="ghost" size="sm">View All →</Button>
            </SectionHeading>
          </div>
        </ShowcaseSection>

        {/* ================================================================== */}
        {/* TYPOGRAPHY */}
        {/* ================================================================== */}
        <ShowcaseSection title="Typography" description="Font hierarchy — Poppins for headings, Inter for body.">
          <div className="space-y-4 max-w-2xl">
            <h1 className="text-4xl font-heading font-bold tracking-tight">Heading 1 — Practice Smarter</h1>
            <h2 className="text-3xl font-heading font-bold">Heading 2 — Analyze Better</h2>
            <h3 className="text-2xl font-heading font-semibold">Heading 3 — Score Higher</h3>
            <h4 className="text-xl font-heading font-semibold">Heading 4 — Section Title</h4>
            <p className="text-base text-foreground">Body text — The medical-grade Q-Bank built for Pakistan&apos;s top MDCAT aspirants. Master every subject with detailed analytics.</p>
            <p className="text-sm text-muted-foreground">Muted text — Supporting information and descriptions.</p>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Label — TOTAL ATTEMPTS</p>
          </div>
        </ShowcaseSection>

        {/* ================================================================== */}
        {/* COLORS */}
        {/* ================================================================== */}
        <ShowcaseSection title="Color Palette" description="Design tokens — derived from Stitch designs.">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            <ColorSwatch color="bg-primary" label="Primary" description="Deep Navy" />
            <ColorSwatch color="bg-secondary" label="Secondary" description="Light Blue" />
            <ColorSwatch color="bg-accent" label="Accent" description="Vibrant Green" />
            <ColorSwatch color="bg-muted" label="Muted" description="Cool Gray" />
            <ColorSwatch color="bg-destructive" label="Destructive" description="Red" />
            <ColorSwatch color="bg-success" label="Success" description="Green" />
            <ColorSwatch color="bg-warning" label="Warning" description="Amber" />
            <ColorSwatch color="bg-info" label="Info" description="Blue" />
            <ColorSwatch color="bg-card" label="Card" description="White" />
            <ColorSwatch color="bg-background" label="Background" description="Cool Gray" />
            <ColorSwatch color="bg-border" label="Border" description="Light Gray" />
            <ColorSwatch color="bg-ring" label="Ring/Focus" description="Medium Blue" />
          </div>
        </ShowcaseSection>

        {/* ================================================================== */}
        {/* SEPARATOR */}
        {/* ================================================================== */}
        <ShowcaseSection title="Separator" description="Horizontal and vertical dividers.">
          <div className="max-w-md">
            <p className="text-sm text-muted-foreground mb-3">Content above</p>
            <Separator />
            <p className="text-sm text-muted-foreground mt-3">Content below</p>
          </div>
        </ShowcaseSection>

        {/* ================================================================== */}
        {/* ANIMATIONS */}
        {/* ================================================================== */}
        <ShowcaseSection title="Animations" description="Micro-interactions and transitions.">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card className="animate-fade-up">
              <CardContent className="p-4 text-center">
                <p className="text-sm font-medium">Fade Up</p>
              </CardContent>
            </Card>
            <Card className="animate-fade-in">
              <CardContent className="p-4 text-center">
                <p className="text-sm font-medium">Fade In</p>
              </CardContent>
            </Card>
            <Card className="animate-slide-in-left">
              <CardContent className="p-4 text-center">
                <p className="text-sm font-medium">Slide Left</p>
              </CardContent>
            </Card>
            <Card className="animate-slide-in-right">
              <CardContent className="p-4 text-center">
                <p className="text-sm font-medium">Slide Right</p>
              </CardContent>
            </Card>
          </div>
        </ShowcaseSection>
      </div>

      {/* Footer */}
      <PublicFooter />
    </div>
  );
}

// =============================================================================
// Helper Components
// =============================================================================

function ShowcaseSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-16">
      <div className="mb-6">
        <h2 className="text-2xl font-heading font-bold tracking-tight text-foreground">{title}</h2>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>
      <div className="p-6 rounded-xl border border-border bg-card/50">{children}</div>
    </section>
  );
}

function ColorSwatch({ color, label, description }: { color: string; label: string; description: string }) {
  return (
    <div>
      <div className={`h-16 rounded-lg ${color} border border-border/50`} />
      <p className="text-xs font-semibold mt-2">{label}</p>
      <p className="text-[10px] text-muted-foreground">{description}</p>
    </div>
  );
}

// Inline Icons
function PlusIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M5 12h14" /><path d="M12 5v14" />
    </svg>
  );
}
function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
function AttemptIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  );
}
function AccuracyIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
    </svg>
  );
}
function TimerIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
function RankIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 22V8a2 2 0 1 0-4 0v1" /><path d="M14 22V8a2 2 0 1 1 4 0v1" />
    </svg>
  );
}
function BookmarkEmptyIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
    </svg>
  );
}
