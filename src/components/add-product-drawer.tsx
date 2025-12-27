'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useMediaQuery } from '@/hooks/use-media-query';

export function AddProduct() {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Add Product</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle> Add Product</DialogTitle>
            <DialogDescription>Add your product's detail here.</DialogDescription>
          </DialogHeader>
          <ProfileForm />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">Add Product</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Add Product</DrawerTitle>
          <DrawerDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </DrawerDescription>
        </DrawerHeader>
        <ProfileForm className="px-4" />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function ProfileForm({ className }: React.ComponentProps<'form'>) {
  return (
    <form className={cn('grid items-start gap-6', className)}>
      <div className="grid gap-3">
        <Label htmlFor="name">Name</Label>
        <Input type="text" id="name" />
      </div>
      <div className="grid gap-3">
        <Label htmlFor="image">Product Image</Label>
        <Input id="image" type="file" accept="image/*" />
      </div>
      <div className="grid gap-3">
        <Label htmlFor="color">Color</Label>
        <Input id="color" />
      </div>
      <div className="grid gap-3">
        <Label htmlFor="size">Size</Label>
        <Input id="size" />
      </div>
      <div className="grid gap-3">
        <Label htmlFor="price">Price</Label>
        <Input id="price" />
      </div>
      <Button type="submit">Add Product</Button>
    </form>
  );
}
