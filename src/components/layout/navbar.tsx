
"use client";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { Logo } from '@/components/core/logo';
import { Menu, LogOut, UserCircle, LayoutDashboard, UploadCloud, Trophy, History, Loader2, UserPlus, LogIn } from 'lucide-react';

const navLinks = [
  { href: '/leaderboard', label: 'Leaderboard', icon: Trophy, protected: false }, // Leaderboard is public
  { href: '/submit', label: 'Submit Code', icon: UploadCloud, protected: true },
  { href: '/submissions', label: 'My Submissions', icon: History, protected: true },
];

export function Navbar() {
  const pathname = usePathname();
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [clientLoaded, setClientLoaded] = useState(false);
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);


  useEffect(() => {
    setClientLoaded(true);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };
  
  const closeMobileSheet = () => setIsMobileSheetOpen(false);

  const renderUserActions = () => {
    if (!clientLoaded || loading) {
      return <Loader2 className="h-6 w-6 animate-spin text-primary" />;
    }

    if (user) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10 border-2 border-primary hover:border-accent transition-colors">
                <AvatarImage src={user.photoURL || `https://placehold.co/40x40.png?text=${(user.displayName || user.email || "U")[0].toUpperCase()}`} alt={user.displayName || 'User'} data-ai-hint="user avatar" />
                <AvatarFallback>{(user.displayName || user.email || "U")[0].toUpperCase()}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none truncate">{user.displayName || "User Profile"}</p>
                <p className="text-xs leading-none text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push('/submit')}>
              <UploadCloud className="mr-2 h-4 w-4" />
              <span>Submit Code</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/submissions')}>
              <History className="mr-2 h-4 w-4" />
              <span>My Submissions</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    } else {
      return (
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => router.push('/auth/login')}>
            <LogIn className="mr-2 h-4 w-4" /> Log In
          </Button>
          <Button onClick={() => router.push('/auth/register')}>
             <UserPlus className="mr-2 h-4 w-4" /> Register
          </Button>
        </div>
      );
    }
  };
  
  const MobileNav = () => (
    <Sheet open={isMobileSheetOpen} onOpenChange={setIsMobileSheetOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full max-w-xs bg-card p-0">
        <div className="p-4 border-b">
          <Logo size="md" />
        </div>
        <nav className="flex flex-col gap-1 p-4">
          {navLinks.map((link) => {
            if (link.protected && !user && clientLoaded && !loading) return null;
            if (link.protected && loading && !user) { // Still loading, don't show protected links yet
                 return ( // Optional: show a placeholder or nothing
                    <div key={`${link.href}-loader`} className="flex items-center gap-3 rounded-lg px-3 py-2 text-lg font-medium text-muted-foreground/50">
                        <link.icon className="h-5 w-5" />
                        <span>{link.label}</span>
                        <Loader2 className="h-4 w-4 animate-spin ml-auto" />
                    </div>
                );
            }
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMobileSheet}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium transition-colors hover:text-primary hover:bg-accent/10",
                  clientLoaded && pathname === link.href ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted/50"
                )}
              >
                <link.icon className="h-5 w-5" />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );


  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 md:gap-4"> {/* Adjusted gap for mobile */}
         <MobileNav />
          <div className={cn(isMobileSheetOpen && "opacity-0", "transition-opacity duration-300")}> {/* Hide logo when sheet is open for cleaner look if needed, or remove this cn */}
            <Logo />
          </div>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navLinks.map((link) => {
             if (link.protected && !user && clientLoaded && !loading) return null;
             if (link.protected && loading && !user) return null; // Don't show protected links while loading and no user
            return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "transition-colors hover:text-primary",
                clientLoaded && pathname === link.href ? "text-primary font-semibold" : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          )}
          )}
        </nav>
        <div className="flex items-center">
          {renderUserActions()}
        </div>
      </div>
    </header>
  );
}
