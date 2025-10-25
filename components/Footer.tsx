import { FaYoutube, FaFacebook, FaInstagram, FaTiktok } from "react-icons/fa";

export default function Footer() {
  const socialLinks = [
    { 
      href: "https://www.youtube.com/@mihasznamatek", 
      Icon: FaYoutube, 
      color: "red-500" 
    },
    { 
      href: "https://www.facebook.com/profile.php?id=100075272401924", 
      Icon: FaFacebook, 
      color: "blue-500" 
    },
    { 
      href: "https://instagram.com/mihasznamatek", 
      Icon: FaInstagram, 
      color: "pink-500" 
    },
    { 
      href: "https://tiktok.com/@mihasznamatek", 
      Icon: FaTiktok, 
      color: "gray-200" 
    }
  ];

  return (
    <footer>
      {socialLinks.map(({ href, Icon, color }) => (
        <a
          key={href}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icon size={34} />
        </a>
      ))}
    </footer>
  );
}
