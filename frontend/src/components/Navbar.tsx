import { User } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import Logo from "./Logo";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";

interface NavbarProps {
  isAuthenticated?: boolean;
  login?: () => void;
  logout?: () => void;
  user?: {
    email?: string;
    given_name?: string;
    family_name?: string;
  };
}
const Navbar = ({ isAuthenticated, login, logout, user }: NavbarProps) => {
  return (
    <nav className="w-full bg-gray-800 shadow-md">
      <div className="md:container md:mx-auto py-4 px-6 flex items-center justify-between">
        <Logo />
        {isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar className="cursor-pointer border border-gray-300">
                <AvatarFallback>
                  <User className="h-6 w-6" />
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <div>
                  <p className="font-bold">
                    {user?.given_name} {user?.family_name}
                  </p>
                  <p className="text-muted-foreground">{user?.email}</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer" onClick={logout}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button onClick={login}>LogIn</Button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
