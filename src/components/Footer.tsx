import Link from "next/link";

const links = [
  { label: "About", href: "/about" },
  { label: "Help", href: "/help" },
  { label: "Contact", href: "/contact" },
];

const Footer = () => {
  return (
    <footer className="justify-center flex h-fit px-5 py-24 bg-purple-900 text-white">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div>Cos</div>
        <div>
          <ul className="flex flex-col gap-3 items-center">
            {links.map((link) => (
              <li key={link.label}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>Social media</div>
      </div>
    </footer>
  );
};

export default Footer;
