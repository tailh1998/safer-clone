import React from "react"

import { Loader2 } from "lucide-react"

import { Button } from "./ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog"

type WarningPopupProps = {
  setSelectedId: (data: null) => void
  handleDeleteTask: VoidFunction
  isOpen: boolean
  isLoading: boolean
  setIsOpen: (flag: boolean) => void
}

const WarningPopup = ({
  isLoading,
  isOpen,
  setIsOpen,
  handleDeleteTask,
  setSelectedId
}: WarningPopupProps) => {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          setIsOpen(false)
          setSelectedId(null)
        }
      }}
    >
      <DialogContent className="max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Do you want to delete it?</DialogTitle>
        </DialogHeader>
        <DialogFooter>
          <div className="flex gap-1 justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              Close
            </Button>
            <Button
              disabled={isLoading}
              className="border-red-500 text-red-500 hover:bg-red-400"
              variant="outline"
              size="sm"
              onClick={handleDeleteTask}
            >
              {isLoading && <Loader2 className="h-8 w-8 animate-spin text-red-500" />}
              Delete
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default WarningPopup
