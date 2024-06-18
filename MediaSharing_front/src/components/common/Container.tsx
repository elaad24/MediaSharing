interface Container {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ChildComponent: React.ComponentType<any>;
}

export default function Container({ ChildComponent }: Container) {
  return (
    <div className="container my-2">
      <ChildComponent />
    </div>
  );
}
