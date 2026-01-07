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
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/slices/app.slice';
import {
  BarChart2,
  Bell,
  ChevronDown,
  Globe,
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
  UserCircle,
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
              Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  </div>
);

// --- Top Header Component ---
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TopHeader = ({ user }: any) => (
  <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-20">
    {/* Left: Breadcrumb or Shop Switcher */}
    <div className="flex items-center gap-4">
      <ShopSwitcher />
    </div>

    {/* Right: Actions & Profile */}
    <div className="flex items-center gap-4">
      <Button variant="ghost" size="sm" className="hidden md:flex gap-2 text-gray-600">
        <Globe size={16} /> EN <ChevronDown size={14} />
      </Button>
      <Button className="bg-brand hover:bg-brand-primary/90 text-white shadow-sm font-semibold h-9">
        New Order
      </Button>
      <div className="h-8 w-px bg-gray-200 mx-2 hidden md:block" />
      <Button variant="ghost" size="icon" className="relative text-gray-500">
        <Bell size={20} />
        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
      </Button>

      <div className="flex items-center gap-3 pl-2 cursor-pointer">
        <div className="text-right hidden md:block">
          <p className="text-sm font-bold text-gray-900 leading-none">{user?.name}</p>
          <p className="text-[11px] text-gray-500 mt-1">{user?.role || 'Seller'}</p>
        </div>
        <div className="w-9 h-9 rounded-full bg-gray-100 border border-gray-200 overflow-hidden relative">
          <Image src="https://github.com/shadcn.png" alt="User" fill className="object-cover" />
        </div>
      </div>
    </div>
  </header>
);

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
          <TopHeader user={user} />
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
