'use client';
import { Logout } from '@/api/auth';
import ShopSwitcher from '@/components/seller/ShopSwitcher';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/slices/app.slice';
import {
  BarChart2,
  Bell,
  ChevronDown,
  CreditCard,
  Home,
  LogOut,
  Menu,
  Package,
  Palette,
  Plus,
  Settings,
  ShoppingBag,
  Store,
  Ticket,
  User,
  Users,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// --- Sidebar Content ---
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SidebarContent = ({ isActive, handleLogout }: any) => (
  <div className="flex flex-col h-full bg-white border-r border-gray-200">
    {/* Logo Area */}
    <div className="h-16 flex items-center px-6 border-b border-gray-100">
      <div className="flex items-center gap-2 font-bold text-xl text-gray-900 tracking-tight">
        <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center text-white">
          <Store size={18} />
        </div>
        <span>InstaShop</span>
      </div>
    </div>

    {/* Navigation */}
    <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
      <NavItem
        icon={<Home size={20} />}
        label="Dashboard"
        href="/dashboard"
        active={isActive('/dashboard')}
      />

      <div className="px-3 pt-6 pb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
        Inventory
      </div>
      <NavItem
        icon={<Package size={20} />}
        label="My Products"
        href="/dashboard/my-products"
        active={isActive('/dashboard/my-products')}
      />
      <NavItem
        icon={<Plus size={20} />}
        label="Add Product"
        href="/dashboard/product"
        active={isActive('/dashboard/product')}
      />

      <div className="px-3 pt-6 pb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
        Business
      </div>
      <NavItem
        icon={<ShoppingBag size={20} />}
        label="Orders"
        href="/dashboard/orders"
        active={isActive('/dashboard/orders')}
        badge={3}
      />
      <NavItem
        icon={<Users size={20} />}
        label="Customers"
        href="/dashboard/customers"
        active={isActive('/dashboard/customers')}
      />
      <NavItem
        icon={<Ticket size={20} />}
        label="Discounts"
        href="/dashboard/discounts"
        active={isActive('/dashboard/discounts')}
      />
      <NavItem
        icon={<BarChart2 size={20} />}
        label="Analytics"
        href="/dashboard/analytics"
        active={isActive('/dashboard/analytics')}
      />

      <div className="px-3 pt-6 pb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
        Configuration
      </div>
      <NavItem
        icon={<Palette size={20} />}
        label="Store Design"
        href="/dashboard/design"
        active={isActive('/dashboard/design')}
      />
      <NavItem
        icon={<Settings size={20} />}
        label="Settings"
        href="/dashboard/settings"
        active={isActive('/dashboard/settings')}
      />
    </div>

    {/* Footer Actions */}
    <div className="p-4 border-t border-gray-200">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button className="flex w-full items-center gap-3 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors">
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign out?</AlertDialogTitle>
            <AlertDialogDescription>
              You will be returned to the login screen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleLogout}>
              Sign out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  </div>
);

