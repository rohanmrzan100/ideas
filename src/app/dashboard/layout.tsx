'use client';
import { Logout } from '@/api/auth';
import { fetchMyShops } from '@/api/shop';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/slices/app.slice';
import { useQuery } from '@tanstack/react-query';
import { BarChart2, Home, LogOut, Package, PlusCircle, Settings, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
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
import { Skeleton } from '@/components/ui/skeleton';
export default function SellerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;
  const isAuth = useAppSelector((s) => s.app.isAuthenticated);
  const isRestoringSession = useAppSelector((s) => s.app.isRestoringSession);
  const user = useAppSelector((s) => s.app.user);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isPending, error, data } = useQuery({
    queryKey: [],
    queryFn: () => fetchMyShops(),
  });

  console.log({ isPending, error, data });

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
  if (!isAuth && !isRestoringSession) {
    return <>Please log in first</>;
  }
  return (
    <div className="min-h-screen bg-[#F3F2EF] font-sans flex justify-center p-0 md:p-6">
      <div className="w-full max-w-400 flex flex-col md:flex-row gap-6">
        {/* --- LEFT SIDEBAR (Navigation) --- */}
        <aside className="hidden md:flex flex-col w-80 shrink-0 gap-4">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative">
            <div className="h-16 bg-brand/10"></div>
            <div className="px-4 pb-4 text-center -mt-8">
              <div className="relative w-16 h-16 mx-auto rounded-full border-2 border-white shadow-md overflow-hidden bg-white">
                <Image
                  src="https://github.com/shadcn.png"
                  alt="Profile"
                  fill
                  className="object-cover"
                />
              </div>
              {!user && <Skeleton className="h-4 w-full" />}
              <h3 className="mt-2 font-bold text-gray-900">{user?.name}</h3>
              <p className="text-xs text-gray-500">
                {data && data.map((shop) => shop.name).join(',', ' || ')}
                {!data && <Skeleton className="h-4 w-full" />}
              </p>
            </div>
            <div className="border-t border-gray-100 p-4 bg-gray-50/50">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500">Profile views</span>
                <span className="font-semibold text-brand">52</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Post impressions</span>
                <span className="font-semibold text-brand">1.2k</span>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 py-2">
            <nav className="flex flex-col">
              <NavItem
                icon={<Home size={20} />}
                label="Dashboard"
                href="/dashboard"
                active={isActive('/dashboard')}
              />
              <NavItem
                icon={<Package size={20} />}
                label="My Products"
                href="/dashboard/my-products"
                active={isActive('/dashboard/my-products')}
              />
              <NavItem
                icon={<PlusCircle size={20} />}
                label="Add Product"
                href="/dashboard/product"
                active={isActive('/dashboard/product')}
              />
              <NavItem
                icon={<ShoppingBag size={20} />}
                label="Orders"
                href="/dashboard/orders"
                badge="3"
                active={isActive('/dashboard/orders')}
              />
              <NavItem
                icon={<BarChart2 size={20} />}
                label="Analytics"
                href="/dashboard/analytics"
                active={isActive('/dashboard/analytics')}
              />
              <div className="my-2 border-b border-gray-100" />
              <NavItem
                icon={<Settings size={20} />}
                label="Settings"
                href="/dashboard/settings"
                active={isActive('/dashboard/settings')}
              />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button className="flex w-full items-center gap-4 px-5 py-3.5 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-all">
                    <LogOut size={20} />
                    <span>Logout</span>
                  </button>
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will log you out of your account and redirect you to the sign-in page.
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-red-600 hover:bg-red-700"
                      onClick={handleLogout}
                    >
                      Logout
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              {/* 
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-4 px-5 py-3.5 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-all"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button> */}
            </nav>
          </div>
        </aside>

        {/* --- MAIN CONTENT AREA --- */}
        <main className="flex-1 min-w-0">{children}</main>

        {/* --- RIGHT SIDEBAR (Widgets - Optional context) --- */}
        {/* <aside className="hidden xl:block w-72 shrink-0 space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <h4 className="font-bold text-gray-900 mb-3 text-sm">Top Selling Items</h4>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3 items-center">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-gray-900">Winter Jacket</p>
                    <p className="text-[10px] text-gray-500">23 Sold this week</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2 text-xs font-semibold text-gray-500 hover:bg-gray-50 rounded-lg transition">
              View all analytics
            </button>
          </div>
        </aside> */}
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const NavItem = ({ icon, label, href, active, badge }: any) => (
  <Link
    href={href}
    className={`flex items-center gap-4 px-5 py-3.5 text-sm font-medium transition-all relative
      ${
        active
          ? 'text-brand border-l-4 border-brand bg-brand/5'
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent'
      }`}
  >
    {icon}
    <span>{label}</span>
    {badge && (
      <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
        {badge}
      </span>
    )}
  </Link>
);
