
export function Footer() {
  return (
    <footer className="border-t border-border/40 py-6 mt-auto bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground max-w-7xl">
        <p>&copy; {new Date().getFullYear()} Profile Forge. All rights reserved.</p>
        <p className="mt-1">An NLP Competition Platform.</p>
      </div>
    </footer>
  );
}