// --- Top Header Component ---
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TopHeader = ({ user, handleLogout }: any) => {
  const getInitials = (name: string) =>
    name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'IS';

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-20">
      {/* Left: Spacer */}
      <div></div>

      {/* Right: Actions & Profile */}
      <div className="flex items-center gap-4">
        <ShopSwitcher />

        <div className="h-8 w-px bg-gray-200 mx-2 hidden md:block" />

        <Button
          variant="ghost"
          size="icon"
          className="relative text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
        >
          <Bell size={20} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        </Button>

        <Popover>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-3 pl-3 pr-1 py-1 rounded-full hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all outline-none group ml-1">
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-gray-900 leading-none group-hover:text-brand transition-colors whitespace-nowrap">
                  {user?.name || 'Seller'}
                </p>
                <div className="flex items-center justify-end gap-1.5 mt-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_3px_rgba(34,197,94,0.6)]" />
                  <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">
                    {user?.role || 'Seller'}
                  </p>
                </div>
              </div>

              <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gray-100 border border-gray-200 group-hover:border-brand/20 overflow-hidden relative shadow-sm transition-all flex items-center justify-center shrink-0">
                {user?.image ? (
                  <Image src={user.image} alt={user.name} fill className="object-cover" />
                ) : (
                  <span className="text-xs font-bold text-gray-600">{getInitials(user?.name)}</span>
                )}
              </div>

              <ChevronDown
                size={16}
                className="text-gray-400 group-hover:text-gray-600 transition-transform duration-200 group-data-[state=open]:rotate-180 mr-1 hidden md:block"
              />
            </button>
          </PopoverTrigger>

          <PopoverContent className="w-64 p-2" align="end" sideOffset={8}>
            {/* User Info Header inside Dropdown */}
            <div className="flex items-center gap-3 p-3 border-b border-gray-100 bg-gray-50/50 -mx-2 -mt-2 rounded-t-lg mb-2">
              <div className="w-10 h-10 rounded-full bg-white border border-gray-200 overflow-hidden relative shadow-sm shrink-0 flex items-center justify-center">
                {user?.image ? (
                  <Image src={user.image} alt={user.name} fill className="object-cover" />
                ) : (
                  <span className="text-sm font-bold text-gray-600">{getInitials(user?.name)}</span>
                )}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="font-bold text-sm text-gray-900 truncate">
                  {user?.name || 'Seller Account'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email || 'seller@instashop.com'}
                </p>
              </div>
            </div>

            <div className="space-y-1">
              <Link
                href="/dashboard/account"
                className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-all group"
              >
                <User
                  size={16}
                  className="text-gray-400 group-hover:text-brand transition-colors"
                />
                <span>My Profile</span>
              </Link>

              <Link
                href="/dashboard/account"
                className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-all group"
              >
                <CreditCard
                  size={16}
                  className="text-gray-400 group-hover:text-brand transition-colors"
                />
                <span>Billing</span>
              </Link>

              <Link
                href="/dashboard/settings"
                className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-all group"
              >
                <Settings
                  size={16}
                  className="text-gray-400 group-hover:text-brand transition-colors"
                />
                <span>Settings</span>
              </Link>
            </div>

            <div className="h-px bg-gray-100 my-2 mx-1" />

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-all group"
            >
              <LogOut
                size={16}
                className="group-hover:scale-110 transition-transform text-red-500"
              />
              <span>Sign out</span>
            </button>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
};

// --- Main Layout ---
export default function SellerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;
  const isAuth = useAppSelector((s) => s.app.isAuthenticated);
  const isRestoringSession = useAppSelector((s) => s.app.isRestoringSession);
  const user = useAppSelector((s) => s.app.user);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isAuth && !isRestoringSession) {
      router.push('/sign-in');
    }
  }, [isAuth, router, isRestoringSession]);

  const handleLogout = async () => {
    dispatch(logout());
    await Logout();
    router.push('/sign-in');
  };

  if (!isAuth && !isRestoringSession) return null;

  return (
    <div className="flex h-screen bg-[#F8F9FA] font-sans overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 shrink-0 h-full">
        <SidebarContent user={user} isActive={isActive} handleLogout={handleLogout} />
      </aside>

      <div className="flex-1 flex flex-col min-w-0 h-full">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between bg-white px-4 h-16 border-b border-gray-200">
          <div className="flex items-center gap-2 font-bold text-lg text-gray-900">
            <Store className="text-brand" />
            <span>InstaShop</span>
          </div>
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-[80%]">
              <SidebarContent user={user} isActive={isActive} handleLogout={handleLogout} />
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:block">
          <TopHeader user={user} handleLogout={handleLogout} />
        </div>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 scroll-smooth">{children}</main>
      </div>
    </div>
  );
}

// Helper Nav Item
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const NavItem = ({ icon, label, href, active, badge }: any) => (
  <Link
    href={href}
    className={`flex items-center gap-3 px-3 py-2.5 mx-2 rounded-lg text-sm font-medium transition-all relative group
      ${active ? 'bg-brand/5 text-brand' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
  >
    <span className={active ? 'text-brand' : 'text-gray-400 group-hover:text-gray-600'}>
      {icon}
    </span>
    <span>{label}</span>
    {badge && (
      <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
        {badge}
      </span>
    )}
  </Link>
);
