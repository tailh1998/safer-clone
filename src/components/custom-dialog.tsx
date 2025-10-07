import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { BaseAutocomplete } from "./custom-autocomplete"

export function DialogDemo() {
  const countries = [
    { label: "jp_Japan", value: "JP" },
    { label: "Vietnam", value: "VN" },
    { label: "United States", value: "US" },
    { label: "Germany", value: "DE" },
    { label: "France", value: "FR", disabled: true }
  ]
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="outline">Open Dialog</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name-1">Name</Label>
              <Input
                id="width"
                defaultValue="100%"
                className="col-span-2 h-8"
              />
              <BaseAutocomplete
                name="test101"
                options={countries}
                allowClear
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="username-1">Username</Label>
              <BaseAutocomplete
                name="test102"
                options={countries}
                allowClear
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
