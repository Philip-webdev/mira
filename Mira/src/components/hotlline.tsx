import { Facebook, Twitter, Instagram, Linkedin, Phone, Mail, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import footerBg from "@/assets/footer-bg.jpg";

function hotline(){
   
             const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
  ];

  const customerCare = [
    { icon: Phone, text: "(+234) 901 946 9723", label: "Call Us" },
    { icon: Mail, text: "Mirahelp@gmail.com", label: "Email Support" },
    { icon: MessageCircle, text: "Live Chat", label: "Chat with us" },
  ];

  return (
    <div className="relative py-20 px-4 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={footerBg} 
          alt="Professional background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-background/60"></div>
      </div>
      
      <div className="container mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Brand and Social Media */}
          <div className="text-center md:text-left">
            <h3 className="text-3xl font-bold mb-4">
              Mira<span className="bg-gradient-primary bg-clip-text text-transparent">Pay</span>
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              Empowering college students with secure, fast, and reliable payment solutions for their educational journey.
            </p>
            
            <div className="flex justify-center md:justify-start gap-4">
              {socialLinks.map((social) => (
                <Button
                  key={social.label}
                  variant="outline"
                  size="icon"
                  className="hover:bg-primary/10 hover:border-primary/50 transition-all hover:scale-110"
                  asChild
                >
                  <a href={social.href} aria-label={social.label}>
                    <social.icon className="w-5 h-5" />
                  </a>
                </Button>
              ))}
            </div>
          </div>

          {/* Customer Care */}
          <div className="text-center md:text-left">
            <h4 className="text-xl font-semibold mb-6">Customer Care</h4>
            <div className="space-y-4">
              {customerCare.map((contact, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 justify-center md:justify-start group cursor-pointer hover:text-primary transition-colors"
                >
                  <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <contact.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">{contact.label}</div>
                    <div className="text-sm text-muted-foreground">{contact.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border/50 text-center">
          <p className="text-muted-foreground text-sm">
            © 2025 Mira. All rights reserved. | Secure payments for the next generation.
          </p>
        </div>
      </div>
        </div>
    )
};
export default hotline;