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
    <footer className="bg-[#f5f5f5] py-16 px-6 text-black">
      <div className="max-w-6xl mx-auto">

        {/* Main grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-12">

          {/* Brand column — full width on mobile */}
          <div className="col-span-2 sm:col-span-2 md:col-span-1">
           <div className="flex  ml-0 text-[black] p-0 font-bolder" style={{fontWeight:'100px'}}>
           <a href='/splash' style={{textDecoration: 'none'}}><b><div className="flex gap-0" ><img className='w-12 h-12' src="/mira-removebg-preview.png" /><div className="mt-6">ira</div></div></b></a> </div>
            <p className="text-sm text-gray-600 mb-6 max-w-xs leading-relaxed">
              Empowering institutions with secure, fast, and reliable payment solutions.
            </p>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((social) => (
                <Button
                  key={social.label}
                  variant="outline"
                  size="icon"
                  className="transition-all hover:scale-110 border-black/20"
                  style={{ backgroundColor: "#fff", borderColor: "rgba(95, 103, 172, 0.25)" }}
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
                      className="text-sm text-gray-600 transition-colors"
                      style={{ color: "#6b7280" }}
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