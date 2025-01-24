import Logo from "./logo";

const PageHeader = () => {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center border-b bg-background px-8">
      <Logo />
    </header>
  );
};

export default PageHeader;
