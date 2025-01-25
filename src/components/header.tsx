import { useNavStore } from "@/stores/stores";
import { MenuIcon } from "lucide-react";
import Logo from "./logo";
import ProfileSnippet from "./profile-snippet";
import { Button } from "./ui/button";

const Header = () => {
  const { isOpen, setIsOpen } = useNavStore();
  return (
    <header className="sticky top-0 z-[49] flex h-16 items-center justify-between border-b bg-background p-4">
      <Logo />
      <div className="flex items-center gap-4">
        <ProfileSnippet />
        <Button
          size="icon"
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden"
        >
          <span className="sr-only">Toggle nav menu</span>
          <MenuIcon />
        </Button>
      </div>
    </header>
  );
};

export default Header;
