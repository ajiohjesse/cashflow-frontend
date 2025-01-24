import Logo from "./logo";
import ProfileSnippet from "./profile-snippet";

const Header = () => {
  return (
    <header className="sticky top-0 z-[49] flex h-16 items-center justify-between border-b bg-background p-4">
      <Logo />
      <ProfileSnippet />
    </header>
  );
};

export default Header;
