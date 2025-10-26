import Link from "next/link";
import { Brain, Twitter, Github, Linkedin, Mail, Heart } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { label: "Features", href: "/brains" },
      { label: "Pricing", href: "/pricing" },
      { label: "Brains", href: "/brains" },
      { label: "Bookmarks", href: "/bookmarks" }
    ],
    company: [
      { label: "About Us", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Contact", href: "#" }
    ],
    legal: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Cookie Policy", href: "#" },
      { label: "GDPR", href: "#" }
    ],
    support: [
      { label: "Help Center", href: "#" },
      { label: "Documentation", href: "#" },
      { label: "API Reference", href: "#" },
      { label: "Community", href: "#" }
    ]
  };

  const socialLinks = [
    { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
    { icon: Github, href: "https://github.com", label: "GitHub" },
    { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
    { icon: Mail, href: "mailto:contact@snowbrain.ai", label: "Email" }
  ];

  return (
    <footer className="bg-gradient-to-br from-purple-900 via-blue-900 to-cyan-900 text-white mt-auto">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 group mb-6">
              <div className="p-2 bg-white/10 backdrop-blur rounded-2xl group-hover:bg-white/20 transition-all duration-200">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <span className="text-2xl font-bold gradient_text">SnowBrain</span>
            </Link>
            <p className="text-white/80 mb-6 text-balance max-w-sm">
              Revolutionary AI-powered learning platform that adapts to your unique learning style and helps you master any subject faster.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-white/10 backdrop-blur rounded-xl hover:bg-white/20 hover:scale-110 transition-all duration-200 group"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5 text-white group-hover:text-yellow-300 transition-colors" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-white hover:translate-x-1 inline-block transition-all duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-white hover:translate-x-1 inline-block transition-all duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-white hover:translate-x-1 inline-block transition-all duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-white hover:translate-x-1 inline-block transition-all duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4 gradient_text">
              Stay Updated
            </h3>
            <p className="text-white/70 mb-6">
              Get the latest updates, learning tips, and exclusive offers delivered to your inbox.
            </p>
            <form className="flex gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-3 bg-white/10 backdrop-blur border border-white/20 rounded-2xl text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
              />
              <button
                type="submit"
                className="px-8 py-3 bg-white text-purple-900 font-bold rounded-2xl hover:bg-yellow-400 hover:scale-105 transition-all duration-200 shadow-lg"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/60 text-sm text-center md:text-left">
              © {currentYear} SnowBrain. All rights reserved. Made with{" "}
              <Heart className="inline w-4 h-4 text-red-400 fill-current" /> for learners worldwide.
            </p>
            <div className="flex items-center gap-6 text-sm text-white/60">
              <Link href="#" className="hover:text-white transition-colors">
                Status
              </Link>
              <span>•</span>
              <Link href="#" className="hover:text-white transition-colors">
                Changelog
              </Link>
              <span>•</span>
              <Link href="#" className="hover:text-white transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
