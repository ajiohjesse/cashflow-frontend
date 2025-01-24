const GradientText = ({ children }: { children: string }) => {
  return (
    <span className="bg-gradient-to-r from-primary to-black bg-clip-text text-transparent">
      {children}
    </span>
  );
};

export default GradientText;
