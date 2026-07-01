import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "https://x.com/Mira", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "https://www.linkedin.com/in/Mira", label: "LinkedIn" },
  ];

  const columns = [
    {
      heading: "Developers",
      links: [
        { label: "Dev Group", href: "#" },
        { label: "API Documentation", href: "#" },
        { label: "Meet-ups", href: "#" },
      ],
    },
    {
      heading: "Features",
      links: [
        { label: "Mira", href: "#" },
        { label: "MiraFood", href: "#" },
        { label: "MiraTiks", href: "#" },
      ],
    },
    {
      heading: "Company",
      links: [
        { label: "About", href: "/about" },
        { label: "Legal", href: "/privacy" },
        { label: "Blog", href: "/blogs" },
      ],
    },
  ];

  return (
    <footer className="bg-[rgb(201,221,176)] py-16 px-6 text-black">
      <div className="max-w-6xl mx-auto">

        {/* Main grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-12">

          {/* Brand column — full width on mobile */}
          <div className="col-span-2 sm:col-span-2 md:col-span-1">
            <h3 className="text-3xl font-bold mb-3 text-green-800">
              Mira<span className="text-green-600">Pay</span>
            </h3>
            <p className="text-sm text-gray-600 mb-6 max-w-xs leading-relaxed">
              Empowering institutions with secure, fast, and reliable payment solutions.
            </p>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((social) => (
                <Button
                  key={social.label}
                  variant="outline"
                  size="icon"
                  className="hover:bg-green-100 hover:border-green-400 transition-all hover:scale-110 border-black/20"
                  asChild
                >
                  <a href={social.href} aria-label={social.label}>
                    <social.icon className="w-4 h-4" />
                  </a>
                </Button>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.heading}>
              <h4 className="text-sm font-medium text-black mb-5">{col.heading}</h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-gray-600 hover:text-green-700 transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* Bottom bar */}
        <div className="border-t border-black/10 pt-6 text-center">
          <p className="text-xs text-gray-500">© 2026 Mira. All rights reserved.</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;