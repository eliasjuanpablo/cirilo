export default function Footer() {
  return (
    <footer className="flex">
      <div className="bold">{new Date().getFullYear()}</div>
      <a
        href="https://github.com/eliasjuanpablo/cirilo"
        target="_blank"
        rel="noreferrer"
      >
        source code
      </a>
    </footer>
  );
}
